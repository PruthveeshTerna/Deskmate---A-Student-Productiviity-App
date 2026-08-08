'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Lock, Mail } from 'lucide-react'
import { MdTextField } from '../md-text-field'
import { MdButton } from '../md-button'
import { GoogleButton } from './auth-shell'
import { useAuth } from '@/lib/auth-context'

export function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [remember, setRemember] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={handleSubmit}
    >
      <div onClick={() => router.push('/dashboard')}>
        <GoogleButton label="Continue with Google" />
      </div>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-outline-variant" />
        <span className="text-xs text-on-surface-variant">or</span>
        <span className="h-px flex-1 bg-outline-variant" />
      </div>

      {error && (
        <div className="text-xs text-error bg-error-container/40 rounded-lg px-3 py-2 font-medium">
          {error}
        </div>
      )}

      <MdTextField
        label="Email"
        type="email"
        autoComplete="email"
        leadingIcon={<Mail className="h-5 w-5" />}
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <MdTextField
        label="Password"
        isPassword
        autoComplete="current-password"
        leadingIcon={<Lock className="h-5 w-5" />}
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-on-surface-variant">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-outline text-primary accent-[var(--md-primary)]"
          />
          Remember me
        </label>
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault()
            alert('A password reset link has been sent to your email!')
          }}
          className="text-sm font-medium text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <MdButton type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? 'Logging in...' : 'Log in to Dashboard →'}
      </MdButton>
    </form>
  )
}

