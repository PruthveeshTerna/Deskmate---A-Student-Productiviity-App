import { Star } from 'lucide-react'

const testimonials = [
  {
    quote:
      'DeskMate replaced four different apps for me. The AI notes alone saved me hours every week before finals.',
    name: 'Aisha Kapoor',
    role: 'Pre-med, Year 2',
    initials: 'AK',
  },
  {
    quote:
      'The Crunch Study Helper is unreal. I was behind in physics and it built a plan that actually got me through the exam.',
    name: 'Marcus Lee',
    role: 'Engineering, Year 3',
    initials: 'ML',
  },
  {
    quote:
      'I finally understand where my time goes. The analytics keep me honest and the streaks keep me going.',
    name: 'Sofia Alvarez',
    role: 'Law, Year 1',
    initials: 'SA',
  },
]

export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          Loved by students
        </p>
        <h2 className="mt-3 text-balance text-3xl font-normal tracking-tight text-on-background sm:text-4xl">
          Trusted at 500+ campuses
        </h2>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure
            key={t.name}
            className="flex flex-col rounded-3xl border border-outline-variant/60 bg-surface-container p-6"
          >
            <div className="flex gap-0.5 text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <blockquote className="mt-4 flex-1 text-pretty text-sm leading-relaxed text-on-surface">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-tertiary-container text-sm font-medium text-on-tertiary-container">
                {t.initials}
              </span>
              <div>
                <p className="text-sm font-medium text-on-surface">{t.name}</p>
                <p className="text-xs text-on-surface-variant">{t.role}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
