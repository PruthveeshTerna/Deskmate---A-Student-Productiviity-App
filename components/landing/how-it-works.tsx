import { ClipboardList, LineChart, Rocket, BookOpen } from 'lucide-react'

const steps = [
  {
    icon: ClipboardList,
    title: 'Plan',
    desc: 'Add your tasks, timetable and exam dates to build your workspace.',
  },
  {
    icon: BookOpen,
    title: 'Study',
    desc: 'Use AI notes, flashcards and focus timers to work through material.',
  },
  {
    icon: LineChart,
    title: 'Analyze',
    desc: 'Review analytics to see where your time and focus really go.',
  },
  {
    icon: Rocket,
    title: 'Improve',
    desc: 'Get personalized recommendations to close gaps before exams.',
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-y border-outline-variant/60 bg-surface-container-low"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            How it works
          </p>
          <h2 className="mt-3 text-balance text-3xl font-normal tracking-tight text-on-background sm:text-4xl">
            Plan. Study. Analyze. Improve.
          </h2>
        </div>

        <ol className="mt-12 grid gap-4 md:grid-cols-4">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="relative rounded-3xl bg-surface-container p-6"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-on-primary">
                <s.icon className="h-6 w-6" />
              </span>
              <span className="absolute right-6 top-6 text-sm font-medium text-outline">
                0{i + 1}
              </span>
              <h3 className="mt-5 text-lg font-medium text-on-surface">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                {s.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
