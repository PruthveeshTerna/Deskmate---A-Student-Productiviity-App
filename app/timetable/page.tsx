'use client'

import React, { useState, useEffect } from 'react'
import { Bell, Calendar, Clock, Plus, Sparkles, X, Trash2 } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api'

type ScheduleSlot = {
  id: number
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'
  time: string
  course: string
  location: string
  color: 'primary' | 'secondary' | 'tertiary'
}

const FALLBACK_SCHEDULE: ScheduleSlot[] = [
  { id: 1, day: 'Mon', time: '09:00 AM', course: 'CS201 Data Structures', location: 'Hall B4', color: 'primary' },
  { id: 2, day: 'Mon', time: '11:00 AM', course: 'MATH302 Calc III', location: 'Science 102', color: 'secondary' },
  { id: 3, day: 'Tue', time: '10:00 AM', course: 'BIO101 Biology Lab', location: 'Lab 3', color: 'tertiary' },
  { id: 4, day: 'Wed', time: '09:00 AM', course: 'CS201 Data Structures', location: 'Hall B4', color: 'primary' },
  { id: 5, day: 'Thu', time: '02:00 PM', course: 'HIST110 World History', location: 'Arts 201', color: 'secondary' },
  { id: 6, day: 'Fri', time: '11:00 AM', course: 'MATH302 Calc III', location: 'Science 102', color: 'secondary' },
  { id: 7, day: 'Fri', time: '02:00 PM', course: 'AI Study Sprint', location: 'DeskMate Hub', color: 'primary' },
]

const DAY_MAP: Record<string, 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'> = {
  Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu', Friday: 'Fri',
}
const REVERSE_DAY_MAP: Record<string, string> = {
  Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday'
}
const COLORS: ('primary' | 'secondary' | 'tertiary')[] = ['primary', 'secondary', 'tertiary']

function mapEntry(e: any, idx: number): ScheduleSlot | null {
  const day = DAY_MAP[e.day]
  if (!day) return null
  return {
    id: e.id,
    day,
    time: e.start_time || '09:00 AM',
    course: e.subject,
    location: e.room || '',
    color: COLORS[idx % 3],
  }
}

