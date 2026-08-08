'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import { apiPost, setToken, clearToken, getToken } from './api'
import type { User } from './types'

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------
interface AuthState {
  user: Omit<User, 'token'> | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthState | undefined>(undefined)

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
const USER_KEY = 'deskmate_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Omit<User, 'token'> | null>(null)
  const [token, setTokenState] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Restore from localStorage on mount
  useEffect(() => {
    const storedToken = getToken()
    const storedUser = localStorage.getItem(USER_KEY)
    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
        setTokenState(storedToken)
      } catch {
        clearToken()
        localStorage.removeItem(USER_KEY)
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const data = await apiPost<User>('/api/auth/login', { email, password })
    const { token: jwt, ...userInfo } = data
    setToken(jwt)
    setTokenState(jwt)
    localStorage.setItem(USER_KEY, JSON.stringify(userInfo))
    setUser(userInfo)
  }

  const signup = async (name: string, email: string, password: string) => {
    const data = await apiPost<User>('/api/auth/signup', { name, email, password })
    const { token: jwt, ...userInfo } = data
    setToken(jwt)
    setTokenState(jwt)
    localStorage.setItem(USER_KEY, JSON.stringify(userInfo))
    setUser(userInfo)
  }

  const logout = () => {
    clearToken()
    localStorage.removeItem(USER_KEY)
    setUser(null)
    setTokenState(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an <AuthProvider>')
  }
  return ctx
}
