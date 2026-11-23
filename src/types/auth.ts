export interface UserProfile {
  id: number
  email: string
  name: string
  role: string
  balance: number
}

export interface AuthResponse {
  api_token: string
  user: UserProfile
}