export default function TimetablePage() {
  const [schedule, setSchedule] = useState<ScheduleSlot[]>([])
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [formSubject, setFormSubject] = useState('')
  const [formRoom, setFormRoom] = useState('')
  const [selectedEntryId, setSelectedEntryId] = useState<number | null>(null)

  const fetchSchedule = () => {
    apiGet<{ entries: any[] }>('/api/timetable')
      .then((data) => {
        if (data.entries) {
          const mapped = data.entries.map(mapEntry).filter(Boolean) as ScheduleSlot[]
          setSchedule(mapped)
        }
      })
      .catch(() => {
        // Keep empty data
      })
  }

  // Fetch timetable entries from backend
  useEffect(() => {
    fetchSchedule()
  }, [])

  const handleCellClick = (d: string, t: string, slot?: ScheduleSlot) => {
    setSelectedDay(REVERSE_DAY_MAP[d])
    setSelectedTime(t)
    if (slot) {
      setFormSubject(slot.course)
      setFormRoom(slot.location)
      setSelectedEntryId(slot.id)
    } else {
      setFormSubject('')
      setFormRoom('')
      setSelectedEntryId(null)
    }
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Convert 09:00 AM -> 10:00 AM for end time (simple default)
    let endTimeStr = selectedTime
    if (selectedTime.includes('AM') || selectedTime.includes('PM')) {
       const [time, period] = selectedTime.split(' ')
       const [h, m] = time.split(':')
       let numH = parseInt(h)
       if (numH === 12) {
           endTimeStr = `01:00 ${period}`
       } else if (numH === 11 && period === 'AM') {
           endTimeStr = `12:00 PM`
       } else {
           endTimeStr = `${String(numH + 1).padStart(2, '0')}:${m} ${period}`
       }
    }

    const payload = {
      subject: formSubject,
      room: formRoom,
      day: selectedDay,
      start_time: selectedTime,
      end_time: endTimeStr
    }

    try {
      if (selectedEntryId) {
        // Edit existing non-fallback entry
        await apiPut(`/api/timetable/${selectedEntryId}`, payload)
      } else {
        // Create new
        await apiPost('/api/timetable', payload)
      }
      setIsModalOpen(false)
      fetchSchedule()
    } catch (err) {
      // For demo purposes, we optimistically update UI if backend fails (e.g. not logged in)
      const newSlot: ScheduleSlot = {
        id: selectedEntryId || Math.random(),
        day: DAY_MAP[selectedDay],
        time: selectedTime,
        course: formSubject,
        location: formRoom,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      }
      
      if (selectedEntryId) {
        setSchedule(prev => prev.map(s => s.id === selectedEntryId ? newSlot : s))
      } else {
        setSchedule(prev => [...prev, newSlot])
      }
      setIsModalOpen(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedEntryId) return
    try {
       await apiDelete(`/api/timetable/${selectedEntryId}`)
       setIsModalOpen(false)
       fetchSchedule()
    } catch (err) {
       setSchedule(prev => prev.filter(s => s.id !== selectedEntryId))
       setIsModalOpen(false)
    }
  }

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
          {schedule.length > 0 ? (
            schedule.slice(0, 3).map((slot, i) => (
              <div key={slot.id} className={`rounded-2xl border p-4 ${
                i % 3 === 0 ? 'border-tertiary/30 bg-tertiary-container/30' :
                i % 3 === 1 ? 'border-primary/30 bg-primary-container/30' :
                'border-secondary/30 bg-secondary-container/30'
              }`}>
                <span className={`text-[10px] font-bold uppercase ${
                  i % 3 === 0 ? 'text-tertiary' : i % 3 === 1 ? 'text-primary' : 'text-secondary'
                }`}>
                  {slot.course}
                </span>
                <p className={`text-2xl font-black mt-1 ${
                  i % 3 === 0 ? 'text-on-tertiary-container' : i % 3 === 1 ? 'text-on-primary-container' : 'text-on-secondary-container'
                }`}>
                  {slot.day} {slot.time}
                </p>
                <p className="text-xs text-on-surface-variant mt-0.5">Room: {slot.location}</p>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-on-surface-variant bg-surface-container-high rounded-3xl text-sm">
              No upcoming exams or deadlines! Enjoy the peace. 🧘
            </div>
          )}
        </div>

        {/* Weekly Schedule Grid */}
        <div className="rounded-3xl border border-outline-variant/60 bg-surface-container p-4 sm:p-6 overflow-x-auto relative">
          <h2 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" /> Weekly Class Schedule
            <span className="text-xs font-normal text-on-surface-variant ml-2">(Click any cell to add/edit)</span>
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
                      onClick={() => handleCellClick(d, t, slot)}
                      className={`min-h-[70px] rounded-xl border p-2 flex flex-col justify-between cursor-pointer transition-all ${
                        slot 
                          ? 'border-transparent hover:brightness-95' 
                          : 'border-outline-variant/30 bg-surface-lowest hover:bg-surface-container-high hover:border-primary/50'
                      }`}
                    >
                      {slot ? (
                        <div
                          className={`h-full w-full rounded-lg p-2 flex flex-col justify-between text-left shadow-sm ${
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
                        <div className="h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                           <Plus className="h-4 w-4 text-primary" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in px-4">
          <div className="bg-surface-container rounded-3xl border border-outline-variant p-6 w-full max-w-sm md-elevation-3">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-on-surface">
                {selectedEntryId ? 'Edit Class' : 'Add Class'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-surface-variant text-on-surface-variant"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">Time Slot</label>
                <div className="text-sm font-medium text-on-surface p-3 bg-surface-lowest rounded-xl border border-outline-variant/50">
                  {selectedDay} at {selectedTime}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">Subject / Course Name</label>
                <input
                  type="text"
                  required
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  placeholder="e.g. CS201 Data Structures"
                  className="w-full text-sm p-3 bg-surface-lowest rounded-xl border border-outline-variant/50 focus:border-primary outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">Location / Room (Optional)</label>
                <input
                  type="text"
                  value={formRoom}
                  onChange={(e) => setFormRoom(e.target.value)}
                  placeholder="e.g. Hall B4"
                  className="w-full text-sm p-3 bg-surface-lowest rounded-xl border border-outline-variant/50 focus:border-primary outline-none transition-colors"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                {selectedEntryId && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="p-3 bg-error-container text-on-error-container rounded-xl hover:brightness-95 transition-all"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 p-3 bg-primary text-on-primary font-bold rounded-xl hover:brightness-105 transition-all md-state"
                >
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  )
}

