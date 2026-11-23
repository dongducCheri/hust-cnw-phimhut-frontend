import React, { useEffect, useRef, useState } from 'react'
import type { UserProfile } from '../../types/auth'
import './Navbar.css'

interface NavbarProps {
  onGoHome?: () => void
  onSelectCategory?: (category: string) => void
  activeCategory?: string
  currentUser?: UserProfile | null
  onOpenAuth?: (mode: 'login' | 'signup') => void
  onOpenAccount?: () => void
  onLogout?: () => void
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return (parts[0]?.[0] || 'U').toUpperCase()
}

export const Navbar: React.FC<NavbarProps> = ({
  onGoHome,
  onSelectCategory,
  activeCategory = 'trending',
  currentUser,
  onOpenAuth,
  onOpenAccount,
  onLogout,
}) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  const navItems = [
    { id: 'trending', label: 'Trending' },
    { id: 'single', label: 'Phim Lẻ' },
    { id: 'series', label: 'Phim Bộ' },
    { id: 'faq', label: 'FAQ' },
    { id: 'app_tv', label: 'App TV' },
  ]

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Left: Logo */}
        <div className="navbar-brand" onClick={onGoHome}>
          <span className="brand-icon">▶</span>
          <span className="brand-name">Phim<span className="brand-highlight">Hut</span></span>
        </div>

        {/* Center: Navigation Links */}
        <nav className="navbar-links">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-link ${activeCategory === item.id ? 'active' : ''}`}
              onClick={() => onSelectCategory?.(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="navbar-actions">
          {/* Search Icon */}
          <button className="icon-btn search-btn" title="Tìm kiếm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

          {/* Auth / User Avatar */}
          {currentUser ? (
            <div className="user-profile" ref={menuRef}>
              <button
                type="button"
                className="avatar-circle"
                onClick={() => setMenuOpen((prev) => !prev)}
                title={currentUser.name}
              >
                <span>{getInitials(currentUser.name)}</span>
                <span className="status-dot"></span>
              </button>

              {menuOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <div className="user-dropdown-name">{currentUser.name}</div>
                    <div className="user-dropdown-email">{currentUser.email}</div>
                  </div>

                  <button
                    type="button"
                    className="user-dropdown-item"
                    onClick={() => {
                      setMenuOpen(false)
                      onOpenAccount?.()
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                    <span>Tài khoản</span>
                  </button>

                  <button
                    type="button"
                    className="user-dropdown-item logout"
                    onClick={() => {
                      setMenuOpen(false)
                      onLogout?.()
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar-auth-btns">
              <button
                type="button"
                className="navbar-login-btn"
                onClick={() => onOpenAuth?.('login')}
              >
                Đăng nhập
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
