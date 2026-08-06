'use client'

import Link from 'next/link'
import { useState } from 'react'
import { GraduationCap, Menu, X } from 'lucide-react'
import { MdLinkButton } from './md-button'
import { ThemeToggle } from './theme-toggle'

const links = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#ai', label: 'AI Learning' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
]

export function SiteNav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant/60 bg-surface/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-on-primary">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="text-lg font-medium tracking-tight text-on-surface">
            StudySync
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="md-state rounded-full px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <MdLinkButton href="/login" variant="text" size="sm">
            Log in
          </MdLinkButton>
          <MdLinkButton href="/signup" variant="filled" size="sm">
            Get Started
          </MdLinkButton>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md-state grid h-10 w-10 place-items-center rounded-full text-on-surface"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-outline-variant/60 bg-surface px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="md-state rounded-xl px-4 py-3 text-sm text-on-surface-variant"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <MdLinkButton href="/login" variant="outlined" size="md">
              Log in
            </MdLinkButton>
            <MdLinkButton href="/signup" variant="filled" size="md">
              Get Started
            </MdLinkButton>
          </div>
        </div>
      )}
    </header>
  )
}
