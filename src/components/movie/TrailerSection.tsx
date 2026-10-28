import React from 'react'
import './TrailerSection.css'

interface TrailerSectionProps {
  trailerUrl?: string
  bannerUrl?: string
}

export const TrailerSection: React.FC<TrailerSectionProps> = ({ trailerUrl, bannerUrl }) => {
  // Trích xuất YouTube embed ID nếu có
  const getEmbedUrl = (url?: string) => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null
  }

  const embedUrl = getEmbedUrl(trailerUrl)

  return (
    <section className="trailer-section">
      <h2 className="section-title">TRAILER</h2>

      <div className="trailer-grid">
        {embedUrl ? (
          <div className="trailer-video-box">
            <iframe
              src={embedUrl}
              title="Movie Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="trailer-iframe"
            />
          </div>
        ) : (
          <div className="trailer-placeholder" style={{ backgroundImage: `url(${bannerUrl})` }}>
            <a
              href={trailerUrl || '#'}
              target="_blank"
              rel="noreferrer"
              className="trailer-play-link"
            >
              <div className="trailer-play-btn">▶</div>
              <span>XEM TRAILER TRÊN YOUTUBE</span>
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
