import { apiClient } from './client'
import type { MovieSummary, MovieDetail, MovieFilterParams, PaginatedResponse, Genre } from '../types/movie'

export const movieApi = {
  // Lấy danh sách phim có bộ lọc từ Backend
  async getMovies(params: MovieFilterParams = {}): Promise<PaginatedResponse<MovieSummary>> {
    const searchParams = new URLSearchParams()
    if (params.type) searchParams.append('type', params.type)
    if (params.genre) searchParams.append('genre', params.genre)
    if (params.country) searchParams.append('country', params.country)
    if (params.year) searchParams.append('year', String(params.year))
    if (params.duration) searchParams.append('duration', params.duration)
    if (params.sort) searchParams.append('sort', params.sort)
    if (params.q) searchParams.append('q', params.q)
    if (params.page) searchParams.append('page', String(params.page))

    const queryString = searchParams.toString()
    return await apiClient<PaginatedResponse<MovieSummary>>(`/movies${queryString ? `?${queryString}` : ''}`)
  },

  // Lấy chi tiết 1 phim từ Backend
  async getMovieById(id: number | string): Promise<MovieDetail> {
    return await apiClient<MovieDetail>(`/movies/${id}`)
  },

  // Lấy danh sách thể loại từ Backend
  async getGenres(): Promise<Genre[]> {
    const res = await apiClient<Genre[] | { total: number; data: Genre[] }>('/genres')
    if (Array.isArray(res)) return res
    if (res && Array.isArray(res.data)) return res.data
    return []
  }
}
