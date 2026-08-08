'use client'

import { useState } from 'react'
import {
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'

export default function NotesPage() {
  const [topicInput, setTopicInput] = useState(
    'Thermodynamics First & Second Law, Heat Engines, Entropy and Enthalpy'
  )
  const [isGenerating, setIsGenerating] = useState(false)
  const [generated, setGenerated] = useState(true)

  // Flashcards state
  const [currentCardIdx, setCurrentCardIdx] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const flashcards = [
    {
      q: 'What is the First Law of Thermodynamics?',
      a: 'Energy cannot be created or destroyed, only transformed from one form to another (ΔU = Q - W).',
    },
    {
      q: 'What is Entropy (S)?',
      a: 'A measure of the degree of randomness or disorder in a thermodynamic system. Second Law states ΔS_total ≥ 0.',
    },
    {
      q: 'What is Carnot Efficiency formula?',
      a: 'Efficiency η = 1 - (T_cold / T_hot), measured in Kelvin absolute temperature.',
    },
    {
      q: 'Difference between Isothermal and Adiabatic processes?',
      a: 'Isothermal occurs at constant temperature (ΔT = 0). Adiabatic occurs with no heat transfer (Q = 0).',
    },
  ]

  // Quiz state
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!topicInput.trim()) return
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setGenerated(true)
    }, 1200)
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface">
              AI Notes & Flashcards Studio
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
              Generate structured notes, interactive flashcards, and quizzes from any topic.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-tertiary-container px-4 py-1.5 text-xs font-bold text-on-tertiary-container">
            <Sparkles className="h-4 w-4 text-tertiary" /> Pro AI Engine Active
          </div>
        </div>

        {/* AI Input Form Card */}
        <div className="rounded-3xl border border-primary/30 bg-surface-container p-6 md-elevation-1">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                Enter Syllabus Topic, Lecture Transcript, or Exam Concept
              </label>
              <textarea
                rows={3}
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="Paste your raw text, PDF chapter summary, or study topic..."
                className="w-full rounded-2xl border border-outline bg-surface-lowest p-4 text-xs sm:text-sm text-on-surface outline-none focus:border-primary transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                <span className="rounded-full bg-surface-variant px-2.5 py-0.5 text-[10px] font-bold">
                  Auto-Summarize
                </span>
                <span className="rounded-full bg-surface-variant px-2.5 py-0.5 text-[10px] font-bold">
                  Generate 4 Flashcards
                </span>
                <span className="rounded-full bg-surface-variant px-2.5 py-0.5 text-[10px] font-bold">
                  Create Practice Quiz
                </span>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="md-state inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-on-primary md-elevation-1 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                {isGenerating ? 'Synthesizing AI Notes...' : 'Generate Notes & Cards'}
              </button>
            </div>
          </form>
        </div>

        {/* Results Area */}
        {generated && (
          <div className="grid lg:grid-cols-2 gap-6 animate-fade-in">
            {/* Left: AI Generated Notes */}
            <div className="rounded-3xl border border-outline-variant/60 bg-surface-container p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
                <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" /> Generated Notes Summary
                </h2>
                <span className="text-[10px] font-bold text-primary bg-primary-container px-2.5 py-0.5 rounded-full">
                  AI Output
                </span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-on-surface">
                <div className="rounded-2xl bg-surface-lowest p-4 border border-outline-variant/30">
                  <h3 className="font-bold text-primary mb-1">Key Concept Overview</h3>
                  <p className="text-on-surface-variant text-xs">
                    Thermodynamics governs heat, work, and energy transformations. The First Law states energy conservation, while the Second Law introduces entropy as the directional arrow of natural processes.
                  </p>
                </div>

                <div className="rounded-2xl bg-surface-lowest p-4 border border-outline-variant/30 space-y-1.5">
                  <h3 className="font-bold text-secondary mb-1">Core Equations to Memorize</h3>
                  <p className="text-xs font-mono bg-surface-container-high p-2 rounded-lg text-on-surface">
                    • 1st Law: ΔU = Q - W
                  </p>
                  <p className="text-xs font-mono bg-surface-container-high p-2 rounded-lg text-on-surface">
                    • Entropy: ΔS = ∫ dQ_rev / T
                  </p>
                  <p className="text-xs font-mono bg-surface-container-high p-2 rounded-lg text-on-surface">
                    • Carnot Efficiency: η = 1 - (T_C / T_H)
                  </p>
                </div>
              </div>
            </div>

            {/* Right: AI Flashcards & Quiz Studio */}
            <div className="space-y-6">
              {/* Flashcard Flipper Card */}
              <div className="rounded-3xl border border-outline-variant/60 bg-surface-container p-6 text-center space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
                    <Brain className="h-5 w-5 text-secondary" /> AI Interactive Flashcards
                  </h2>
                  <span className="text-xs font-bold text-on-surface-variant">
                    Card {currentCardIdx + 1} of {flashcards.length}
                  </span>
                </div>

                {/* 3D Flip Card Container */}
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="perspective-1000 w-full h-44 cursor-pointer my-2"
                >
                  <div
                    className={`relative w-full h-full rounded-2xl p-6 transition-transform duration-500 transform-style-3d border border-secondary/30 flex flex-col items-center justify-center shadow-md ${
                      isFlipped
                        ? 'rotate-y-180 bg-secondary-container text-on-secondary-container'
                        : 'bg-surface-lowest text-on-surface'
                    }`}
                  >
                    {!isFlipped ? (
                      <div>
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                          Question (Click card to flip)
                        </span>
                        <p className="text-sm font-bold mt-3 text-pretty">
                          {flashcards[currentCardIdx].q}
                        </p>
                      </div>
                    ) : (
                      <div className="rotate-y-180">
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                          Answer Explanation
                        </span>
                        <p className="text-sm font-semibold mt-3 leading-relaxed text-pretty">
                          {flashcards[currentCardIdx].a}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => {
                      setIsFlipped(false)
                      setCurrentCardIdx((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1))
                    }}
                    className="md-state p-2 rounded-full bg-surface-container-high text-on-surface"
                    aria-label="Previous card"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Flip Card 🔄
                  </button>

                  <button
                    onClick={() => {
                      setIsFlipped(false)
                      setCurrentCardIdx((prev) => (prev < flashcards.length - 1 ? prev + 1 : 0))
                    }}
                    className="md-state p-2 rounded-full bg-surface-container-high text-on-surface"
                    aria-label="Next card"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Practice Quiz Widget */}
              <div className="rounded-3xl border border-outline-variant/60 bg-surface-container p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-tertiary" />
                  <h2 className="text-base font-bold text-on-surface">AI Quick Quiz Tester</h2>
                </div>
                <p className="text-xs font-semibold text-on-surface">
                  Q: Which law implies that absolute zero temperature (-273.15°C) cannot be reached in a finite number of steps?
                </p>

                <div className="space-y-2 pt-2">
                  {[
                    'First Law of Thermodynamics',
                    'Second Law of Thermodynamics',
                    'Third Law of Thermodynamics (Correct)',
                    'Zeroth Law of Thermodynamics',
                  ].map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedOption(idx)}
                      className={`w-full text-left p-3 rounded-xl text-xs font-medium border transition-all ${
                        selectedOption === idx
                          ? idx === 2
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                            : 'bg-error-container border-error text-on-error-container'
                          : 'bg-surface-lowest border-outline-variant/40 text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
