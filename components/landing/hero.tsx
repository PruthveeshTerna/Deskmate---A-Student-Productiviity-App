import { PlayCircle, Sparkles } from 'lucide-react'
import { MdLinkButton } from '../md-button'
import { DashboardMockup } from './dashboard-mockup'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* soft M3 tonal backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-gradient-to-b from-primary-container/40 to-transparent"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.05fr_1fr]">
        <div className="flex flex-col items-start">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary-container px-4 py-1.5 text-sm font-medium text-on-secondary-container">
            <Sparkles className="h-4 w-4" />
            AI-powered student workspace
          </span>

          <h1 className="mt-6 text-balance text-4xl font-normal leading-[1.1] tracking-tight text-on-background sm:text-5xl md:text-6xl">
            Your Complete Academic Workspace,{' '}
            <span className="text-primary">Powered by AI.</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-on-surface-variant sm:text-lg">
            Manage tasks, schedules, notes, deadlines and exams while leveraging
            AI to generate notes, flashcards, quizzes and personalized study
            plans — all from a single platform.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <MdLinkButton href="/signup" variant="filled" size="lg">
              Get Started
            </MdLinkButton>
            <MdLinkButton href="#how-it-works" variant="outlined" size="lg">
              <PlayCircle className="h-5 w-5" />
              Watch Demo
            </MdLinkButton>
          </div>

          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            {[
              ['50k+', 'Students'],
              ['1.2M', 'Notes generated'],
              ['4.9/5', 'Avg. rating'],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="text-2xl font-medium text-on-background">{n}</dt>
                <dd className="text-sm text-on-surface-variant">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div
            aria-hidden
            className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-tr from-primary/10 via-secondary/10 to-tertiary/10 blur-2xl"
          />
          <DashboardMockup />
        </div>
      </div>
    </section>
  )
}
