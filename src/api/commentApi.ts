import { apiClient } from './client'
import type { CommentItem } from '../types/movie'

export const commentApi = {
  async getComments(movieId: number): Promise<CommentItem[]> {
    const res = await apiClient<{ data: CommentItem[] }>(`/movies/${movieId}/comments`)
    return res.data || []
  },

  async createComment(movieId: number, content: string, token: string): Promise<CommentItem> {
    const res = await apiClient<{ data: CommentItem }>(`/movies/${movieId}/comments`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ comment: { content } }),
    })
    return res.data
  },

  async deleteComment(commentId: number, token: string): Promise<void> {
    await apiClient(`/comments/${commentId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
  },
}
