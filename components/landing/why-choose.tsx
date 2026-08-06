import {
  ShieldCheck,
  LayoutDashboard,
  Smartphone,
  Sparkles,
  Target,
} from 'lucide-react'

const reasons = [
  {
    icon: LayoutDashboard,
    title: 'Everything in one dashboard',
    desc: 'Tasks, timetable, notes and analytics — no more scattered apps.',
  },
  {
    icon: Sparkles,
    title: 'AI-powered assistance',
    desc: 'Generate study materials and plans tailored to your courses.',
  },
  {
    icon: Target,
    title: 'Personalized insights',
    desc: 'Understand your habits and get recommendations that fit you.',
  },
  {
    icon: Smartphone,
    title: 'Responsive design',
    desc: 'A polished experience across phone, tablet and desktop.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure cloud storage',
    desc: 'Your notes and data are encrypted and synced everywhere.',
  },
]

export function WhyChoose() {
  return (
    <section className="border-y border-outline-variant/60 bg-surface-container-low">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Why StudySync
          </p>
          <h2 className="mt-3 text-balance text-3xl font-normal tracking-tight text-on-background sm:text-4xl">
            Built for how students actually work
          </h2>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {reasons.map((r, i) => (
            <div
              key={r.title}
              className={`flex gap-4 rounded-3xl bg-surface-container p-6 ${
                i === 0 ? 'md:col-span-2' : ''
              }`}
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-secondary-container text-on-secondary-container">
                <r.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base font-medium text-on-surface">
                  {r.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-on-surface-variant">
                  {r.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
