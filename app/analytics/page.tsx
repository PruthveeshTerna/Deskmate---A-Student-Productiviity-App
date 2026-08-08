'use client'

import { useState, useEffect } from 'react'
import { Flame, LineChart, PieChart, Sparkles, TrendingUp, Zap } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { apiGet } from '@/lib/api'

export default function AnalyticsPage() {
  const [weeklyData, setWeeklyData] = useState<{ day: string; hours: number; target: number }[]>([])

  const [subjects, setSubjects] = useState<{ name: string; hours: number; color: string; percent: number }[]>([])

  const [totalHours, setTotalHours] = useState('0.0')
  const [avgDaily, setAvgDaily] = useState('0.0')
  const [pomodoroCount, setPomodoroCount] = useState(0)
  const [focusRetention, setFocusRetention] = useState(0)
  const [streak, setStreak] = useState(0)
  const [suggestion, setSuggestion] = useState(
    '"Start logging study sessions to receive personalized AI insights!"'
  )

  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const COLORS = ['bg-primary', 'bg-secondary', 'bg-tertiary', 'bg-surface-variant']

  // Fetch analytics from backend
  useEffect(() => {
    apiGet<{
      tasks_completed: number
      tasks_pending: number
      study_time_by_subject: Record<string, number>
      weekly_trend: { date: string; tasks_completed: number; study_minutes: number }[]
      suggestions: string[]
      focus_retention: number
    }>('/api/analytics')
      .then((data) => {
        // Weekly trend
        if (data.weekly_trend) {
          const mapped = data.weekly_trend.map((d, i) => ({
            day: DAYS[i % 7],
            hours: Math.round((d.study_minutes / 60) * 10) / 10,
            target: 5.0,
          }))
          setWeeklyData(mapped)
          const total = mapped.reduce((sum, d) => sum + d.hours, 0)
          setTotalHours(total.toFixed(1))
          setAvgDaily((total / 7).toFixed(1))
          
          if (total > 0) {
            setPomodoroCount(Math.floor(total * (60 / 25)))
          }
        }
        
        if (data.focus_retention !== undefined) {
          setFocusRetention(data.focus_retention)
        }

        // Subject breakdown
        if (data.study_time_by_subject) {
          const entries = Object.entries(data.study_time_by_subject)
          const totalMins = entries.reduce((sum, [, mins]) => sum + mins, 0)
          const mapped = entries.map(([name, mins], i) => ({
            name,
            hours: Math.round((mins / 60) * 10) / 10,
            color: COLORS[i % COLORS.length],
            percent: totalMins > 0 ? Math.round((mins / totalMins) * 100) : 0,
          }))
          setSubjects(mapped)
        }

        // Suggestions
        if (data.suggestions && data.suggestions.length > 0) {
          setSuggestion(`"${data.suggestions[0]}"`)
        } else if (data.suggestions && data.suggestions.length === 0) {
          setSuggestion(`"Start completing tasks and pomodoro sessions to generate insights!"`)
        }
      })
      .catch(() => {
        // Keep fallback data
      })

    // Fetch streak
    apiGet<{ streak: number }>('/api/pomodoro/streak')
      .then((data) => {
        if (typeof data.streak === 'number') setStreak(data.streak)
      })
      .catch(() => {})
  }, [])

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface">
              Productivity & Focus Analytics
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
              Track focus hours, retention rates, and study distribution.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-primary-container px-4 py-1.5 text-xs font-bold text-on-primary-container">
            <Flame className="h-4 w-4 text-tertiary" /> {streak}-Day Streak Active
          </div>
        </div>

        {/* Top Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-outline-variant/60 bg-surface-container p-4">
            <p className="text-xs font-bold text-on-surface-variant uppercase">Total Study Time</p>
            <p className="text-3xl font-extrabold text-on-surface mt-1">{totalHours} hrs</p>
            <p className="text-xs text-emerald-600 font-bold mt-1">↑ +14% vs last week</p>
          </div>

          <div className="rounded-2xl border border-outline-variant/60 bg-surface-container p-4">
            <p className="text-xs font-bold text-on-surface-variant uppercase">Avg Daily Focus</p>
            <p className="text-3xl font-extrabold text-on-surface mt-1">{avgDaily} hrs</p>
            <p className="text-xs text-primary font-bold mt-1">Target: 5.0 hrs/day</p>
          </div>

          <div className="rounded-2xl border border-outline-variant/60 bg-surface-container p-4">
            <p className="text-xs font-bold text-on-surface-variant uppercase">Focus Retention</p>
            <p className="text-3xl font-extrabold text-on-surface mt-1">{focusRetention} %</p>
            <p className="text-xs text-secondary font-bold mt-1">
              {focusRetention > 0 ? 'High Focus Level' : 'Needs tracking'}
            </p>
          </div>

          <div className="rounded-2xl border border-outline-variant/60 bg-surface-container p-4">
            <p className="text-xs font-bold text-on-surface-variant uppercase">Pomodoros Done</p>
            <p className="text-3xl font-extrabold text-on-surface mt-1">{pomodoroCount}</p>
            <p className="text-xs text-tertiary font-bold mt-1">25m sessions completed</p>
          </div>
        </div>

        {/* Analytics Charts Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Focus Bar Chart */}
          <div className="lg:col-span-2 rounded-3xl border border-outline-variant/60 bg-surface-container p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" /> Daily Focus Hours
                </h2>
                <p className="text-xs text-on-surface-variant">Hours logged per day this week</p>
              </div>
              <span className="text-xs font-bold text-primary bg-primary-container px-3 py-1 rounded-full">
                This Week
              </span>
            </div>

            {/* Bar Chart Visualization */}
            <div className="flex items-end justify-between gap-3 h-52 pt-6 px-2">
              {weeklyData.length > 0 ? (
                weeklyData.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[11px] font-bold text-primary">{d.hours}h</span>
                    <div className="w-full flex items-end justify-center h-36 bg-surface-container-high rounded-t-2xl overflow-hidden">
                      <div
                        className="w-full bg-gradient-to-t from-primary/70 via-primary to-secondary rounded-t-2xl transition-all duration-500 hover:opacity-90"
                        style={{ height: `${(d.hours / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-on-surface-variant">{d.day}</span>
                  </div>
                ))
              ) : (
                <div className="w-full h-full flex items-center justify-center text-on-surface-variant text-sm pb-10">
                  No focus data for this week yet. Use the Pomodoro timer to log time!
                </div>
              )}
            </div>
          </div>

          {/* Subject Breakdown Card */}
          <div className="rounded-3xl border border-outline-variant/60 bg-surface-container p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-on-surface flex items-center gap-2 mb-4">
                <PieChart className="h-5 w-5 text-secondary" /> Subject Time Breakdown
              </h2>

              <div className="space-y-4">
                {subjects.length > 0 ? (
                  subjects.map((s) => (
                    <div key={s.name}>
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span className="text-on-surface">{s.name}</span>
                        <span className="text-on-surface-variant">{s.hours} hrs ({s.percent}%)</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-surface-variant overflow-hidden">
                        <div
                          className={`h-full rounded-full ${s.color}`}
                          style={{ width: `${s.percent}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-on-surface-variant text-sm">
                    No subjects tracked yet.
                  </div>
                )}
              </div>
            </div>

            {/* AI Recommendation Box */}
            <div className="mt-6 rounded-2xl border border-primary/20 bg-primary-container/40 p-4">
              <div className="flex items-center gap-2 mb-1 text-primary">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-bold">AI Analytics Insight</span>
              </div>
              <p className="text-xs leading-relaxed text-on-primary-container">
                {suggestion}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
