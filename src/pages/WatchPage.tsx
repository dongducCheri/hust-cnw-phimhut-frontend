import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { movieApi } from '../api/movieApi'
import type { Episode, MovieDetail } from '../types/movie'
import { HlsVideoPlayer } from '../components/watch/HlsVideoPlayer'
import { CommentSection } from '../components/watch/CommentSection'
import type { UserProfile } from '../types/auth'
import './WatchPage.css'

interface WatchPageProps {
  currentUser?: UserProfile | null
}

export const WatchPage: React.FC<WatchPageProps> = ({ currentUser }) => {
  const { id } = useParams<{ id: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let isMounted = true
    setLoading(true)
    setError(null)

    movieApi
      .getMovieById(id)
      .then((data) => {
        if (!isMounted) return
        setMovie(data)

        const episodes = data.episodes || []
        const epParam = Number(searchParams.get('ep'))
        const defaultEpisode =
          episodes.find((ep) => ep.id === epParam) ||
          episodes.find((ep) => Boolean(ep.video_url)) ||
          episodes[0] ||
          null
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
  }, [id])

  const handleSelectEpisode = (ep: Episode) => {
    setCurrentEpisode(ep)
    setSearchParams({ ep: String(ep.id) })
  }

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
      </div>
    )
  }

  return (
    <div className="watch-page">
      {/* Khu vực chiếu phim rộng toàn màn hình */}
      <div className="watch-player-stage">
        <HlsVideoPlayer
          videoUrl={currentEpisode?.video_url}
          poster={movie.banner_url || movie.poster_url}
          episodeTitle={currentEpisode?.title}
        />
      </div>

      <div className="watch-container">
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
                    onClick={() => handleSelectEpisode(ep)}
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
        <CommentSection movieId={movie.id} currentUser={currentUser} />
      </div>
    </div>
  )
}
