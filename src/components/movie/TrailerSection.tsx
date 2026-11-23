import React from 'react'
import './TrailerSection.css'

interface TrailerSectionProps {
  trailerUrl?: string
  bannerUrl?: string
}

export const TrailerSection: React.FC<TrailerSectionProps> = ({ trailerUrl, bannerUrl }) => {
  // Trích xuất YouTube Video ID từ nhiều định dạng URL khác nhau
  const getYouTubeId = (url?: string): string | null => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const videoId = getYouTubeId(trailerUrl)

  // Nếu có ID YouTube thì lấy thumbnail YouTube độ nét cao, nếu không thì lấy banner của phim
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : bannerUrl || 'https://placehold.co/680x380/181d2c/ffffff?text=Trailer'

  // Link đích khi click vào: link trailer gốc hoặc link tìm kiếm
  const targetUrl =
    trailerUrl && trailerUrl.startsWith('http')
      ? trailerUrl
      : videoId
        ? `https://www.youtube.com/watch?v=${videoId}`
        : '#'

  if (!trailerUrl && !bannerUrl) return null

  return (
    <section className="trailer-section">
      <h2 className="section-title">TRAILER</h2>

      <div className="trailer-grid">
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="trailer-thumbnail-card"
          title="Xem trailer trên YouTube"
        >
          {/* Ảnh thumbnail */}
          <img
            src={thumbnailUrl}
            alt="Movie Trailer Thumbnail"
            className="trailer-thumb-img"
            onError={(e) => {
              if (bannerUrl && e.currentTarget.src !== bannerUrl) {
                e.currentTarget.src = bannerUrl
              }
            }}
          />

          {/* Lớp phủ hover hiệu ứng rạp phim */}
          <div className="trailer-overlay">
            <div className="trailer-play-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="trailer-badge">YouTube</span>
          </div>
        </a>
      </div>
    </section>
  )
}
