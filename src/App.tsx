import { useState } from 'react'
import { Navbar } from './components/common/Navbar'
import { MovieCatalogPage } from './pages/MovieCatalogPage'
import { MovieDetailPage } from './pages/MovieDetailPage'
import './styles/theme.css'

export function App() {
  const [currentPage, setCurrentPage] = useState<'catalog' | 'detail'>('catalog')
  const [selectedMovieId, setSelectedMovieId] = useState<number>(1)
  const [activeCategory, setActiveCategory] = useState<string>('single')

  // Khi bấm vào 1 phim bất kỳ -> chuyển sang màn hình Chi tiết phim
  const handleSelectMovie = (id: number) => {
    setSelectedMovieId(id)
    setCurrentPage('detail')
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

      {/* 2. Page Content: Danh sách phim HOẶC Chi tiết phim */}
      {currentPage === 'catalog' ? (
        <MovieCatalogPage onSelectMovie={handleSelectMovie} />
      ) : (
        <MovieDetailPage movieId={selectedMovieId} onBack={handleGoHome} />
      )}
    </div>
  )
}

export default App
