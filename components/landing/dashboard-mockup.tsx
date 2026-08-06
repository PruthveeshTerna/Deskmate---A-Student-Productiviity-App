import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

const tasks = [
  { label: 'Finish Calculus problem set', done: true },
  { label: 'Read Chapter 7 — Biology', done: true },
  { label: 'Draft History essay outline', done: false },
  { label: 'Review Spanish flashcards', done: false },
]

const bars = [40, 65, 55, 80, 72, 90, 60]
const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export function DashboardMockup() {
  return (
    <div className="rounded-[1.75rem] border border-outline-variant/60 bg-surface-container p-3 md-elevation-3 sm:p-4">
      {/* window chrome */}
      <div className="mb-3 flex items-center gap-1.5 px-1">
        <span className="h-2.5 w-2.5 rounded-full bg-tertiary/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-secondary/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
        <span className="ml-3 text-xs text-on-surface-variant">
          StudySync · Dashboard
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Task manager */}
        <div className="col-span-2 rounded-2xl bg-surface-lowest p-4 sm:col-span-1">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-on-surface">Today’s Tasks</h3>
            <span className="rounded-full bg-primary-container px-2 py-0.5 text-xs font-medium text-on-primary-container">
              2/4
            </span>
          </div>
          <ul className="space-y-2.5">
            {tasks.map((t) => (
              <li key={t.label} className="flex items-center gap-2.5">
                {t.done ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-outline" />
                )}
                <span
                  className={`text-xs ${
                    t.done
                      ? 'text-on-surface-variant line-through'
                      : 'text-on-surface'
                  }`}
                >
                  {t.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Analytics */}
        <div className="col-span-2 rounded-2xl bg-surface-lowest p-4 sm:col-span-1">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-on-surface">
              Weekly Focus
            </h3>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div className="flex items-end justify-between gap-1.5">
            {bars.map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="flex h-20 w-full items-end">
                  <div
                    className="w-full rounded-t-md bg-primary/80"
                    style={{ height: `${h}%` }}
                  />
                </div>
                <span className="text-[10px] text-on-surface-variant">
                  {days[i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pomodoro */}
        <div className="flex items-center gap-3 rounded-2xl bg-tertiary-container p-4 text-on-tertiary-container">
          <div className="grid h-12 w-12 place-items-center rounded-full border-2 border-on-tertiary-container/40">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-medium leading-none">24:59</p>
            <p className="text-xs opacity-80">Focus session</p>
          </div>
        </div>

        {/* Deadlines */}
        <div className="rounded-2xl bg-surface-lowest p-4">
          <div className="mb-2 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-secondary" />
            <h3 className="text-sm font-medium text-on-surface">Deadlines</h3>
          </div>
          <p className="text-xs text-on-surface">Physics Lab Report</p>
          <p className="text-xs text-on-surface-variant">Due in 2 days</p>
        </div>

        {/* AI panel */}
        <div className="col-span-2 rounded-2xl border border-primary/30 bg-primary-container/50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium text-on-primary-container">
              Crunch Study Helper
            </h3>
          </div>
          <p className="text-xs leading-relaxed text-on-primary-container/90">
            Exam in 3 days. I’ve built a focused revision plan and generated 18
            flashcards for your weakest topics — thermodynamics and kinematics.
          </p>
        </div>
      </div>
    </div>
  )
}
