'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Lock, Mail } from 'lucide-react'
import { MdTextField } from '../md-text-field'
import { MdButton } from '../md-button'
import { GoogleButton } from './auth-shell'

export function LoginForm() {
  const [remember, setRemember] = useState(true)

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => e.preventDefault()}
    >
      <GoogleButton label="Continue with Google" />

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-outline-variant" />
        <span className="text-xs text-on-surface-variant">or</span>
        <span className="h-px flex-1 bg-outline-variant" />
      </div>

      <MdTextField
        label="Email"
        type="email"
        autoComplete="email"
        leadingIcon={<Mail className="h-5 w-5" />}
        required
      />

      <MdTextField
        label="Password"
        isPassword
        autoComplete="current-password"
        leadingIcon={<Lock className="h-5 w-5" />}
        required
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
          className="text-sm font-medium text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <MdButton type="submit" size="lg" className="w-full">
        Log in
      </MdButton>
    </form>
  )
}
