import React, { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import './HlsVideoPlayer.css'

interface HlsVideoPlayerProps {
  videoUrl?: string | null
  poster?: string
  episodeTitle?: string
}

interface QualityLevel {
  index: number
  label: string
}

export const HlsVideoPlayer: React.FC<HlsVideoPlayerProps> = ({
  videoUrl,
  poster,
  episodeTitle,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const hlsRef = useRef<Hls | null>(null)

  const [levels, setLevels] = useState<QualityLevel[]>([])
  const [currentLevel, setCurrentLevel] = useState<number>(-1)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    const video = videoRef.current
    setLevels([])
    setCurrentLevel(-1)
    setErrorMsg(null)

    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }

    if (!video || !videoUrl) return

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true })
      hlsRef.current = hls

      hls.loadSource(videoUrl)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
        setLevels(
          data.levels.map((lvl, index) => ({
            index,
            label: `${lvl.height}p`,
          }))
        )
        video.play().catch(() => {
          // Nếu trình duyệt chặn autoplay có tiếng (vd khi F5), bật muted để vẫn tự phát
          video.muted = true
          video.play().catch(() => {})
        })
      })

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (!data.fatal) return

        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          setErrorMsg('Lỗi mạng khi tải luồng video. Đang thử lại...')
          hls.startLoad()
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError()
        } else {
          setErrorMsg('Không thể phát nguồn video này.')
          hls.destroy()
        }
      })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoUrl
      video.play().catch(() => {
        video.muted = true
        video.play().catch(() => {})
      })
    } else {
      setErrorMsg('Trình duyệt không hỗ trợ phát HLS (.m3u8).')
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [videoUrl])

  const handleSelectQuality = (index: number) => {
    setCurrentLevel(index)
    if (hlsRef.current) {
      hlsRef.current.currentLevel = index
    }
  }

  if (!videoUrl) {
    return (
      <div className="hls-player-empty">
        <p className="hls-empty-title">Tập phim đang được cập nhật...</p>
        {episodeTitle && <p className="hls-empty-subtitle">{episodeTitle}</p>}
      </div>
    )
  }

  return (
    <div className="hls-player-wrapper">
      <div className="hls-video-frame">
        {/* Thẻ <video> chiếu phim HLS */}
        <video
          ref={videoRef}
          poster={poster}
          controls
          autoPlay
          playsInline
          className="hls-video-element"
        />
      </div>

      {errorMsg && <div className="hls-player-error">{errorMsg}</div>}

      {levels.length > 0 && (
        <div className="hls-quality-bar">
          <span className="hls-quality-label">Chất lượng:</span>
          <button
            type="button"
            onClick={() => handleSelectQuality(-1)}
            className={`hls-quality-btn ${currentLevel === -1 ? 'active' : ''}`}
          >
            Auto
          </button>
          {levels.map((lvl) => (
            <button
              key={lvl.index}
              type="button"
              onClick={() => handleSelectQuality(lvl.index)}
              className={`hls-quality-btn ${currentLevel === lvl.index ? 'active' : ''}`}
            >
              {lvl.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
