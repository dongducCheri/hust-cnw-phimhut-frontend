const API_BASE_URL = 'http://localhost:3000/api/v1'

export async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`)
  }

  return response.json()
}
