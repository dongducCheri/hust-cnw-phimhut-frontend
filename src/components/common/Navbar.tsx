import React from 'react'
import './Navbar.css'

interface NavbarProps {
  onGoHome?: () => void
  onSelectCategory?: (category: string) => void
  activeCategory?: string
}

export const Navbar: React.FC<NavbarProps> = ({
  onGoHome,
  onSelectCategory,
  activeCategory = 'trending'
}) => {
  const navItems = [
    { id: 'trending', label: 'Trending' },
    { id: 'single', label: 'Phim Lẻ' },
    { id: 'series', label: 'Phim Bộ' },
    { id: 'faq', label: 'FAQ' },
    { id: 'app_tv', label: 'App TV' }
  ]

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

          {/* User Avatar */}
          <div className="user-profile">
            <div className="avatar-circle">
              <span>Đ</span>
              <span className="status-dot"></span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
