import { apiClient } from './client'
import type { AuthResponse, UserProfile } from '../types/auth'

export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    return await apiClient<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  async signup(name: string, email: string, password: string): Promise<AuthResponse> {
    return await apiClient<AuthResponse>('/signup', {
      method: 'POST',
      body: JSON.stringify({ user: { name, email, password } }),
    })
  },

  async me(token: string): Promise<UserProfile> {
    return await apiClient<UserProfile>('/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
  },

  async logout(token: string): Promise<void> {
    await apiClient('/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
  },
}
