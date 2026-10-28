export interface Genre {
  id: number
  name: string
  slug: string
}

export interface CastMember {
  person_id: number
  name: string
  character_name: string
  profile_url: string | null
  order_index?: number
}

export interface Creator {
  person_id: number
  name: string
  job: string
}

export interface Episode {
  id: number
  season_number: number
  episode_number: number
  title: string
  duration?: number
  video_url?: string
}

export interface MovieSummary {
  id: number
  title: string
  original_title: string
  movie_type: 'single_movie' | 'series' | string
  release_year: number
  country: string
  duration?: number
  vote_average: number
  poster_url: string
  banner_url?: string
  genres: Genre[]
}

export interface MovieDetail extends MovieSummary {
  overview: string
  vote_count: number
  age_rating?: string
  trailer_url?: string
  video_url?: string
  creators: Creator[]
  casts: CastMember[]
  episodes?: Episode[]
}

export interface MovieFilterParams {
  type?: 'movie' | 'series' | ''
  genre?: string
  country?: string
  year?: string | number
  duration?: string
  sort?: string
  q?: string
  page?: number
}

export interface PaginatedResponse<T> {
  total: number
  total_pages: number
  page: number
  limit: number
  data: T[]
}
