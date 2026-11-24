import React, { useState } from 'react'
import { authApi } from '../api/authApi'
import type { UserProfile } from '../types/auth'
import './AuthPage.css'

interface AuthPageProps {
  initialMode?: 'login' | 'signup'
  onSuccess: (user: UserProfile, token: string) => void
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res =
        mode === 'login'
          ? await authApi.login(email.trim(), password)
          : await authApi.signup(name.trim(), email.trim(), password)

      localStorage.setItem('token', res.api_token)
      onSuccess(res.user, res.api_token)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra.')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'))
    setError(null)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">{mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="auth-field">
              <label className="auth-label" htmlFor="auth-name">
                Tên hiển thị
              </label>
              <input
                id="auth-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="auth-input"
              />
            </div>
          )}

          <div className="auth-field">
            <label className="auth-label" htmlFor="auth-email">
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="auth-password">
              Mật khẩu
            </label>
            <input
              id="auth-password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <div className="auth-submit-row">
            <button type="submit" disabled={loading} className="auth-submit-btn">
              {loading
                ? 'Đang xử lý...'
                : mode === 'login'
                  ? 'Đăng nhập'
                  : 'Đăng ký'}
            </button>
          </div>
        </form>

        <div className="auth-footer">
          <button type="button" onClick={switchMode} className="auth-link-btn">
            {mode === 'login' ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
          </button>
        </div>
      </div>
    </div>
  )
}
