import { Check } from 'lucide-react'
import { MdLinkButton } from '../md-button'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Everything you need to get organized and start studying smarter.',
    features: [
      'Task manager & timetable',
      'Deadline tracking',
      'Pomodoro focus timer',
      'Up to 20 AI notes / month',
      'Basic analytics',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$8',
    period: 'per month',
    desc: 'Unlimited AI and advanced insights for serious academic performance.',
    features: [
      'Everything in Free',
      'Unlimited AI notes & flashcards',
      'AI quizzes & revision plans',
      'Crunch Study Helper',
      'Advanced analytics & goals',
      'Priority support',
    ],
    cta: 'Start Pro Trial',
    highlighted: true,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          Pricing
        </p>
        <h2 className="mt-3 text-balance text-3xl font-normal tracking-tight text-on-background sm:text-4xl">
          Simple pricing that grows with you
        </h2>
        <p className="mt-4 text-pretty text-on-surface-variant">
          Start free. Upgrade when you&apos;re ready for unlimited AI.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-2">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`flex flex-col rounded-[1.75rem] p-8 ${
              p.highlighted
                ? 'bg-primary text-on-primary md-elevation-3'
                : 'border border-outline-variant/60 bg-surface-container text-on-surface'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{p.name}</h3>
              {p.highlighted && (
                <span className="rounded-full bg-on-primary/15 px-3 py-1 text-xs font-medium">
                  Most popular
                </span>
              )}
            </div>

            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-4xl font-normal">{p.price}</span>
              <span
                className={
                  p.highlighted
                    ? 'text-sm text-on-primary/80'
                    : 'text-sm text-on-surface-variant'
                }
              >
                {p.period}
              </span>
            </div>

            <p
              className={`mt-3 text-sm leading-relaxed ${
                p.highlighted ? 'text-on-primary/90' : 'text-on-surface-variant'
              }`}
            >
              {p.desc}
            </p>

            <ul className="mt-6 flex-1 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <Check
                    className={`h-4 w-4 shrink-0 ${
                      p.highlighted ? 'text-on-primary' : 'text-primary'
                    }`}
                  />
                  <span
                    className={
                      p.highlighted ? 'text-on-primary/90' : 'text-on-surface'
                    }
                  >
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <MdLinkButton
                href="/signup"
                variant={p.highlighted ? 'tonal' : 'filled'}
                size="lg"
                className="w-full"
              >
                {p.cta}
              </MdLinkButton>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
