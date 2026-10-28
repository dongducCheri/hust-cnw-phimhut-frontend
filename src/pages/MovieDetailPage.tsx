import React, { useEffect, useState } from 'react'
import type { MovieDetail } from '../types/movie'
import { movieApi } from '../api/movieApi'
import { CastList } from '../components/movie/CastList'
import { TrailerSection } from '../components/movie/TrailerSection'
import './MovieDetailPage.css'

interface MovieDetailPageProps {
  movieId: number
  onBack: () => void
}

export const MovieDetailPage: React.FC<MovieDetailPageProps> = ({ movieId, onBack }) => {
  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    movieApi
      .getMovieById(movieId)
      .then((data) => {
        setMovie(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [movieId])

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="spinner"></div>
        <p>Đang tải thông tin phim...</p>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="detail-empty">
        <p>Không tìm thấy thông tin phim.</p>
        <button className="back-btn" onClick={onBack}>← Quay lại</button>
      </div>
    )
  }

  // Format thời lượng phút -> "1g 39ph"
  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'Đang cập nhật'
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return h > 0 ? `${h}g ${m}ph` : `${m}ph`
  }

  // Lấy danh sách đạo diễn và kịch bản
  const directors = movie.creators?.filter((c) => c.job.toLowerCase().includes('đạo diễn') || c.job.toLowerCase().includes('director'))
  const writers = movie.creators?.filter((c) => c.job.toLowerCase().includes('kịch bản') || c.job.toLowerCase().includes('writer'))

  return (
    <div className="detail-page">
      {/* 1. Backdrop Banner Background */}
      <div
        className="backdrop-banner"
        style={{ backgroundImage: `url(${movie.banner_url || movie.poster_url})` }}
      >
        <div className="backdrop-gradient-overlay" />
      </div>

      {/* 2. Main Content */}
      <div className="detail-container">
        {/* Back navigation */}
        <button className="nav-back-btn" onClick={onBack}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Quay lại danh sách
        </button>

        {/* Hero Section */}
        <div className="movie-hero">
          {/* Left: Poster + Watch Button */}
          <div className="hero-left">
            <div className="detail-poster-wrapper">
              <img
                src={movie.poster_url || 'https://placehold.co/400x600/181d2c/ffffff?text=PhimHut'}
                alt={movie.title}
                className="detail-poster-img"
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = `https://placehold.co/400x600/181d2c/e50914?text=${encodeURIComponent(movie.title)}`
                }}
              />
            </div>

            <button className="watch-movie-btn" onClick={() => alert('Bắt đầu xem phim!')}>
              <span className="play-triangle">▶</span>
              <span>XEM PHIM</span>
            </button>
          </div>

          {/* Right: Info */}
          <div className="hero-right">
            <h1 className="detail-title">{movie.title}</h1>
            <h2 className="detail-subtitle">{movie.original_title}</h2>

            {/* Meta Row: Year, Rating, Duration, Bookmark */}
            <div className="detail-meta-row">
              <span className="meta-item">{movie.release_year}</span>

              {/* Rating */}
              <span className="rating-badge">
                <span className="imdb-text">IMDb</span> {movie.vote_average?.toFixed(1) || 'N/A'}
              </span>

              {/* Duration */}
              <span className="meta-item">{formatDuration(movie.duration)}</span>

              {/* Bookmark Watchlist Button */}
              <button
                className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                title={isBookmarked ? 'Đã thêm vào danh sách' : 'Thêm vào danh sách muốn xem'}
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={isBookmarked ? '#f5c518' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
            </div>

            {/* Genres Tag Chips */}
            <div className="genre-chips-row">
              {movie.country && <span className="genre-chip">{movie.country}</span>}
              {movie.genres?.map((g) => (
                <span key={g.id} className="genre-chip">
                  {g.name}
                </span>
              ))}
            </div>

            {/* Crew info */}
            <div className="crew-info">
              {directors && directors.length > 0 && (
                <p className="crew-line">
                  <strong className="crew-label">Đạo diễn:</strong>{' '}
                  <span className="crew-names">{directors.map((d) => d.name).join(', ')}</span>
                </p>
              )}
              {writers && writers.length > 0 && (
                <p className="crew-line">
                  <strong className="crew-label">Kịch bản:</strong>{' '}
                  <span className="crew-names">{writers.map((w) => w.name).join(', ')}</span>
                </p>
              )}
            </div>

            {/* Overview / Synopsis */}
            {movie.overview && (
              <p className="detail-overview">{movie.overview}</p>
            )}
          </div>
        </div>

        {/* 3. Cast Section */}
        <CastList casts={movie.casts || []} />

        {/* 4. Trailer Section */}
        <TrailerSection trailerUrl={movie.trailer_url} bannerUrl={movie.banner_url} />
      </div>
    </div>
  )
}
