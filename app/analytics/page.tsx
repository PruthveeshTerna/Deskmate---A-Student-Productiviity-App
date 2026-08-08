'use client'

import { Flame, LineChart, PieChart, Sparkles, TrendingUp, Zap } from 'lucide-react'
import { AppShell } from '@/components/app-shell'

export default function AnalyticsPage() {
  const weeklyData = [
    { day: 'Mon', hours: 4.5, target: 5.0 },
    { day: 'Tue', hours: 6.8, target: 5.0 },
    { day: 'Wed', hours: 5.2, target: 5.0 },
    { day: 'Thu', hours: 7.9, target: 5.0 },
    { day: 'Fri', hours: 8.5, target: 5.0 },
    { day: 'Sat', hours: 3.2, target: 4.0 },
    { day: 'Sun', hours: 6.0, target: 4.0 },
  ]

  const subjects = [
    { name: 'Computer Science', hours: 14.5, color: 'bg-primary', percent: 34 },
    { name: 'Multivariable Calc', hours: 11.2, color: 'bg-secondary', percent: 26 },
    { name: 'Biology & Chemistry', hours: 9.8, color: 'bg-tertiary', percent: 23 },
    { name: 'History & Languages', hours: 7.3, color: 'bg-surface-variant', percent: 17 },
  ]

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
            <Flame className="h-4 w-4 text-tertiary" /> 14-Day Streak Active
          </div>
        </div>

        {/* Top Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-outline-variant/60 bg-surface-container p-4">
            <p className="text-xs font-bold text-on-surface-variant uppercase">Total Study Time</p>
            <p className="text-3xl font-extrabold text-on-surface mt-1">42.1 hrs</p>
            <p className="text-xs text-emerald-600 font-bold mt-1">↑ +14% vs last week</p>
          </div>

          <div className="rounded-2xl border border-outline-variant/60 bg-surface-container p-4">
            <p className="text-xs font-bold text-on-surface-variant uppercase">Avg Daily Focus</p>
            <p className="text-3xl font-extrabold text-on-surface mt-1">6.0 hrs</p>
            <p className="text-xs text-primary font-bold mt-1">Target: 5.0 hrs/day</p>
          </div>

          <div className="rounded-2xl border border-outline-variant/60 bg-surface-container p-4">
            <p className="text-xs font-bold text-on-surface-variant uppercase">Focus Retention</p>
            <p className="text-3xl font-extrabold text-on-surface mt-1">92 %</p>
            <p className="text-xs text-secondary font-bold mt-1">High Focus Level</p>
          </div>

          <div className="rounded-2xl border border-outline-variant/60 bg-surface-container p-4">
            <p className="text-xs font-bold text-on-surface-variant uppercase">Pomodoros Done</p>
            <p className="text-3xl font-extrabold text-on-surface mt-1">64</p>
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
              {weeklyData.map((d, i) => (
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
              ))}
            </div>
          </div>

          {/* Subject Breakdown Card */}
          <div className="rounded-3xl border border-outline-variant/60 bg-surface-container p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-on-surface flex items-center gap-2 mb-4">
                <PieChart className="h-5 w-5 text-secondary" /> Subject Time Breakdown
              </h2>

              <div className="space-y-4">
                {subjects.map((s) => (
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
                ))}
              </div>
            </div>

            {/* AI Recommendation Box */}
            <div className="mt-6 rounded-2xl border border-primary/20 bg-primary-container/40 p-4">
              <div className="flex items-center gap-2 mb-1 text-primary">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-bold">AI Analytics Insight</span>
              </div>
              <p className="text-xs leading-relaxed text-on-primary-container">
                "Your optimal focus peak occurs between 9:00 AM – 11:30 AM. Schedule your hardest math problem sets during morning slots!"
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
