import React, { useEffect, useState } from 'react'
import { commentApi } from '../../api/commentApi'
import type { CommentItem } from '../../types/movie'
import './CommentSection.css'

interface CommentSectionProps {
  movieId: number
}

export const CommentSection: React.FC<CommentSectionProps> = ({ movieId }) => {
  const [comments, setComments] = useState<CommentItem[]>([])
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    commentApi
      .getComments(movieId)
      .then((data) => setComments(data))
      .catch(() => {})
  }, [movieId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    const token = localStorage.getItem('token')
    if (!token) {
      setError('Vui lòng đăng nhập để gửi bình luận.')
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      const newComment = await commentApi.createComment(movieId, content.trim(), token)
      setComments((prev) => [newComment, ...prev])
      setContent('')
    } catch {
      setError('Không thể gửi bình luận.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (commentId: number) => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Vui lòng đăng nhập để xóa bình luận.')
      return
    }

    try {
      await commentApi.deleteComment(commentId, token)
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    } catch {
      setError('Bạn không có quyền xóa bình luận này.')
    }
  }

  const hasToken = Boolean(localStorage.getItem('token'))

  return (
    <section className="comment-section">
      <h2 className="comment-heading">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span>Bình luận phim</span>
      </h2>

      <form className="comment-form" onSubmit={handleSubmit}>
        <textarea
          rows={2}
          maxLength={1000}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="comment-textarea"
        />
        {error && <p className="comment-error">{error}</p>}
        <div className="comment-actions">
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="comment-submit-btn"
          >
            {submitting ? 'Đang gửi...' : 'Gửi'}
          </button>
        </div>
      </form>

      {comments.length > 0 && (
        <div className="comment-list">
          {comments.map((c) => (
            <div key={c.id} className="comment-item">
              <div className="comment-item-header">
                <div className="comment-meta">
                  <span className="comment-author">{c.user_name}</span>
                  <span className="comment-date">
                    {new Date(c.created_at).toLocaleString('vi-VN')}
                  </span>
                </div>
                {hasToken && (
                  <button
                    type="button"
                    className="comment-delete-btn"
                    title="Xóa bình luận"
                    onClick={() => handleDelete(c.id)}
                  >
                    ✕
                  </button>
                )}
              </div>
              <p className="comment-content">{c.content}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
