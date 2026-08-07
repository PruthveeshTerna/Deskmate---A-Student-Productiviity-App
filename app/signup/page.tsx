import Link from 'next/link'
import type { Metadata } from 'next'
import { AuthShell } from '@/components/auth/auth-shell'
import { SignupForm } from '@/components/auth/signup-form'

export const metadata: Metadata = {
  title: 'Sign up · DeskMate',
  description: 'Create your DeskMate account and start studying smarter with AI.',
}

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Start your academic workspace for free"
      footer={
        <>
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Log in
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  )
}
