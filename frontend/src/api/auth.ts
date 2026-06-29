import axios from 'axios'
import type { TokenResponse, User } from '../types'

export async function login(email: string, password: string): Promise<TokenResponse> {
  const { data } = await axios.post<TokenResponse>('/api/v1/auth/login', { email, password })
  return data
}

export async function register(email: string, password: string): Promise<User> {
  const { data } = await axios.post<User>('/api/v1/auth/register', { email, password })
  return data
}
