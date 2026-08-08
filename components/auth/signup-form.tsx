'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Lock, Mail, User } from 'lucide-react'
import { MdTextField } from '../md-text-field'
import { MdButton } from '../md-button'
import { GoogleButton } from './auth-shell'
import { useAuth } from '@/lib/auth-context'

export function SignupForm() {
  const router = useRouter()
  const { signup } = useAuth()
  const [agree, setAgree] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signup(name, email, password)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Signup failed. Please try again.')
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
        <GoogleButton label="Sign up with Google" />
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
        label="Full name"
        autoComplete="name"
        leadingIcon={<User className="h-5 w-5" />}
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

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
        autoComplete="new-password"
        leadingIcon={<Lock className="h-5 w-5" />}
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <label className="flex cursor-pointer items-start gap-2.5 text-sm text-on-surface-variant">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-outline accent-[var(--md-primary)]"
          required
        />
        <span>
          I agree to the{' '}
          <Link href="#" className="font-medium text-primary hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="#" className="font-medium text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      <MdButton type="submit" size="lg" className="w-full" disabled={!agree || loading}>
        {loading ? 'Creating account...' : 'Create Free DeskMate Account →'}
      </MdButton>
    </form>
  )
}

