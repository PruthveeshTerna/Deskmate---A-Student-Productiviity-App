'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Clock,
  Coffee,
  ExternalLink,
  Flame,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
  Sparkles,
  Target,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'

type TimerMode = 'focus' | 'shortBreak' | 'longBreak'

const MODES: Record<TimerMode, { label: string; duration: number; color: string }> = {
  focus: { label: 'Focus', duration: 25 * 60, color: 'primary' },
  shortBreak: { label: 'Short Break', duration: 5 * 60, color: 'secondary' },
  longBreak: { label: 'Long Break', duration: 15 * 60, color: 'tertiary' },
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function PomodoroTimer({ isPopup }: { isPopup: boolean }) {
  const [mode, setMode] = useState<TimerMode>('focus')
  const [secondsLeft, setSecondsLeft] = useState(MODES.focus.duration)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionsCompleted, setSessions] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const totalDuration = MODES[mode].duration
  const progress = secondsLeft / totalDuration
  const circumference = 2 * Math.PI * 120

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!)
            setIsRunning(false)
            if (mode === 'focus') setSessions((s) => s + 1)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRunning, mode])

  const switchMode = useCallback((newMode: TimerMode) => {
    setIsRunning(false)
    setMode(newMode)
    setSecondsLeft(MODES[newMode].duration)
  }, [])

  const handleReset = () => {
    setIsRunning(false)
    setSecondsLeft(MODES[mode].duration)
  }

  const handlePopOut = () => {
    window.open(
      '/pomodoro',
      'DeskMate Pomodoro',
      'width=480,height=700,menubar=no,toolbar=no,location=no,status=no,resizable=yes'
    )
  }

  const content = (
    <div className="flex flex-col items-center justify-center gap-8 py-8">
      {/* Page Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Clock className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-extrabold tracking-tight text-on-surface">
            Pomodoro Timer
          </h1>
          {!isPopup && (
            <button
              onClick={handlePopOut}
              className="ml-3 md-state flex items-center gap-1.5 rounded-full bg-surface-container-high px-3 py-1.5 text-[10px] font-bold text-on-surface-variant hover:bg-surface-variant transition-colors border border-outline-variant/60"
              title="Open in separate window"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Pop Out
            </button>
          )}
        </div>
        <p className="text-sm text-on-surface-variant">
          Stay focused and productive with timed work sessions
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-1 rounded-full bg-surface-container-high p-1 border border-outline-variant/60">
        {(Object.entries(MODES) as [TimerMode, typeof MODES.focus][]).map(
          ([key, val]) => (
            <button
              key={key}
              onClick={() => switchMode(key)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                mode === key
                  ? `bg-${val.color}-container text-on-${val.color}-container md-elevation-1`
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              style={
                mode === key
                  ? {
                      backgroundColor: `var(--md-sys-color-${val.color}-container)`,
                      color: `var(--md-sys-color-on-${val.color}-container)`,
                    }
                  : undefined
              }
            >
              {key === 'focus' ? (
                <Target className="h-3.5 w-3.5" />
              ) : (
                <Coffee className="h-3.5 w-3.5" />
              )}
              {val.label}
            </button>
          )
        )}
      </div>

      {/* Timer Display Card */}
      <div className="rounded-[2rem] border border-primary/20 bg-gradient-to-b from-surface-container-high to-surface-container p-8 shadow-xl">
        {/* Circular Progress Ring */}
        <div className="relative mx-auto h-64 w-64">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 260 260">
            {/* Background track */}
            <circle
              cx="130"
              cy="130"
              r="120"
              fill="none"
              stroke="var(--md-sys-color-surface-variant, #e0e0e0)"
              strokeWidth="10"
              opacity="0.5"
            />
            {/* Progress arc */}
            <circle
              cx="130"
              cy="130"
              r="120"
              fill="none"
              stroke={`var(--md-sys-color-${MODES[mode].color}, #6750A4)`}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-mono font-black text-on-surface tracking-wider">
              {formatTime(secondsLeft)}
            </span>
            <span className="text-xs font-semibold text-on-surface-variant mt-2 uppercase tracking-widest">
              {MODES[mode].label}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="md-state flex items-center gap-2 rounded-full px-8 py-3 text-sm font-bold md-elevation-1 transition-transform hover:scale-105"
            style={{
              backgroundColor: `var(--md-sys-color-${MODES[mode].color})`,
              color: `var(--md-sys-color-on-${MODES[mode].color})`,
            }}
          >
            {isRunning ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={handleReset}
            className="md-state p-3 rounded-full bg-surface-variant text-on-surface-variant hover:bg-surface-container-highest transition-colors"
            aria-label="Reset Timer"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
          <button
            onClick={() => {
              if (mode === 'focus') {
                switchMode(sessionsCompleted % 4 === 3 ? 'longBreak' : 'shortBreak')
              } else {
                switchMode('focus')
              }
            }}
            className="md-state p-3 rounded-full bg-surface-variant text-on-surface-variant hover:bg-surface-container-highest transition-colors"
            aria-label="Skip to next session"
          >
            <SkipForward className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-md">
        <div className="rounded-2xl border border-outline-variant/60 bg-surface-container p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-primary mb-1">
            <Flame className="h-4 w-4" />
          </div>
          <p className="text-2xl font-extrabold text-on-surface">{sessionsCompleted}</p>
          <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mt-0.5">
            Sessions
          </p>
        </div>
        <div className="rounded-2xl border border-outline-variant/60 bg-surface-container p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-secondary mb-1">
            <Clock className="h-4 w-4" />
          </div>
          <p className="text-2xl font-extrabold text-on-surface">
            {Math.floor((sessionsCompleted * 25) / 60)}h {(sessionsCompleted * 25) % 60}m
          </p>
          <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mt-0.5">
            Total Focus
          </p>
        </div>
        <div className="rounded-2xl border border-outline-variant/60 bg-surface-container p-4 text-center">
          <div className="flex items-center justify-center gap-1 text-tertiary mb-1">
            <Sparkles className="h-4 w-4" />
          </div>
          <p className="text-2xl font-extrabold text-on-surface">
            {Math.min(Math.round((sessionsCompleted / 8) * 100), 100)}%
          </p>
          <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mt-0.5">
            Daily Goal
          </p>
        </div>
      </div>

      {/* Tip Banner */}
      <div className="w-full max-w-md rounded-2xl border border-primary/20 bg-primary-container/30 p-4 text-center">
        <p className="text-xs text-on-primary-container leading-relaxed">
          💡 <strong>Tip:</strong> After every 4 focus sessions, take a longer 15-minute break
          to recharge. You&apos;re on session {(sessionsCompleted % 4) + 1} of 4.
        </p>
      </div>
    </div>
  )

  if (isPopup) {
    return (
      <div className="min-h-screen bg-background text-on-background p-4">
        {content}
      </div>
    )
  }

  return <AppShell>{content}</AppShell>
}

export default function PomodoroPage() {
  const [isPopup, setIsPopup] = useState(false)

  useEffect(() => {
    // Detect if opened as a popup (window.opener exists or window is small)
    if (typeof window !== 'undefined') {
      setIsPopup(!!window.opener || window.innerWidth < 600)
    }
  }, [])

  return <PomodoroTimer isPopup={isPopup} />
}
