'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'Is DeskMate really free to use?',
    a: 'Yes. The Free plan includes task management, timetable, deadlines, the Pomodoro timer and a monthly allowance of AI notes — no credit card required.',
  },
  {
    q: 'How does the AI generate notes and flashcards?',
    a: 'You provide a syllabus, topic or your own material, and DeskMate structures it into clean notes, flashcards and quizzes. You can edit everything afterwards.',
  },
  {
    q: 'Can I use DeskMate on my phone?',
    a: 'Absolutely. DeskMate is fully responsive and works beautifully across phone, tablet and desktop, with your data synced in real time.',
  },
  {
    q: 'Is my data secure?',
    a: 'Your notes and personal data are encrypted in transit and at rest, and stored securely in the cloud. You stay in control of your information.',
  },
  {
    q: 'Can I cancel my Pro subscription anytime?',
    a: 'Yes. You can cancel at any time and keep Pro features until the end of your billing period, then continue on the Free plan.',
  },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section
      id="faq"
      className="border-t border-outline-variant/60 bg-surface-container-low"
    >
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            FAQ
          </p>
          <h2 className="mt-3 text-balance text-3xl font-normal tracking-tight text-on-background sm:text-4xl">
            Questions, answered
          </h2>
        </div>

        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <div
                key={f.q}
                className="overflow-hidden rounded-2xl border border-outline-variant/60 bg-surface-container"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="md-state flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-base font-medium text-on-surface">
                    {f.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-on-surface-variant transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm leading-relaxed text-on-surface-variant">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
