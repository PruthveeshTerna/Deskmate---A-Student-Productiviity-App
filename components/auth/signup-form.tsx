'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Lock, Mail, User } from 'lucide-react'
import { MdTextField } from '../md-text-field'
import { MdButton } from '../md-button'
import { GoogleButton } from './auth-shell'

export function SignupForm() {
  const [agree, setAgree] = useState(false)

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => e.preventDefault()}
    >
      <GoogleButton label="Sign up with Google" />

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-outline-variant" />
        <span className="text-xs text-on-surface-variant">or</span>
        <span className="h-px flex-1 bg-outline-variant" />
      </div>

      <MdTextField
        label="Full name"
        autoComplete="name"
        leadingIcon={<User className="h-5 w-5" />}
        required
      />

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
        autoComplete="new-password"
        leadingIcon={<Lock className="h-5 w-5" />}
        required
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

      <MdButton type="submit" size="lg" className="w-full" disabled={!agree}>
        Create account
      </MdButton>
    </form>
  )
}
