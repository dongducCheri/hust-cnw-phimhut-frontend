const API_BASE_URL = 'http://localhost:3000/api/v1'

export async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    let message = `API call failed: ${response.status} ${response.statusText}`
    try {
      const errData = await response.json()
      if (errData.error) message = errData.error
      else if (Array.isArray(errData.errors) && errData.errors.length > 0) {
        message = errData.errors.join(', ')
      }
    } catch {
      // ignore JSON parse error
    }
    throw new Error(message)
  }

  return response.json()
}
