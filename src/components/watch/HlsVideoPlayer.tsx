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

const API_BASE_URL = 'http://localhost:3000/api/v1'
const SPEED_OPTIONS = [2, 1.75, 1.5, 1.3, 1.15, 1, 0.85, 0.5]

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const total = Math.floor(seconds)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`
}

export const HlsVideoPlayer: React.FC<HlsVideoPlayerProps> = ({
  videoUrl,
  poster,
  episodeTitle,
}) => {
  const frameRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const hlsRef = useRef<Hls | null>(null)

  const [levels, setLevels] = useState<QualityLevel[]>([])
  const [currentLevel, setCurrentLevel] = useState<number>(-1)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [openMenu, setOpenMenu] = useState<'speed' | 'quality' | null>(null)

  useEffect(() => {
    const video = videoRef.current
    setLevels([])
    setCurrentLevel(-1)
    setErrorMsg(null)
    setCurrentTime(0)
    setDuration(0)
    setIsPlaying(false)
    setOpenMenu(null)

    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }

    if (!video || !videoUrl) return

    const resolvedUrl = videoUrl.startsWith('http') ? videoUrl : `${API_BASE_URL}${videoUrl}`

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        xhrSetup: (xhr, url) => {
          if (url.startsWith(API_BASE_URL)) {
            const token = localStorage.getItem('token')
            if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)
          }
        },
      })
      hlsRef.current = hls

      hls.loadSource(resolvedUrl)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
        setLevels(
          data.levels.map((lvl, index) => ({
            index,
            label: `${lvl.height}p`,
          }))
        )
        video.play().catch(() => {
          video.muted = true
          setIsMuted(true)
          video.play().catch(() => {})
        })
      })

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (!data.fatal) return

        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          if (data.response?.code === 401 || data.response?.code === 403) {
            setErrorMsg('Vui lòng đăng nhập để xem phim.')
            hls.destroy()
          } else {
            setErrorMsg('Lỗi mạng khi tải luồng video. Đang thử lại...')
            hls.startLoad()
          }
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError()
        } else {
          setErrorMsg('Không thể phát nguồn video này.')
          hls.destroy()
        }
      })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = resolvedUrl
      video.play().catch(() => {
        video.muted = true
        setIsMuted(true)
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

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }
    document.addEventListener('fullscreenchange', handleFsChange)
    return () => document.removeEventListener('fullscreenchange', handleFsChange)
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    setOpenMenu(null)
    if (video.paused) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }

  const seekBy = (delta: number) => {
    const video = videoRef.current
    if (!video) return
    const next = Math.min(Math.max(0, video.currentTime + delta), duration || video.duration || 0)
    video.currentTime = next
    setCurrentTime(next)
  }

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    const val = Number(e.target.value)
    if (!video) return
    video.currentTime = val
    setCurrentTime(val)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    const nextMuted = !video.muted
    video.muted = nextMuted
    setIsMuted(nextMuted)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    const val = Number(e.target.value)
    if (!video) return
    video.volume = val
    video.muted = val === 0
    setVolume(val)
    setIsMuted(val === 0)
  }

  const handleSelectSpeed = (rate: number) => {
    const video = videoRef.current
    if (video) video.playbackRate = rate
    setPlaybackRate(rate)
    setOpenMenu(null)
  }

  const handleSelectQuality = (index: number) => {
    setCurrentLevel(index)
    if (hlsRef.current) {
      hlsRef.current.currentLevel = index
    }
    setOpenMenu(null)
  }

  const toggleFullscreen = () => {
    const frame = frameRef.current
    if (!frame) return
    if (!document.fullscreenElement) {
      frame.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
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

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0
  const activeQualityLabel =
    currentLevel === -1
      ? 'Auto'
      : levels.find((l) => l.index === currentLevel)?.label || 'Auto'

  return (
    <div className="hls-player-wrapper">
      <div
        ref={frameRef}
        className={`hls-video-frame ${!isPlaying || openMenu ? 'controls-visible' : ''}`}
        onMouseLeave={() => setOpenMenu(null)}
      >
        {/* Thẻ <video> chiếu phim HLS */}
        <video
          ref={videoRef}
          poster={poster}
          autoPlay
          playsInline
          className="hls-video-element"
          onClick={togglePlay}
          onDoubleClick={toggleFullscreen}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
          onLoadedMetadata={() => {
            const video = videoRef.current
            if (!video) return
            setDuration(video.duration || 0)
            setIsMuted(video.muted)
            setVolume(video.volume)
          }}
        />

        {/* Thanh điều khiển trượt từ dưới lên khi hover */}
        <div className="hls-controls-overlay">
          {/* Thanh tua đỏ */}
          <div className="hls-progress-row">
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={handleSeekChange}
              className="hls-progress-input"
              style={{
                background: `linear-gradient(to right, #e50914 ${progressPercent}%, rgba(255,255,255,0.28) ${progressPercent}%)`,
              }}
            />
          </div>

          <div className="hls-controls-row">
            {/* Cụm nút bên trái: Play, -5s, +5s, Loa, Thời gian */}
            <div className="hls-controls-left">
              <button type="button" className="hls-ctrl-btn" onClick={togglePlay} title={isPlaying ? 'Tạm dừng' : 'Phát'}>
                {isPlaying ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 4l15 8-15 8V4z" />
                  </svg>
                )}
              </button>

              <button type="button" className="hls-ctrl-btn hls-seek-btn" onClick={() => seekBy(-5)} title="Tua lùi 5 giây">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                <span className="hls-seek-num">5</span>
              </button>

              <button type="button" className="hls-ctrl-btn hls-seek-btn" onClick={() => seekBy(5)} title="Tua tới 5 giây">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
                  <path d="M21 3v5h-5" />
                </svg>
                <span className="hls-seek-num">5</span>
              </button>

              <div className="hls-volume-group">
                <button type="button" className="hls-ctrl-btn" onClick={toggleMute} title={isMuted ? 'Bật tiếng' : 'Tắt tiếng'}>
                  {isMuted || volume === 0 ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                      <line x1="23" y1="9" x2="17" y2="15" />
                      <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    </svg>
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="hls-volume-slider"
                />
              </div>

              <span className="hls-time-display">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Cụm nút bên phải: Tốc độ, Fullscreen, Độ phân giải */}
            <div className="hls-controls-right">
              {/* Chọn tốc độ */}
              <div className="hls-menu-anchor">
                <button
                  type="button"
                  className="hls-ctrl-btn hls-text-btn"
                  onClick={() => setOpenMenu(openMenu === 'speed' ? null : 'speed')}
                  title="Tốc độ phát"
                >
                  {playbackRate}x
                </button>

                {openMenu === 'speed' && (
                  <div className="hls-popup-menu">
                    {SPEED_OPTIONS.map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => handleSelectSpeed(rate)}
                        className={`hls-popup-item ${playbackRate === rate ? 'active' : ''}`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Toàn màn hình */}
              <button
                type="button"
                className="hls-ctrl-btn"
                onClick={toggleFullscreen}
                title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
              >
                {isFullscreen ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                  </svg>
                )}
              </button>

              {/* Chọn độ phân giải */}
              <div className="hls-menu-anchor">
                <button
                  type="button"
                  className="hls-ctrl-btn hls-quality-trigger"
                  onClick={() => setOpenMenu(openMenu === 'quality' ? null : 'quality')}
                  title="Độ phân giải"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M6 12h4M14 12h4M6 16h12" />
                  </svg>
                  <span className="hls-quality-badge">{activeQualityLabel}</span>
                </button>

                {openMenu === 'quality' && (
                  <div className="hls-popup-menu">
                    <button
                      type="button"
                      onClick={() => handleSelectQuality(-1)}
                      className={`hls-popup-item ${currentLevel === -1 ? 'active' : ''}`}
                    >
                      Auto
                    </button>
                    {levels.map((lvl) => (
                      <button
                        key={lvl.index}
                        type="button"
                        onClick={() => handleSelectQuality(lvl.index)}
                        className={`hls-popup-item ${currentLevel === lvl.index ? 'active' : ''}`}
                      >
                        {lvl.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {errorMsg && <div className="hls-player-error">{errorMsg}</div>}
    </div>
  )
}
