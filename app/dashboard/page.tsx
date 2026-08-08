'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Bell,
  BookOpen,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock,
  ExternalLink,
  Flame,
  LineChart,
  ListTodo,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { apiGet, apiPut } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'

export default function DashboardPage() {
  const { user } = useAuth()

  // Pomodoro timer state
  const [timerSeconds, setTimerSeconds] = useState(1500)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  // Checklist state
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Submit Multivariable Calculus Assignment', done: true, subject: 'Math', time: '11:59 PM' },
    { id: 2, text: 'Review Data Structures Binary Trees', done: false, subject: 'CS', time: 'Today' },
    { id: 3, text: 'Read Biology Ch. 8 Cellular Respiration', done: false, subject: 'Bio', time: 'Tomorrow' },
    { id: 4, text: 'Draft Macroeconomics Essay Outline', done: false, subject: 'Econ', time: 'In 3 days' },
  ])

  // Streak state
  const [streak, setStreak] = useState(0)
  const displayName = user?.name?.split(' ')[0] || 'Alex'

  // Dynamic stats
  const [focusHours, setFocusHours] = useState(0)
  const [focusScore, setFocusScore] = useState(0)
  const [cardsCreated, setCardsCreated] = useState(0)
  const [upcomingExams, setUpcomingExams] = useState<any[]>([])

  // Fetch real tasks from backend
  useEffect(() => {
    apiGet<{ tasks: any[] }>('/api/tasks')
      .then((data) => {
        if (data.tasks) {
          const mapped = data.tasks.slice(0, 4).map((t: any) => ({
            id: t.id,
            text: t.title,
            done: t.completed,
            subject: t.subject || 'General',
            time: t.due_date
              ? new Date(t.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : 'No date',
          }))
          setTasks(mapped)
        }
      })
      .catch(() => {
        // Keep fallback data
      })
  }, [])

  // Fetch streak & analytics
  useEffect(() => {
    apiGet<{ streak: number }>('/api/pomodoro/streak')
      .then((data) => {
        if (typeof data.streak === 'number') {
          setStreak(data.streak)
        }
      })
      .catch(() => {})

    apiGet<{ study_time_by_subject: Record<string, number>, focus_score: number, cards_created: number }>('/api/analytics')
      .then((data) => {
        if (data.study_time_by_subject) {
          const totalMins = Object.values(data.study_time_by_subject).reduce((a, b) => a + b, 0)
          setFocusHours(Math.round((totalMins / 60) * 10) / 10)
          if (data.focus_score !== undefined) {
            setFocusScore(data.focus_score)
          }
          if (data.cards_created !== undefined) {
            setCardsCreated(data.cards_created)
          }
        }
      })
      .catch(() => {})
      
    apiGet<{ entries: any[] }>('/api/timetable')
      .then((data) => {
        if (data.entries) {
           setUpcomingExams(data.entries.slice(0, 2))
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds((prev) => prev - 1), 1000)
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerRunning, timerSeconds])

  const toggleTask = async (id: number) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    )

    try {
      await apiPut(`/api/tasks/${id}`, { completed: !task.done })
    } catch {
      // Revert on failure
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: task.done } : t))
      )
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-primary/20 bg-gradient-to-r from-primary-container/60 via-secondary-container/40 to-surface-container p-6 md-elevation-1">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-tertiary" /> {streak}-Day Streak!
              </span>
              <span className="text-xs text-on-surface-variant font-medium">Friday, August 7</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-on-surface">
              Welcome back, {displayName}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
              You have {tasks.filter(t => !t.done).length} tasks due today and an upcoming Midterm in 4 days. Let's crush it!
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/notes"
              className="md-state inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-on-primary md-elevation-1"
            >
              <Sparkles className="h-4 w-4" /> AI Notes Studio
            </Link>
          </div>
        </div>

        {/* Quick Stat Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-outline-variant/60 bg-surface-container p-4">
            <div className="flex items-center justify-between text-on-surface-variant mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Today's Focus</span>
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-extrabold text-on-surface">{focusHours} hrs</p>
            {focusHours > 0 ? (
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">↑ Active study logged</p>
            ) : (
              <p className="text-[11px] text-on-surface-variant font-semibold mt-1">Ready to start</p>
            )}
          </div>

          <div className="rounded-2xl border border-outline-variant/60 bg-surface-container p-4">
            <div className="flex items-center justify-between text-on-surface-variant mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Tasks Done</span>
              <ListTodo className="h-4 w-4 text-secondary" />
            </div>
            <p className="text-2xl font-extrabold text-on-surface">
              {tasks.filter((t) => t.done).length} / {tasks.length}
            </p>
            <div className="w-full bg-surface-variant h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(tasks.filter((t) => t.done).length / tasks.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-outline-variant/60 bg-surface-container p-4">
            <div className="flex items-center justify-between text-on-surface-variant mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Focus Score</span>
              <TrendingUp className="h-4 w-4 text-tertiary" />
            </div>
            <p className="text-2xl font-extrabold text-on-surface">{focusScore} %</p>
            <p className="text-[11px] text-primary font-semibold mt-1">Optimal Retention State</p>
          </div>

          <div className="rounded-2xl border border-outline-variant/60 bg-surface-container p-4">
            <div className="flex items-center justify-between text-on-surface-variant mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">AI Cards Created</span>
              <BrainCircuit className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-extrabold text-on-surface">{cardsCreated}</p>
            <p className="text-[11px] text-on-surface-variant mt-1">Ready for study review</p>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column: Task Checklist & Timetable */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Checklist Card */}
            <div className="rounded-3xl border border-outline-variant/60 bg-surface-container p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ListTodo className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-bold text-on-surface">Today's Priority Tasks</h2>
                </div>
                <Link
                  href="/tasks"
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  View All Tasks →
                </Link>
              </div>

              <div className="space-y-2.5">
                {tasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => toggleTask(t.id)}
                    className="md-state flex cursor-pointer items-center justify-between rounded-2xl bg-surface-lowest p-3.5 border border-outline-variant/40 hover:bg-surface-container-high transition-all"
                  >
                    <div className="flex items-center gap-3">
                      {t.done ? (
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-outline shrink-0" />
                      )}
                      <span
                        className={`text-xs sm:text-sm font-medium ${
                          t.done
                            ? 'line-through text-on-surface-variant opacity-60'
                            : 'text-on-surface'
                        }`}
                      >
                        {t.text}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-on-surface-variant bg-surface-variant/60 px-2.5 py-0.5 rounded-full">
                        {t.subject}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines Widget */}
            <div className="rounded-3xl border border-outline-variant/60 bg-surface-container p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-tertiary" />
                  <h2 className="text-lg font-bold text-on-surface">Upcoming Deadlines & Exams</h2>
                </div>
                <Link
                  href="/timetable"
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Timetable →
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {upcomingExams.length > 0 ? (
                  upcomingExams.map((exam, i) => (
                    <div key={exam.id} className={`rounded-2xl border p-4 ${
                      i % 2 === 0 
                        ? 'border-tertiary/30 bg-tertiary-container/30' 
                        : 'border-secondary/30 bg-secondary-container/30'
                    }`}>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        i % 2 === 0 ? 'bg-tertiary text-on-tertiary' : 'bg-secondary text-on-secondary'
                      }`}>
                        📅 {exam.day} {exam.start_time}
                      </span>
                      <h3 className={`text-sm font-bold mt-2 ${
                        i % 2 === 0 ? 'text-on-tertiary-container' : 'text-on-secondary-container'
                      }`}>
                        {exam.subject}
                      </h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Room: {exam.room || 'TBD'}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-6 text-on-surface-variant text-sm">
                    No upcoming deadlines! Enjoy your free time. 🚀
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Pomodoro & AI Crunch Helper */}
          <div className="space-y-6">
            {/* Pomodoro Focus Timer Card */}
            <div className="rounded-3xl border border-primary/30 bg-gradient-to-b from-surface-container-high to-surface-container p-6 text-center shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-primary">
                  <Clock className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">Focus Timer</span>
                </div>
                <button
                  onClick={() => {
                    window.open(
                      '/pomodoro',
                      'DeskMate Pomodoro',
                      'width=480,height=700,menubar=no,toolbar=no,location=no,status=no,resizable=yes'
                    )
                  }}
                  className="md-state flex items-center gap-1.5 rounded-full bg-surface-variant/80 px-3 py-1.5 text-[10px] font-bold text-on-surface-variant hover:bg-surface-variant transition-colors"
                  title="Open in separate window"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Pop Out
                </button>
              </div>

              {/* Circular Progress Ring */}
              <div className="relative mx-auto my-2 h-40 w-40">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="var(--md-sys-color-surface-variant, #e0e0e0)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="var(--md-sys-color-primary, #6750A4)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 70}
                    strokeDashoffset={
                      2 * Math.PI * 70 * (1 - timerSeconds / 1500)
                    }
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-mono font-black text-on-surface tracking-wider">
                    {formatTime(timerSeconds)}
                  </span>
                  <span className="text-[10px] font-semibold text-on-surface-variant mt-1 uppercase tracking-wider">
                    Focus Session
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3 mt-4">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="md-state flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-on-primary md-elevation-1"
                >
                  {isTimerRunning ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  {isTimerRunning ? 'Pause' : 'Start Focus'}
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false)
                    setTimerSeconds(1500)
                  }}
                  className="md-state p-2.5 rounded-full bg-surface-variant text-on-surface-variant"
                  aria-label="Reset Timer"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              {/* Session Info */}
              <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <Flame className="h-3.5 w-3.5 text-tertiary" /> 3 sessions today
                </span>
                <span>•</span>
                <span>1h 15m focused</span>
              </div>
            </div>

            {/* AI Crunch Helper Widget */}
            <div className="rounded-3xl border border-tertiary/30 bg-tertiary-container/40 p-6 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-5 w-5 text-tertiary animate-bounce" />
                <h3 className="text-sm font-extrabold text-on-tertiary-container">
                  AI Crunch Study Helper
                </h3>
              </div>
              <p className="text-xs text-on-tertiary-container/90 leading-relaxed">
                "Linear Algebra Midterm is in 4 days. I've analyzed your past quiz scores and generated a focused 8-hour review roadmap for Eigenvalues."
              </p>
              <Link
                href="/notes"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-tertiary px-4 py-2 text-xs font-bold text-on-tertiary md-elevation-1"
              >
                Launch AI Crunch Plan →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
