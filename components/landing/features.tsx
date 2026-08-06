import {
  Bell,
  BrainCircuit,
  CalendarClock,
  Flame,
  LayoutGrid,
  LineChart,
  ListTodo,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Feature = {
  icon: LucideIcon
  title: string
  desc: string
  tone: 'primary' | 'secondary' | 'tertiary'
}

const features: Feature[] = [
  {
    icon: ListTodo,
    title: 'Smart Task Management',
    desc: 'Organize assignments with priorities, subtasks and drag-and-drop planning.',
    tone: 'primary',
  },
  {
    icon: CalendarClock,
    title: 'Timetable & Deadlines',
    desc: 'A weekly timetable and deadline tracker that keeps every due date in view.',
    tone: 'secondary',
  },
  {
    icon: BrainCircuit,
    title: 'AI Notes Generator',
    desc: 'Turn any syllabus or topic into clean, structured notes in seconds.',
    tone: 'tertiary',
  },
  {
    icon: LayoutGrid,
    title: 'AI Flashcards & Quizzes',
    desc: 'Auto-generate flashcards and quizzes to test yourself as you learn.',
    tone: 'primary',
  },
  {
    icon: Zap,
    title: 'Crunch Study Helper',
    desc: 'Behind on an exam? Get a focused, time-boxed plan to catch up fast.',
    tone: 'secondary',
  },
  {
    icon: LineChart,
    title: 'Productivity Analytics',
    desc: 'Understand your focus patterns with clear, actionable insights.',
    tone: 'tertiary',
  },
  {
    icon: Flame,
    title: 'Study Streaks & Goals',
    desc: 'Build momentum with streaks, goals and gentle accountability.',
    tone: 'primary',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    desc: 'Timely nudges for deadlines, sessions and revision — never intrusive.',
    tone: 'secondary',
  },
]

const toneMap = {
  primary: 'bg-primary-container text-on-primary-container',
  secondary: 'bg-secondary-container text-on-secondary-container',
  tertiary: 'bg-tertiary-container text-on-tertiary-container',
}

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          Features
        </p>
        <h2 className="mt-3 text-balance text-3xl font-normal tracking-tight text-on-background sm:text-4xl">
          Everything you need to study smarter
        </h2>
        <p className="mt-4 text-pretty text-on-surface-variant">
          One connected workspace that brings planning, studying and AI
          assistance together.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="group rounded-3xl border border-outline-variant/60 bg-surface-container p-6 transition-shadow hover:md-elevation-2"
          >
            <span
              className={`grid h-12 w-12 place-items-center rounded-2xl ${toneMap[f.tone]} transition-transform group-hover:scale-105`}
            >
              <f.icon className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-lg font-medium text-on-surface">
              {f.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
