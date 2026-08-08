import { FileText, GitBranch, Layers, ListChecks, RefreshCw } from 'lucide-react'

const capabilities = [
  {
    icon: FileText,
    title: 'Syllabus-based notes',
    desc: 'Paste a syllabus and get structured, exam-ready notes per topic.',
  },
  {
    icon: GitBranch,
    title: 'Workflows & diagrams',
    desc: 'Visualize complex processes with auto-generated diagrams.',
  },
  {
    icon: Layers,
    title: 'Flashcard generation',
    desc: 'Spaced-repetition flashcards created from your own material.',
  },
  {
    icon: ListChecks,
    title: 'Quiz generation',
    desc: 'Practice quizzes with instant feedback and explanations.',
  },
  {
    icon: RefreshCw,
    title: 'Personalized revision plans',
    desc: 'Adaptive plans that reprioritize as your exam approaches.',
  },
]

export function AiLearning() {
  return (
    <section id="ai" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            AI-Powered Learning
          </p>
          <h2 className="mt-3 text-balance text-3xl font-normal tracking-tight text-on-background sm:text-4xl">
            Let AI do the busywork, so you can focus on learning
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-on-surface-variant">
            DeskMate&apos;s AI turns your course material into everything you
            need to master it — from clean notes to adaptive revision plans that
            evolve with you.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {capabilities.map((c, i) => (
            <div
              key={c.title}
              className={`rounded-3xl border border-outline-variant/60 bg-surface-container p-6 ${
                i === capabilities.length - 1 ? 'sm:col-span-2' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-container text-on-primary-container">
                  <c.icon className="h-5 w-5" />
                </span>
                <h3 className="text-base font-medium text-on-surface">
                  {c.title}
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
                {c.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
