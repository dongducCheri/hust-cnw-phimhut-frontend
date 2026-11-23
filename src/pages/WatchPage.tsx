import React, { useEffect, useState } from 'react'
import { movieApi } from '../api/movieApi'
import type { Episode, MovieDetail } from '../types/movie'
import { HlsVideoPlayer } from '../components/watch/HlsVideoPlayer'
import './WatchPage.css'

interface WatchPageProps {
  movieId: number
  onBackToDetail: () => void
}

export const WatchPage: React.FC<WatchPageProps> = ({ movieId, onBackToDetail }) => {
  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(null)

    movieApi
      .getMovieById(movieId)
      .then((data) => {
        if (!isMounted) return
        setMovie(data)

        const episodes = data.episodes || []
        const defaultEpisode = episodes.find((ep) => Boolean(ep.video_url)) || episodes[0] || null
        setCurrentEpisode(defaultEpisode)
        setLoading(false)
      })
      .catch(() => {
        if (!isMounted) return
        setError('Không thể tải thông tin phim.')
        setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [movieId])

  if (loading) {
    return (
      <div className="watch-loading">
        <div className="spinner"></div>
        <p>Đang chuẩn bị trình phát phim...</p>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="watch-empty">
        <p>{error || 'Không tìm thấy phim.'}</p>
        <button type="button" className="watch-back-btn" onClick={onBackToDetail}>
          ← Quay lại chi tiết phim
        </button>
      </div>
    )
  }

  return (
    <div className="watch-page">
      <div className="watch-container">
        <button type="button" className="watch-back-btn" onClick={onBackToDetail}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Quay lại chi tiết phim
        </button>

        <HlsVideoPlayer
          videoUrl={currentEpisode?.video_url}
          poster={movie.banner_url || movie.poster_url}
          episodeTitle={currentEpisode?.title}
        />

        <div className="watch-info-card">
          <h1 className="watch-movie-title">{movie.title}</h1>
          {currentEpisode && (
            <p className="watch-episode-subtitle">
              Đang xem: Mùa {currentEpisode.season_number} - Tập {currentEpisode.episode_number}: {currentEpisode.title}
            </p>
          )}
          {movie.overview && <p className="watch-movie-overview">{movie.overview}</p>}
        </div>

        {movie.episodes && movie.episodes.length > 0 && (
          <section className="watch-episodes-section">
            <h2 className="watch-section-title">Danh sách tập</h2>
            <div className="watch-episodes-grid">
              {movie.episodes.map((ep) => {
                const isSelected = currentEpisode?.id === ep.id
                const hasVideo = Boolean(ep.video_url)

                return (
                  <button
                    key={ep.id}
                    type="button"
                    onClick={() => setCurrentEpisode(ep)}
                    className={`watch-episode-btn ${isSelected ? 'active' : ''}`}
                  >
                    <span className="watch-ep-number">Tập {ep.episode_number}</span>
                    <span className="watch-ep-title">{ep.title}</span>
                    {!hasVideo && <span className="watch-ep-pending">Đang cập nhật</span>}
                  </button>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
