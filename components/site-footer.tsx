import Link from 'next/link'
import { GraduationCap, Sparkles } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="border-t border-outline-variant/60 bg-surface-container-low">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-5">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-2xl bg-primary text-on-primary md-elevation-1">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="text-xl font-bold tracking-tight text-on-surface">
                DeskMate
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-xs leading-relaxed text-on-surface-variant">
              The AI-powered student workspace designed to help you organize tasks, timetables, deadlines, notes, and academic success.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-outline-variant/60 bg-surface-container px-3 py-1 text-xs font-semibold text-on-surface-variant">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All AI Systems Operational</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface">
              Platform
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-on-surface-variant">
              <li>
                <Link href="/dashboard" className="hover:text-primary transition-colors">
                  Dashboard Overview
                </Link>
              </li>
              <li>
                <Link href="/tasks" className="hover:text-primary transition-colors">
                  Task Manager
                </Link>
              </li>
              <li>
                <Link href="/timetable" className="hover:text-primary transition-colors">
                  Timetable & Deadlines
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-primary transition-colors">
                  Focus Analytics
                </Link>
              </li>
              <li>
                <Link href="/notes" className="hover:text-primary transition-colors">
                  AI Notes & Flashcards
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface">
              Resources
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-on-surface-variant">
              <li>
                <a href="#features" className="hover:text-primary transition-colors">
                  Feature Highlights
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-primary transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-primary transition-colors">
                  Student Pricing
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-primary transition-colors">
                  FAQ & Help
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface">
              Account
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-on-surface-variant">
              <li>
                <Link href="/login" className="hover:text-primary transition-colors">
                  Log in
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-primary transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-outline-variant/40 pt-8 sm:flex-row">
          <p className="text-xs text-on-surface-variant">
            © {new Date().getFullYear()} DeskMate Inc. Built for ambitious students.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
            <span>Powered by</span>
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="font-bold text-on-surface">Google Material 3 AI</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
