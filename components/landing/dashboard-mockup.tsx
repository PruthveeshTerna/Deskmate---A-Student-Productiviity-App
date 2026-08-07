'use client'

import { useState } from 'react'
import {
  Bell,
  BookOpen,
  Brain,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  LayoutGrid,
  ListTodo,
  Play,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react'

type TabKey =
  | 'tasks'
  | 'timetable'
  | 'deadlines'
  | 'pomodoro'
  | 'analytics'
  | 'notes'
  | 'flashcards'
  | 'crunch'

export function DashboardMockup() {
  const [activeTab, setActiveTab] = useState<TabKey>('tasks')

  // Task state
  const [tasks, setTasks] = useState([
    { id: 1, label: 'Finish Calculus problem set', done: true, tag: 'Math' },
    { id: 2, label: 'Read Chapter 7 — Biology', done: true, tag: 'Bio' },
    { id: 3, label: 'Draft History essay outline', done: false, tag: 'History' },
    { id: 4, label: 'Review Spanish flashcards', done: false, tag: 'Languages' },
  ])

  // Pomodoro state
  const [pomodoroSec, setPomodoroSec] = useState(1499)
  const [isRunning, setIsRunning] = useState(false)

  // Flashcard flip state
  const [isFlipped, setIsFlipped] = useState(false)

  // AI note generation state
  const [isGenerating, setIsGenerating] = useState(false)
  const [notesGenerated, setNotesGenerated] = useState(true)

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    )
  }

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="rounded-3xl border border-outline-variant/60 bg-surface-container/90 p-4 md-elevation-3 backdrop-blur-xl sm:p-6 transition-all duration-300">
      {/* Window Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant/40 pb-3">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-error/80" />
          <span className="h-3 w-3 rounded-full bg-tertiary/80" />
          <span className="h-3 w-3 rounded-full bg-primary/80" />
          <span className="ml-2 text-xs font-semibold tracking-wider text-on-surface-variant uppercase">
            DeskMate OS · Academic Suite
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-primary-container px-3 py-1 text-xs font-semibold text-on-primary-container">
          <Sparkles className="h-3.5 w-3.5" /> Live Preview
        </div>
      </div>

      {/* Feature Selector Chips (Scrollable row) */}
      <div
        className="no-scrollbar mb-4 flex gap-1.5 overflow-x-auto pb-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {[
          { key: 'tasks', label: 'Tasks', icon: ListTodo },
          { key: 'timetable', label: 'Timetable', icon: CalendarDays },
          { key: 'deadlines', label: 'Deadlines', icon: Bell },
          { key: 'pomodoro', label: 'Pomodoro', icon: Clock },
          { key: 'analytics', label: 'Analytics', icon: TrendingUp },
          { key: 'notes', label: 'AI Notes', icon: BookOpen },
          { key: 'flashcards', label: 'Flashcards', icon: Brain },
          { key: 'crunch', label: 'Crunch Helper', icon: Zap },
        ].map((tab) => {
          const Icon = tab.icon
          const isSelected = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabKey)}
              className={`md-state flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-primary text-on-primary md-elevation-1 font-bold scale-105'
                  : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Main Showcase Panel */}
      <div className="min-h-[300px] rounded-2xl bg-surface-lowest p-4 sm:p-5 border border-outline-variant/40 shadow-inner">
        {/* TAB 1: Tasks */}
        {activeTab === 'tasks' && (
          <div className="animate-fade-in space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                  <ListTodo className="h-5 w-5 text-primary" /> Task Manager
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Click items to mark completed
                </p>
              </div>
              <span className="rounded-full bg-primary-container px-3 py-1 text-xs font-bold text-on-primary-container">
                {tasks.filter((t) => t.done).length} / {tasks.length} Done
              </span>
            </div>
            <ul className="space-y-2">
              {tasks.map((t) => (
                <li
                  key={t.id}
                  onClick={() => toggleTask(t.id)}
                  className="md-state flex cursor-pointer items-center justify-between rounded-xl bg-surface-container-low p-3 transition-colors hover:bg-surface-container"
                >
                  <div className="flex items-center gap-3">
                    {t.done ? (
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 animate-slide-up" />
                    ) : (
                      <Circle className="h-5 w-5 text-outline shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        t.done
                          ? 'text-on-surface-variant line-through opacity-70'
                          : 'text-on-surface font-medium'
                      }`}
                    >
                      {t.label}
                    </span>
                  </div>
                  <span className="rounded-md bg-secondary-container/60 px-2 py-0.5 text-[10px] font-bold text-on-secondary-container">
                    {t.tag}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* TAB 2: Timetable */}
        {activeTab === 'timetable' && (
          <div className="animate-fade-in space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-secondary" /> Weekly Schedule
              </h3>
              <span className="text-xs text-on-surface-variant font-medium">
                Friday, Today
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              <div className="rounded-xl border border-primary/20 bg-primary-container/30 p-3">
                <p className="text-[11px] font-bold text-primary">09:00 AM - 10:30 AM</p>
                <p className="text-xs font-bold text-on-primary-container mt-1">
                  CS201: Data Structures
                </p>
                <p className="text-[10px] text-on-surface-variant">Lecture Hall B4</p>
              </div>
              <div className="rounded-xl border border-secondary/20 bg-secondary-container/30 p-3">
                <p className="text-[11px] font-bold text-secondary">11:00 AM - 12:30 PM</p>
                <p className="text-xs font-bold text-on-secondary-container mt-1">
                  MATH302: Multivariable Calc
                </p>
                <p className="text-[10px] text-on-surface-variant">Science Wing 102</p>
              </div>
              <div className="rounded-xl border border-tertiary/20 bg-tertiary-container/30 p-3">
                <p className="text-[11px] font-bold text-tertiary">02:00 PM - 04:00 PM</p>
                <p className="text-xs font-bold text-on-tertiary-container mt-1">
                  AI Study Sprint Group
                </p>
                <p className="text-[10px] text-on-surface-variant">DeskMate Virtual Hub</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Deadlines */}
        {activeTab === 'deadlines' && (
          <div className="animate-fade-in space-y-3">
            <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
              <Bell className="h-5 w-5 text-tertiary" /> Upcoming Deadlines
            </h3>
            <div className="space-y-2">
              {[
                { title: 'Physics Lab Report #4', time: 'In 2 days', urgent: true },
                { title: 'Linear Algebra Midterm', time: 'In 5 days', urgent: false },
                { title: 'Software Engineering Project Proposal', time: 'Next Week', urgent: false },
              ].map((d, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl bg-surface-container-low p-3 border border-outline-variant/30"
                >
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{d.title}</p>
                    <p className="text-xs text-on-surface-variant">{d.time}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                      d.urgent
                        ? 'bg-error-container text-on-error-container animate-pulse'
                        : 'bg-surface-variant text-on-surface-variant'
                    }`}
                  >
                    {d.urgent ? '🔥 Urgent' : 'Scheduled'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Pomodoro */}
        {activeTab === 'pomodoro' && (
          <div className="animate-fade-in flex flex-col items-center justify-center text-center py-4 space-y-4">
            <span className="text-xs font-bold text-primary uppercase tracking-widest">
              Focus Timer Mode
            </span>
            <div className="text-5xl font-mono font-bold text-on-surface tracking-wider">
              {formatTimer(pomodoroSec)}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="md-state flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-on-primary md-elevation-1"
              >
                <Play className="h-4 w-4" /> {isRunning ? 'Pause' : 'Start Focus'}
              </button>
              <button
                onClick={() => {
                  setIsRunning(false)
                  setPomodoroSec(1500)
                }}
                className="md-state p-2.5 rounded-full bg-surface-container-high text-on-surface-variant"
                aria-label="Reset Timer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: Analytics */}
        {activeTab === 'analytics' && (
          <div className="animate-fade-in space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" /> Focus Analytics
              </h3>
              <span className="text-xs font-bold text-primary flex items-center gap-1">
                <Flame className="h-4 w-4 text-tertiary" /> 14 Day Streak
              </span>
            </div>
            <div className="flex items-end justify-between gap-2 h-36 pt-4">
              {[
                { day: 'Mon', hrs: 4.2 },
                { day: 'Tue', hrs: 6.5 },
                { day: 'Wed', hrs: 5.0 },
                { day: 'Thu', hrs: 7.8 },
                { day: 'Fri', hrs: 8.2 },
                { day: 'Sat', hrs: 3.5 },
                { day: 'Sun', hrs: 6.0 },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center h-28 bg-surface-container-low rounded-t-xl overflow-hidden">
                    <div
                      className="w-full bg-gradient-to-t from-primary/60 to-primary rounded-t-xl transition-all duration-500"
                      style={{ height: `${(item.hrs / 9) * 100}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-on-surface-variant">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: AI Notes */}
        {activeTab === 'notes' && (
          <div className="animate-fade-in space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" /> AI Notes Generator
              </h3>
              <button
                onClick={() => {
                  setIsGenerating(true)
                  setTimeout(() => setIsGenerating(false), 1200)
                }}
                className="flex items-center gap-1.5 text-xs font-bold rounded-full bg-primary-container px-3 py-1 text-on-primary-container"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {isGenerating ? 'Synthesizing...' : 'Re-Generate'}
              </button>
            </div>
            <div className="rounded-xl bg-surface-container-low p-4 border border-outline-variant/40">
              <p className="text-xs font-bold text-primary uppercase mb-1">
                Topic: Thermodynamics Summary
              </p>
              <p className="text-xs leading-relaxed text-on-surface text-pretty">
                {isGenerating
                  ? '⚡ AI is processing course materials and building structured key concepts...'
                  : '• First Law: Energy cannot be created or destroyed, only transformed.\n• Second Law: Entropy of an isolated system always increases.\n• Heat Capacity: Q = m c ΔT. Essential for phase change dynamics.'}
              </p>
            </div>
          </div>
        )}

        {/* TAB 7: Flashcards */}
        {activeTab === 'flashcards' && (
          <div className="animate-fade-in space-y-3 flex flex-col items-center">
            <div className="w-full flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <Brain className="h-5 w-5 text-secondary" /> AI Flashcard Studio
              </h3>
              <span className="text-xs font-medium text-on-surface-variant">
                Click card to flip
              </span>
            </div>

            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="perspective-1000 w-full max-w-sm h-36 cursor-pointer"
            >
              <div
                className={`relative w-full h-full rounded-2xl p-5 text-center transition-transform duration-500 transform-style-3d border border-secondary/30 flex flex-col items-center justify-center shadow-md ${
                  isFlipped
                    ? 'rotate-y-180 bg-secondary-container text-on-secondary-container'
                    : 'bg-surface-container-high text-on-surface'
                }`}
              >
                {!isFlipped ? (
                  <div>
                    <span className="text-[10px] font-bold text-secondary uppercase">
                      Question (Click to flip)
                    </span>
                    <p className="text-sm font-bold mt-2">
                      What is the equation for Newton’s Second Law of Motion?
                    </p>
                  </div>
                ) : (
                  <div className="rotate-y-180">
                    <span className="text-[10px] font-bold text-secondary uppercase">
                      Answer
                    </span>
                    <p className="text-sm font-bold mt-2">
                      F = m × a (Force = Mass × Acceleration)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: Crunch Helper */}
        {activeTab === 'crunch' && (
          <div className="animate-fade-in space-y-3">
            <div className="rounded-xl border border-tertiary/30 bg-tertiary-container/40 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-tertiary" />
                <h3 className="text-sm font-bold text-on-tertiary-container">
                  AI Crunch Study Helper
                </h3>
              </div>
              <p className="text-xs leading-relaxed text-on-tertiary-container/90">
                Exam in 3 Days! DeskMate created a 72-hour revision roadmap covering
                your highest-weight chapters first, auto-scheduling 4 Pomodoro blocks
                per day.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="rounded-md bg-tertiary px-3 py-1 text-xs font-bold text-on-tertiary">
                  Start 72-Hour Plan
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

