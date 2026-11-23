import { useEffect, useState } from 'react'
import { Navbar } from './components/common/Navbar'
import { MovieCatalogPage } from './pages/MovieCatalogPage'
import { MovieDetailPage } from './pages/MovieDetailPage'
import { WatchPage } from './pages/WatchPage'
import { AuthPage } from './pages/AuthPage'
import { AccountPage } from './pages/AccountPage'
import { authApi } from './api/authApi'
import type { UserProfile } from './types/auth'
import './styles/theme.css'

type PageView = 'catalog' | 'detail' | 'watch' | 'auth' | 'account'

export function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('catalog')
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [selectedMovieId, setSelectedMovieId] = useState<number>(1)
  const [activeCategory, setActiveCategory] = useState<string>('single')
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    authApi
      .me(token)
      .then((user) => setCurrentUser(user))
      .catch(() => {
        localStorage.removeItem('token')
        setCurrentUser(null)
      })
  }, [])

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

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode)
    setCurrentPage('auth')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user)
    setCurrentPage('catalog')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogout = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      await authApi.logout(token).catch(() => {})
      localStorage.removeItem('token')
    }
    setCurrentUser(null)
    if (currentPage === 'account') {
      setCurrentPage('catalog')
    }
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
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onOpenAccount={() => {
          setCurrentPage('account')
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        onLogout={handleLogout}
      />

      {/* 2. Page Content */}
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
      {currentPage === 'auth' && (
        <AuthPage
          initialMode={authMode}
          onSuccess={handleAuthSuccess}
          onCancel={handleGoHome}
        />
      )}
      {currentPage === 'account' && currentUser && (
        <AccountPage user={currentUser} onBack={handleGoHome} />
      )}
    </div>
  )
}

export default App
