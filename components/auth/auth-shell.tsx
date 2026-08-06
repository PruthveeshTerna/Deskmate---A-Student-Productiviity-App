import Link from 'next/link'
import type { ReactNode } from 'react'
import { GraduationCap } from 'lucide-react'

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      {/* tonal M3 backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-primary-container/50 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-secondary-container/40 blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-on-primary">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="text-xl font-medium tracking-tight text-on-surface">
              StudySync
            </span>
          </Link>
        </div>

        <div className="rounded-[1.75rem] border border-outline-variant/60 bg-surface-container/80 p-8 backdrop-blur-xl md-elevation-2 sm:p-10">
          <div className="text-center">
            <h1 className="text-2xl font-normal tracking-tight text-on-surface">
              {title}
            </h1>
            <p className="mt-2 text-sm text-on-surface-variant">{subtitle}</p>
          </div>

          <div className="mt-8">{children}</div>
        </div>

        <p className="mt-6 text-center text-sm text-on-surface-variant">
          {footer}
        </p>
      </div>
    </main>
  )
}

export function GoogleButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="md-state flex h-12 w-full items-center justify-center gap-3 rounded-full border border-outline bg-transparent text-sm font-medium text-on-surface"
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.15-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
        />
        <path
          fill="#FBBC05"
          d="M5.85 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.67-2.84Z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.85 9.9C6.71 7.31 9.14 5.38 12 5.38Z"
        />
      </svg>
      {label}
    </button>
  )
}
