import React, { useEffect, useState } from 'react'
import type { MovieSummary, MovieFilterParams, Genre } from '../types/movie'
import { movieApi } from '../api/movieApi'
import { MovieFilterBar } from '../components/movie/MovieFilterBar'
import { MovieCard } from '../components/movie/MovieCard'
import './MovieCatalogPage.css'

interface MovieCatalogPageProps {
  onSelectMovie: (movieId: number) => void
}

export const MovieCatalogPage: React.FC<MovieCatalogPageProps> = ({ onSelectMovie }) => {
  const [movies, setMovies] = useState<MovieSummary[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [totalPages, setTotalPages] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(true)
  const [filters, setFilters] = useState<MovieFilterParams>({
    type: 'movie',
    sort: '',
    page: 1
  })

  // Tải danh sách thể loại từ Backend
  useEffect(() => {
    movieApi.getGenres().then(setGenres)
  }, [])

  // Tải danh sách phim từ Backend khi filters thay đổi
  useEffect(() => {
    setLoading(true)
    movieApi
      .getMovies(filters)
      .then((res) => {
        setMovies(res.data)
        setTotalPages(res.total_pages || 1)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [filters])

  const currentPage = filters.page || 1

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    setFilters((prev) => ({ ...prev, page: newPage }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="catalog-container">
      {/* 1. Bộ lọc phim */}
      <MovieFilterBar filters={filters} genres={genres} onChange={setFilters} />

      {/* 2. Danh sách phim (Grid) */}
      {loading ? (
        <div className="catalog-loading">
          <div className="spinner"></div>
          <p>Đang tải danh sách phim...</p>
        </div>
      ) : movies.length === 0 ? (
        <div className="catalog-empty">
          <p>Không tìm thấy phim phù hợp với bộ lọc.</p>
        </div>
      ) : (
        <>
          <div className="movies-grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onClick={onSelectMovie} />
            ))}
          </div>

          {/* 3. Phân trang nếu có nhiều hơn 1 trang */}
          {totalPages > 1 && (
            <div className="pagination-bar">
              <button
                className="page-btn"
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                ← Trang trước
              </button>
              <span className="page-indicator">
                Trang <strong>{currentPage}</strong> / {totalPages}
              </span>
              <button
                className="page-btn"
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Trang sau →
              </button>
            </div>
          )}
        </>
      )}
    </main>
  )
}
