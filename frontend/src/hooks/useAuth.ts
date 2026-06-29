import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as apiLogin, register as apiRegister } from '../api/auth'

export function useAuth() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isAuthenticated = !!localStorage.getItem('access_token')

  async function login(email: string, password: string) {
    setLoading(true)
    setError(null)
    try {
      const tokens = await apiLogin(email, password)
      localStorage.setItem('access_token', tokens.access_token)
      localStorage.setItem('refresh_token', tokens.refresh_token)
      navigate('/dashboard')
    } catch (e: any) {
      setError(e.response?.data?.detail ?? 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  async function register(email: string, password: string) {
    setLoading(true)
    setError(null)
    try {
      await apiRegister(email, password)
      await login(email, password)
    } catch (e: any) {
      setError(e.response?.data?.detail ?? 'Registration failed')
      setLoading(false)
    }
  }

  function logout() {
    localStorage.clear()
    navigate('/login')
  }

  return { login, register, logout, isAuthenticated, loading, error, setError }
}
