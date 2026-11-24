import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Navbar } from './components/common/Navbar'
import { MovieCatalogPage } from './pages/MovieCatalogPage'
import { MovieDetailPage } from './pages/MovieDetailPage'
import { WatchPage } from './pages/WatchPage'
import { AuthPage } from './pages/AuthPage'
import { AccountPage } from './pages/AccountPage'
import { authApi } from './api/authApi'
import type { UserProfile } from './types/auth'
import './styles/theme.css'

export function App() {
  const navigate = useNavigate()
  const location = useLocation()

  const [activeCategory, setActiveCategory] = useState<string>('single')
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const [authChecked, setAuthChecked] = useState<boolean>(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setAuthChecked(true)
      return
    }

    authApi
      .me(token)
      .then((user) => setCurrentUser(user))
      .catch(() => {
        localStorage.removeItem('token')
        setCurrentUser(null)
      })
      .finally(() => setAuthChecked(true))
  }, [])

  // Tự động cuộn lên đầu trang khi đổi URL
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  const handleGoHome = () => {
    navigate('/')
  }

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user)
    navigate('/')
  }

  const handleLogout = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      await authApi.logout(token).catch(() => {})
      localStorage.removeItem('token')
    }
    setCurrentUser(null)
    navigate('/')
  }

  return (
    <div className="app-layout">
      {/* 1. Header Navigation Bar */}
      <Navbar
        onGoHome={handleGoHome}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat)
          navigate('/')
        }}
        currentUser={currentUser}
        onOpenAuth={(mode) => navigate(mode === 'signup' ? '/signup' : '/login')}
        onOpenAccount={() => navigate('/settings')}
        onLogout={handleLogout}
      />

      {/* 2. Page Content: Định tuyến bằng URL thật */}
      <Routes>
        <Route
          path="/"
          element={<MovieCatalogPage onSelectMovie={(id) => navigate(`/movies/${id}`)} />}
        />
        <Route path="/movies/:id" element={<MovieDetailPage />} />
        <Route path="/watch/:id" element={<WatchPage currentUser={currentUser} />} />
        <Route
          path="/login"
          element={<AuthPage initialMode="login" onSuccess={handleAuthSuccess} />}
        />
        <Route
          path="/signup"
          element={<AuthPage initialMode="signup" onSuccess={handleAuthSuccess} />}
        />
        <Route
          path="/settings"
          element={
            !authChecked ? null : currentUser ? (
              <AccountPage user={currentUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
