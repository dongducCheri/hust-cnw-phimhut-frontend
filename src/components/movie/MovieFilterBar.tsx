import React from 'react'
import type { MovieFilterParams, Genre } from '../../types/movie'
import './MovieFilterBar.css'

interface MovieFilterBarProps {
  filters: MovieFilterParams
  genres?: Genre[]
  onChange: (newFilters: MovieFilterParams) => void
}

export const MovieFilterBar: React.FC<MovieFilterBarProps> = ({
  filters,
  genres = [],
  onChange
}) => {
  const handleChange = (field: keyof MovieFilterParams, value: string) => {
    onChange({
      ...filters,
      [field]: value,
      page: 1 // Reset về trang 1 khi lọc
    })
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 15 }, (_, i) => currentYear - i)

  return (
    <div className="filter-bar-container">
      {/* 1. Loại phim */}
      <div className="filter-group">
        <label className="filter-label">Loại phim:</label>
        <select
          className="filter-select"
          value={filters.type || ''}
          onChange={(e) => handleChange('type', e.target.value)}
        >
          <option value="">- Tất cả -</option>
          <option value="movie">Phim Lẻ</option>
          <option value="series">Phim Bộ</option>
        </select>
      </div>

      {/* 2. Thể loại */}
      <div className="filter-group">
        <label className="filter-label">Thể loại:</label>
        <select
          className="filter-select"
          value={filters.genre || ''}
          onChange={(e) => handleChange('genre', e.target.value)}
        >
          <option value="">- Tất cả -</option>
          {genres.map((g) => (
            <option key={g.id} value={g.slug}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      {/* 3. Quốc gia */}
      <div className="filter-group">
        <label className="filter-label">Quốc gia:</label>
        <select
          className="filter-select"
          value={filters.country || ''}
          onChange={(e) => handleChange('country', e.target.value)}
        >
          <option value="">- Tất cả -</option>
          <option value="US">Mỹ</option>
          <option value="KR">Hàn Quốc</option>
          <option value="JP">Nhật Bản</option>
          <option value="CN">Trung Quốc</option>
          <option value="VN">Việt Nam</option>
          <option value="GB">Anh</option>
        </select>
      </div>

      {/* 4. Năm */}
      <div className="filter-group">
        <label className="filter-label">Năm:</label>
        <select
          className="filter-select"
          value={filters.year || ''}
          onChange={(e) => handleChange('year', e.target.value)}
        >
          <option value="">- Tất cả -</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* 5. Thời lượng */}
      <div className="filter-group">
        <label className="filter-label">Thời lượng:</label>
        <select
          className="filter-select"
          value={filters.duration || ''}
          onChange={(e) => handleChange('duration', e.target.value)}
        >
          <option value="">- Tất cả -</option>
          <option value="0-30">Dưới 30 phút</option>
          <option value="30-60">30 - 60 phút</option>
          <option value="60-90">60 - 90 phút</option>
          <option value="90-120">90 - 120 phút</option>
          <option value="120-150">120 - 150 phút</option>
          <option value="150-180">150 - 180 phút</option>
          <option value="180+">Trên 180 phút</option>
        </select>
      </div>

      {/* 6. Sắp xếp */}
      <div className="filter-group">
        <label className="filter-label">Sắp xếp:</label>
        <select
          className="filter-select"
          value={filters.sort || ''}
          onChange={(e) => handleChange('sort', e.target.value)}
        >
          <option value="">Ngày cập nhật</option>
          <option value="publishDate">Năm phát hành</option>
          <option value="rating">Điểm đánh giá</option>
          <option value="viewCount">Lượt xem nhiều</option>
        </select>
      </div>
    </div>
  )
}
