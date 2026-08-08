// ---------------------------------------------------------------------------
// TypeScript types matching the Flask backend JSON response shapes.
// ---------------------------------------------------------------------------

export interface User {
  id: number
  name: string
  email: string
  token: string
}

export interface Task {
  id: number
  user_id: number
  title: string
  description: string
  due_date: string | null
  priority: 'high' | 'medium' | 'low'
  subject: string
  completed: boolean
  created_at: string | null
}

export interface TimetableEntry {
  id: number
  user_id: number
  subject: string
  day: string
  start_time: string
  end_time: string
  room: string
}

export interface Note {
  id: number
  user_id: number
  title: string
  subject: string
  content: string
  created_at: string | null
}

export interface Flashcard {
  id: number
  note_id: number
  question: string
  answer: string
}

export interface Quiz {
  id: number
  note_id: number
  question: string
  options: string[]
  correct_answer: string
}

export interface PomodoroSession {
  id: number
  user_id: number
  task_id: number | null
  subject: string
  duration_minutes: number
  completed_at: string
}

export interface StudyGoal {
  id: number
  user_id: number
  date: string
  target_minutes: number
  achieved_minutes: number
}

export interface CrunchPlan {
  topics: {
    name: string
    priority: 'high' | 'medium' | 'low'
    time_minutes: number
    key_points: string[]
  }[]
  flashcards: { question: string; answer: string }[]
  quiz: {
    question: string
    options: string[]
    correct_answer: string
  }[]
}

export interface AnalyticsData {
  tasks_completed: number
  tasks_pending: number
  study_time_by_subject: Record<string, number>
  weekly_trend: {
    date: string
    tasks_completed: number
    study_minutes: number
  }[]
  suggestions: string[]
}

export interface AiNotesResult {
  structured_notes: string | null
  summary: string | null
  diagrams: string | null
  flashcards: { question: string; answer: string }[] | null
  quiz: { question: string; options: string[]; correct_answer: string }[] | null
  formatted_markdown: string | null
}
