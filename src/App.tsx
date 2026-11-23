import { useState } from 'react'
import { Navbar } from './components/common/Navbar'
import { MovieCatalogPage } from './pages/MovieCatalogPage'
import { MovieDetailPage } from './pages/MovieDetailPage'
import { WatchPage } from './pages/WatchPage'
import './styles/theme.css'

export function App() {
  const [currentPage, setCurrentPage] = useState<'catalog' | 'detail' | 'watch'>('catalog')
  const [selectedMovieId, setSelectedMovieId] = useState<number>(1)
  const [activeCategory, setActiveCategory] = useState<string>('single')

  // Khi bấm vào 1 phim bất kỳ -> chuyển sang màn hình Chi tiết phim
  const handleSelectMovie = (id: number) => {
    setSelectedMovieId(id)
    setCurrentPage('detail')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Khi bấm nút XEM PHIM -> chuyển sang màn hình Chiếu phim
  const handleWatchMovie = (id: number) => {
    setSelectedMovieId(id)
    setCurrentPage('watch')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Khi bấm nút quay lại hoặc bấm Logo -> quay lại trang danh sách
  const handleGoHome = () => {
    setCurrentPage('catalog')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-layout">
      {/* 1. Header Navigation Bar */}
      <Navbar
        onGoHome={handleGoHome}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat)
          setCurrentPage('catalog')
        }}
      />

      {/* 2. Page Content: Danh sách phim / Chi tiết phim / Chiếu phim */}
      {currentPage === 'catalog' && (
        <MovieCatalogPage onSelectMovie={handleSelectMovie} />
      )}
      {currentPage === 'detail' && (
        <MovieDetailPage
          movieId={selectedMovieId}
          onBack={handleGoHome}
          onWatchMovie={handleWatchMovie}
        />
      )}
      {currentPage === 'watch' && (
        <WatchPage
          movieId={selectedMovieId}
          onBackToDetail={() => setCurrentPage('detail')}
        />
      )}
    </div>
  )
}

export default App
