import { apiFetch } from './api'

export async function login(username: string, password: string) {
  const res = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.detail || 'login failed')
  }

  return data
}
