'use client'

import React, { useState } from 'react'
import { Bell, Calendar, Clock, Plus, Sparkles } from 'lucide-react'
import { AppShell } from '@/components/app-shell'

type ScheduleSlot = {
  id: number
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'
  time: string
  course: string
  location: string
  color: 'primary' | 'secondary' | 'tertiary'
}

export default function TimetablePage() {
  const [schedule] = useState<ScheduleSlot[]>([
    { id: 1, day: 'Mon', time: '09:00 AM', course: 'CS201 Data Structures', location: 'Hall B4', color: 'primary' },
    { id: 2, day: 'Mon', time: '11:00 AM', course: 'MATH302 Calc III', location: 'Science 102', color: 'secondary' },
    { id: 3, day: 'Tue', time: '10:00 AM', course: 'BIO101 Biology Lab', location: 'Lab 3', color: 'tertiary' },
    { id: 4, day: 'Wed', time: '09:00 AM', course: 'CS201 Data Structures', location: 'Hall B4', color: 'primary' },
    { id: 5, day: 'Thu', time: '02:00 PM', course: 'HIST110 World History', location: 'Arts 201', color: 'secondary' },
    { id: 6, day: 'Fri', time: '11:00 AM', course: 'MATH302 Calc III', location: 'Science 102', color: 'secondary' },
    { id: 7, day: 'Fri', time: '02:00 PM', course: 'AI Study Sprint', location: 'DeskMate Hub', color: 'primary' },
  ])

  const days: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri')[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  const times = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM']

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface">
              Timetable & Deadlines
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
              Your weekly class schedule and active exam countdowns.
            </p>
          </div>
        </div>

        {/* Exam Countdown Banner */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-tertiary/30 bg-tertiary-container/30 p-4">
            <span className="text-[10px] font-bold text-tertiary uppercase">Physics Lab Report</span>
            <p className="text-2xl font-black text-on-tertiary-container mt-1">2 Days Left</p>
            <p className="text-xs text-on-surface-variant mt-0.5">Due Sunday, 11:59 PM</p>
          </div>

          <div className="rounded-2xl border border-primary/30 bg-primary-container/30 p-4">
            <span className="text-[10px] font-bold text-primary uppercase">Linear Algebra Midterm</span>
            <p className="text-2xl font-black text-on-primary-container mt-1">4 Days Left</p>
            <p className="text-xs text-on-surface-variant mt-0.5">Tuesday, Hall A1</p>
          </div>

          <div className="rounded-2xl border border-secondary/30 bg-secondary-container/30 p-4">
            <span className="text-[10px] font-bold text-secondary uppercase">CS Project Proposal</span>
            <p className="text-2xl font-black text-on-secondary-container mt-1">9 Days Left</p>
            <p className="text-xs text-on-surface-variant mt-0.5">Github Repo Submission</p>
          </div>
        </div>

        {/* Weekly Schedule Grid */}
        <div className="rounded-3xl border border-outline-variant/60 bg-surface-container p-4 sm:p-6 overflow-x-auto">
          <h2 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" /> Weekly Class Schedule
          </h2>

          <div className="min-w-[600px] grid grid-cols-6 gap-2">
            {/* Header row */}
            <div className="p-2 text-center text-xs font-bold text-on-surface-variant">Time</div>
            {days.map((day) => (
              <div key={day} className="p-2 text-center text-xs font-bold text-on-surface uppercase tracking-wider bg-surface-container-high rounded-xl">
                {day}
              </div>
            ))}

            {/* Time slot rows */}
            {times.map((t) => (
              <React.Fragment key={t}>
                <div className="p-2 text-center text-[11px] font-bold text-on-surface-variant flex items-center justify-center">
                  {t}
                </div>
                {days.map((d) => {
                  const slot = schedule.find((s) => s.day === d && s.time === t)
                  return (
                    <div
                      key={`${d}-${t}`}
                      className="min-h-[70px] rounded-xl border border-outline-variant/30 bg-surface-lowest p-2 flex flex-col justify-between"
                    >
                      {slot ? (
                        <div
                          className={`h-full w-full rounded-lg p-2 flex flex-col justify-between text-left ${
                            slot.color === 'primary'
                              ? 'bg-primary-container/80 text-on-primary-container border border-primary/30'
                              : slot.color === 'secondary'
                              ? 'bg-secondary-container/80 text-on-secondary-container border border-secondary/30'
                              : 'bg-tertiary-container/80 text-on-tertiary-container border border-tertiary/30'
                          }`}
                        >
                          <span className="text-xs font-bold leading-tight">{slot.course}</span>
                          <span className="text-[10px] opacity-80">{slot.location}</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-on-surface-variant/40 flex items-center justify-center h-full">
                          —
                        </span>
                      )}
                    </div>
                  )
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}

