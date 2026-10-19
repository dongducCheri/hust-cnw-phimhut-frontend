import { useEffect, useState } from 'react'
import './App.css'

interface ApiResponse {
  status: string
  message: string
  server_time: string
}

function App() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Gọi API từ Backend Rails
    fetch('http://localhost:3000/api/v1/test')
      .then((res) => {
        if (!res.ok) throw new Error('Không thể kết nối tới Backend!')
        return res.json()
      })
      .then((data: ApiResponse) => {
        setData(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
      <h1>🎬 PhimHut Project</h1>
      <h2>Kiểm tra kết nối Frontend & Backend</h2>

      <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', display: 'inline-block' }}>
        {loading && <p>⏳ Đang tải dữ liệu từ Backend...</p>}

        {error && (
          <p style={{ color: 'red' }}>
            ❌ Lỗi kết nối: {error}
            <br />
            <small>(Đảm bảo bạn đã chạy Rails server ở port 3000)</small>
          </p>
        )}

        {data && (
          <div style={{ color: 'green' }}>
            <p>✅ <strong>{data.message}</strong></p>
            <p>🕒 Giờ hệ thống Backend: {new Date(data.server_time).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App