'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, type ReactNode } from 'react'
import { apiGet, apiPut, apiPost } from '@/lib/api'
import {
  Bell,
  BookOpen,
  Calendar,
  CheckSquare,
  Clock,
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
  History,
} from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { useAuth } from '@/lib/auth-context'

type NavItem = {
  href: string
  label: string
  icon: typeof LayoutDashboard
  badge?: string
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/timetable', label: 'Timetable', icon: Calendar },
  { href: '/analytics', label: 'Analytics', icon: LineChart },
  { href: '/pomodoro', label: 'Pomodoro', icon: Clock },
  { href: '/notes', label: 'AI Notes & Studio', icon: BookOpen, badge: 'AI' },
  { href: '/past-notes', label: 'Past AI Notes', icon: History },
]

type Notification = {
  id: number
  title: string
  message: string
  is_read: boolean
  created_at: string
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  const fetchNotifications = async () => {
    try {
      const data = await apiGet<Notification[]>('/api/notifications')
      setNotifications(data)
    } catch (err) {
      console.error('Failed to fetch notifications', err)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [pathname])

  const markAsRead = async (id: number) => {
    try {
      await apiPut(`/api/notifications/${id}/read`)
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n))
    } catch (err) {
      console.error('Failed to mark as read', err)
    }
  }

  const markAllAsRead = async () => {
    try {
      await apiPost('/api/notifications/read-all')
      setNotifications(notifications.map(n => ({ ...n, is_read: true })))
    } catch (err) {
      console.error('Failed to mark all as read', err)
    }
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  const displayName = user?.name || 'Alex Student'
  const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col md:flex-row">
      {/* Desktop Navigation Rail / Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-outline-variant/60 bg-surface-container-low p-4 h-screen sticky top-0 print:hidden">
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
              {initials}
            </div>
            <div>
              <p className="text-xs font-medium text-on-surface line-clamp-1">{displayName}</p>
              <p className="text-[10px] text-on-surface-variant">Pro Plan</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            aria-label="Log out"
            className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/40 rounded-full transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area with Header */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top App Bar */}
        <header className="sticky top-0 z-40 h-16 border-b border-outline-variant/60 bg-surface/80 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between print:hidden">
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
            <div className="relative">
              <button
                type="button"
                className="relative md-state grid h-10 w-10 place-items-center rounded-full text-on-surface-variant hover:text-on-surface focus:outline-none"
                aria-label="Notifications"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-error border-2 border-surface" />
                )}
              </button>

              {isNotificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 rounded-xl bg-surface-container shadow-lg border border-outline-variant z-50 overflow-hidden">
                    <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-high">
                      <h3 className="font-bold text-on-surface">Notifications</h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllAsRead}
                          className="text-xs text-primary hover:underline font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-sm text-on-surface-variant">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            onClick={() => {
                              if (!notif.is_read) markAsRead(notif.id)
                            }}
                            className={`p-4 border-b border-outline-variant last:border-0 cursor-pointer transition-colors ${notif.is_read ? 'bg-surface-container hover:bg-surface-container-high' : 'bg-surface-container-highest hover:bg-surface-variant'}`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <h4 className={`text-sm font-semibold ${notif.is_read ? 'text-on-surface-variant' : 'text-on-surface'}`}>
                                {notif.title}
                              </h4>
                              {!notif.is_read && (
                                <span className="h-2 w-2 flex-shrink-0 rounded-full bg-primary mt-1.5" />
                              )}
                            </div>
                            <p className={`text-xs mt-1 ${notif.is_read ? 'text-outline' : 'text-on-surface-variant'}`}>
                              {notif.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            <ThemeToggle />
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-2 text-xs font-medium px-3.5 py-2 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-variant transition-colors"
            >
              <User className="h-4 w-4" /> Account
            </Link>
          </div>
        </header>

        {/* Dynamic Page View Body */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto animate-fade-in pb-24 md:pb-8">
          {children}
        </main>

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
    </div>
  )
}
