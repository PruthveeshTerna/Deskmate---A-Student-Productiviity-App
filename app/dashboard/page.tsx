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
  Flame,
  LineChart,
  ListTodo,
  Play,
  Plus,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'

export default function DashboardPage() {
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

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    )
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
                <Flame className="h-3.5 w-3.5 text-tertiary" /> 14-Day Streak!
              </span>
              <span className="text-xs text-on-surface-variant font-medium">Friday, August 7</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-on-surface">
              Welcome back, Alex! 👋
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
              You have 3 tasks due today and an upcoming Midterm in 4 days. Let’s crush it!
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
            <p className="text-2xl font-extrabold text-on-surface">3.5 hrs</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">↑ +45 mins vs yesterday</p>
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
            <p className="text-2xl font-extrabold text-on-surface">92 %</p>
            <p className="text-[11px] text-primary font-semibold mt-1">Optimal Retention State</p>
          </div>

          <div className="rounded-2xl border border-outline-variant/60 bg-surface-container p-4">
            <div className="flex items-center justify-between text-on-surface-variant mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">AI Cards Created</span>
              <BrainCircuit className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-extrabold text-on-surface">48</p>
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
                <div className="rounded-2xl border border-tertiary/30 bg-tertiary-container/30 p-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-tertiary text-on-tertiary text-[10px] font-bold">
                    🔥 2 Days Left
                  </span>
                  <h3 className="text-sm font-bold text-on-tertiary-container mt-2">
                    Physics Lab Report #4
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Thermodynamics & Heat Transfer analysis
                  </p>
                </div>

                <div className="rounded-2xl border border-secondary/30 bg-secondary-container/30 p-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary text-on-secondary text-[10px] font-bold">
                    📅 In 4 Days
                  </span>
                  <h3 className="text-sm font-bold text-on-secondary-container mt-2">
                    Linear Algebra Midterm
                  </h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Eigenvalues, Matrices & Vector Spaces
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pomodoro & AI Crunch Helper */}
          <div className="space-y-6">
            {/* Pomodoro Focus Timer Card */}
            <div className="rounded-3xl border border-primary/30 bg-gradient-to-b from-surface-container-high to-surface-container p-6 text-center shadow-lg">
              <div className="flex items-center justify-center gap-2 text-primary mb-3">
                <Clock className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Pomodoro Focus Timer</span>
              </div>

              <div className="my-4 text-5xl font-mono font-black text-on-surface tracking-widest">
                {formatTime(timerSeconds)}
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="md-state flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-on-primary md-elevation-1"
                >
                  <Play className="h-4 w-4" /> {isTimerRunning ? 'Pause' : 'Start Focus'}
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
                "Linear Algebra Midterm is in 4 days. I’ve analyzed your past quiz scores and generated a focused 8-hour review roadmap for Eigenvalues."
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
