import Link from 'next/link'
import { GraduationCap, Globe, Send, MessageCircle, Rss } from 'lucide-react'

const groups = [
  {
    title: 'Product',
    links: [
      ['Features', '#features'],
      ['How it works', '#how-it-works'],
      ['AI Learning', '#ai'],
      ['FAQ', '#faq'],
    ],
  },
  {
    title: 'Company',
    links: [
      ['About', '#'],
      ['Blog', '#'],
      ['Careers', '#'],
      ['Contact', '#'],
    ],
  },
  {
    title: 'Resources',
    links: [
      ['Help Center', '#faq'],
      ['Community', '#'],
      ['Privacy', '#'],
      ['Terms', '#'],
    ],
  },
]

const socials = [
  { icon: Send, label: 'Twitter' },
  { icon: MessageCircle, label: 'Community' },
  { icon: Globe, label: 'Website' },
  { icon: Rss, label: 'Blog' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-outline-variant/60 bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-on-primary">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="text-lg font-medium text-on-surface">
                StudySync
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-on-surface-variant">
              Your complete academic workspace, powered by AI. Plan, study,
              analyze and improve — all in one place.
            </p>
            <div className="mt-5 flex gap-1">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="md-state grid h-10 w-10 place-items-center rounded-full text-on-surface-variant hover:text-on-surface"
                >
                  <s.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {groups.map((g) => (
            <div key={g.title}>
              <h3 className="text-sm font-medium text-on-surface">{g.title}</h3>
              <ul className="mt-4 space-y-3">
                {g.links.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-on-surface-variant transition-colors hover:text-on-surface"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-outline-variant/60 pt-8 sm:flex-row">
          <p className="text-sm text-on-surface-variant">
            © {new Date().getFullYear()} StudySync. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-sm text-on-surface-variant hover:text-on-surface"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-on-surface-variant hover:text-on-surface"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
