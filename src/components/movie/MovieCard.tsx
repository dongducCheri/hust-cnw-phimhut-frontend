import React from 'react'
import type { MovieSummary } from '../../types/movie'
import './MovieCard.css'

interface MovieCardProps {
  movie: MovieSummary
  onClick?: (movieId: number) => void
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  return (
    <div className="movie-card" onClick={() => onClick?.(movie.id)}>
      {/* Poster Image Container */}
      <div className="movie-poster-wrapper">
        <img
          src={movie.poster_url || 'https://placehold.co/400x600/181d2c/ffffff?text=PhimHut'}
          alt={movie.title}
          className="movie-poster-img"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = `https://placehold.co/400x600/181d2c/e50914?text=${encodeURIComponent(movie.title)}`
          }}
        />

        {/* Play Icon Overlay on Hover */}
        <div className="poster-overlay">
          <div className="play-button-circle">
            <span>▶</span>
          </div>
        </div>

        {/* Rating Badge */}
        {movie.vote_average > 0 && (
          <div className="poster-rating-badge">
            ★ {movie.vote_average.toFixed(1)}
          </div>
        )}

        {/* Year or Type Badge */}
        {movie.release_year && (
          <div className="poster-year-badge">
            {movie.release_year}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="movie-info">
        <h3 className="movie-title" title={movie.title}>
          {movie.title}
        </h3>
        <p className="movie-original-title" title={movie.original_title}>
          {movie.original_title || movie.title}
        </p>
      </div>
    </div>
  )
}
