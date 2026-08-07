'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, type ReactNode } from 'react'
import {
  Bell,
  BookOpen,
  Calendar,
  CheckSquare,
  GraduationCap,
  LayoutDashboard,
  LineChart,
  LogOut,
  Menu,
  Moon,
  Search,
  Sparkles,
  Sun,
  User,
  X,
} from 'lucide-react'
import { ThemeToggle } from './theme-toggle'

type NavItem = {
  href: string
  label: string
  icon: typeof LayoutDashboard
  badge?: string
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare, badge: '4' },
  { href: '/timetable', label: 'Timetable', icon: Calendar, badge: 'Soon' },
  { href: '/analytics', label: 'Analytics', icon: LineChart },
  { href: '/notes', label: 'AI Notes & Studio', icon: BookOpen, badge: 'AI' },
]

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col md:flex-row">
      {/* Desktop Navigation Rail / Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-outline-variant/60 bg-surface-container-low p-4 h-screen sticky top-0">
        <Link href="/" className="flex items-center gap-3 px-3 py-2 mb-6">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-on-primary md-elevation-1">
            <GraduationCap className="h-6 w-6" />
          </span>
          <div>
            <span className="text-xl font-bold tracking-tight text-on-surface block leading-none">
              DeskMate
            </span>
            <span className="text-[11px] text-primary font-medium flex items-center gap-1 mt-1">
              <Sparkles className="h-3 w-3" /> AI Workspace
            </span>
          </div>
        </Link>

        {/* Search bar inside rail */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search notes, tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-3 text-xs rounded-full bg-surface-container-highest/60 border border-transparent focus:border-primary text-on-surface placeholder:text-on-surface-variant outline-none transition-all"
          />
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`md-state flex items-center justify-between px-4 py-3 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container md-elevation-1 font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      item.badge === 'AI'
                        ? 'bg-tertiary-container text-on-tertiary-container'
                        : 'bg-surface-variant text-on-surface-variant'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* AI Helper Quick Card in Sidebar */}
        <div className="my-4 rounded-2xl border border-primary/20 bg-primary-container/40 p-3.5">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-on-primary-container">
              Crunch AI Ready
            </span>
          </div>
          <p className="text-[11px] text-on-primary-container/80 leading-relaxed mb-3">
            Exam season boost activated. 18 flashcards generated today.
          </p>
          <Link
            href="/notes"
            className="block text-center text-xs font-medium text-primary hover:underline bg-surface-lowest py-1.5 rounded-lg border border-primary/20"
          >
            Open AI Studio →
          </Link>
        </div>

        {/* User Footer */}
        <div className="pt-3 border-t border-outline-variant/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
              JS
            </div>
            <div>
              <p className="text-xs font-medium text-on-surface line-clamp-1">Alex Student</p>
              <p className="text-[10px] text-on-surface-variant">Pro Plan</p>
            </div>
          </div>
          <Link
            href="/login"
            aria-label="Log out"
            className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/40 rounded-full transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area with Header */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top App Bar */}
        <header className="sticky top-0 z-40 h-16 border-b border-outline-variant/60 bg-surface/80 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 md:hidden">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-on-primary">
                <GraduationCap className="h-4 w-4" />
              </span>
              <span className="text-base font-bold text-on-surface">DeskMate</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-2 text-sm text-on-surface-variant">
            <span>Workspace</span>
            <span>/</span>
            <span className="font-semibold text-on-surface capitalize">
              {pathname.replace('/', '') || 'dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="relative md-state grid h-10 w-10 place-items-center rounded-full text-on-surface-variant hover:text-on-surface"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-tertiary" />
            </button>
            <ThemeToggle />
            
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-2 text-xs font-medium px-3.5 py-2 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors"
            >
              <User className="h-4 w-4" />
              Account
            </Link>
          </div>
        </header>

        {/* Dynamic Page View Body */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto animate-fade-in pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-surface-container/95 backdrop-blur-xl border-t border-outline-variant/60 flex items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full py-1 text-[11px] font-medium transition-colors ${
                isActive ? 'text-primary font-bold' : 'text-on-surface-variant'
              }`}
            >
              <span
                className={`p-1 rounded-full transition-transform ${
                  isActive ? 'bg-primary-container text-on-primary-container scale-110' : ''
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="mt-0.5">{item.label.split(' ')[0]}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
