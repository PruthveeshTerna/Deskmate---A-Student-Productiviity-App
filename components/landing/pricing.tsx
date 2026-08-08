'use client'

import { useState } from 'react'
import { Check, Sparkles, Zap } from 'lucide-react'
import { MdLinkButton } from '../md-button'

export function Pricing() {
  const [annual, setAnnual] = useState(true)

  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-container px-4 py-1.5 text-xs font-bold text-on-primary-container">
          <Sparkles className="h-3.5 w-3.5" /> Simple, Student-Friendly Pricing
        </span>
        <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-on-background sm:text-4xl">
          Supercharge your study workflow today
        </h2>
        <p className="mt-3 text-pretty text-sm text-on-surface-variant sm:text-base">
          Start free forever. Upgrade anytime to unlock unlimited AI note generation and crunch mode.
        </p>

        {/* Toggle Billing Switch */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className={`text-xs font-semibold ${!annual ? 'text-on-surface' : 'text-on-surface-variant'}`}>
            Monthly Billing
          </span>
          <button
            type="button"
            onClick={() => setAnnual(!annual)}
            className={`relative h-7 w-13 rounded-full p-1 transition-colors ${
              annual ? 'bg-primary' : 'bg-surface-variant'
            }`}
            aria-label="Toggle annual billing"
          >
            <span
              className={`block h-5 w-5 rounded-full bg-white transition-transform ${
                annual ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-xs font-semibold flex items-center gap-1.5 ${annual ? 'text-on-surface' : 'text-on-surface-variant'}`}>
            Annual Billing
            <span className="rounded-full bg-tertiary-container px-2 py-0.5 text-[10px] font-bold text-on-tertiary-container">
              Save 25%
            </span>
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="mt-12 grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="rounded-3xl border border-outline-variant/60 bg-surface-container p-8 flex flex-col justify-between transition-all hover:md-elevation-2">
          <div>
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Student Starter
            </span>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-5xl font-extrabold text-on-surface">$0</span>
              <span className="text-sm font-medium text-on-surface-variant">/ forever</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-on-surface-variant">
              Essential workspace tools to organize your tasks, class schedules, and deadlines.
            </p>

            <hr className="my-6 border-outline-variant/40" />

            <ul className="space-y-3.5 text-xs text-on-surface">
              {[
                'Smart Task Manager with Kanban view',
                'Weekly Timetable & Exam Scheduler',
                'Pomodoro Focus Timer & Analytics',
                '5 AI Note Summaries per month',
                'Community support & mobile access',
              ].map((feat) => (
                <li key={feat} className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <MdLinkButton href="/signup" variant="outlined" size="lg" className="w-full">
              Get Started Free
            </MdLinkButton>
          </div>
        </div>

        {/* Pro Plan */}
        <div className="relative rounded-3xl border-2 border-primary bg-surface-container-high p-8 flex flex-col justify-between md-elevation-3 transition-all hover:scale-[1.02]">
          <div className="absolute -top-3.5 right-6 rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-on-primary md-elevation-1">
            ⚡ Most Popular
          </div>

          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              DeskMate Pro AI
            </span>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-5xl font-extrabold text-on-surface">
                {annual ? '$6' : '$8'}
              </span>
              <span className="text-sm font-medium text-on-surface-variant">/ month</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-on-surface-variant">
              Complete AI study power package for serious students aiming for top academic grades.
            </p>

            <hr className="my-6 border-outline-variant/40" />

            <ul className="space-y-3.5 text-xs text-on-surface">
              {[
                'Everything in Student Starter',
                'Unlimited AI Notes Generator',
                'Unlimited AI Flashcards & Quiz Studio',
                'AI Crunch Helper (72h Exam Roadmaps)',
                'Advanced Focus Analytics & Study Streaks',
                'Priority AI response speeds & sync',
              ].map((feat) => (
                <li key={feat} className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-medium">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <MdLinkButton href="/signup" variant="filled" size="lg" className="w-full">
              Start 14-Day Free Trial
            </MdLinkButton>
          </div>
        </div>
      </div>
    </section>
  )
}
