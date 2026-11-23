import React from 'react'
import type { UserProfile } from '../types/auth'
import './AccountPage.css'

interface AccountPageProps {
  user: UserProfile
  onBack: () => void
}

export const AccountPage: React.FC<AccountPageProps> = ({ user, onBack }) => {
  return (
    <div className="account-page">
      <div className="account-container">
        <div className="account-header">
          <h1 className="account-title">Tài khoản</h1>
          <button type="button" className="account-back-link" onClick={onBack}>
            ← Trang chủ
          </button>
        </div>

        <div className="account-table">
          <div className="account-row">
            <span className="account-row-label">Tên</span>
            <span className="account-row-value">{user.name}</span>
          </div>

          <div className="account-row">
            <span className="account-row-label">Email</span>
            <span className="account-row-value">{user.email}</span>
          </div>

          <div className="account-row">
            <span className="account-row-label">Mật khẩu</span>
            <span className="account-row-value">••••••••</span>
          </div>

          <div className="account-row">
            <span className="account-row-label">Số dư</span>
            <span className="account-row-value account-balance">
              {user.balance.toLocaleString('vi-VN')} đ
            </span>
          </div>
        </div>

        <div className="account-vip-action">
          <button
            type="button"
            className="account-vip-btn"
            onClick={() => alert('Tính năng kích hoạt VIP Mode đang được phát triển!')}
          >
            Kích hoạt VIP mode
          </button>
        </div>

        <section className="account-vip-list">
          <h2 className="account-vip-heading">Các phim đã kích hoạt VIP Mode:</h2>
          <p className="account-vip-empty">Chưa có phim nào được kích hoạt VIP Mode.</p>
          <p className="account-vip-note">
            Chú ý: chế độ VIP Mode có thời gian hiệu lực 10 ngày đối với phim. Còn số dư trong tài khoản bạn thì không có thời hạn sử dụng.
          </p>
        </section>
      </div>
    </div>
  )
}
