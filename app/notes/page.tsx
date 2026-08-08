'use client'

import { useState, useEffect } from 'react'
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
  Printer,
  History,
  FileText
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { MarkdownViewer } from '@/components/markdown-viewer'
import { apiPost, apiGet } from '@/lib/api'

export default function NotesPage() {
  const [topicInput, setTopicInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  useEffect(() => {
    // Left intentional blank, could load initial data if needed
  }, [])

  // Flashcards state
  const [currentCardIdx, setCurrentCardIdx] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const [flashcards, setFlashcards] = useState([
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
  ])

  // Notes summary state
  const [notesSummary, setNotesSummary] = useState<string | null>(null)

  // Quiz state
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [quizQuestion, setQuizQuestion] = useState(
    'Which law implies that absolute zero temperature (-273.15°C) cannot be reached in a finite number of steps?'
  )
  const [quizOptions, setQuizOptions] = useState([
    'First Law of Thermodynamics',
    'Second Law of Thermodynamics',
    'Third Law of Thermodynamics (Correct)',
    'Zeroth Law of Thermodynamics',
  ])
  const [correctIdx, setCorrectIdx] = useState(2)

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topicInput.trim()) return
    setIsGenerating(true)
    setGenerated(false)
    setErrorMsg('')

    try {
      const data = await apiPost<{
        structured_notes: string | null
        summary: string | null
        flashcards: { question: string; answer: string }[] | null
        quiz: { question: string; options: string[]; correct_answer: string }[] | null
        formatted_markdown: string | null
      }>('/api/ai-notes/generate', { topic: topicInput, content: topicInput })

      // Update flashcards if AI returned them
      if (data.flashcards && data.flashcards.length > 0) {
        setFlashcards(data.flashcards.map((fc) => ({ 
          q: (fc as any).q || fc.question || 'No question available', 
          a: (fc as any).a || fc.answer || 'No answer available' 
        })))
        setCurrentCardIdx(0)
        setIsFlipped(false)
      }

      // Update quiz if AI returned it
      if (data.quiz && data.quiz.length > 0) {
        const q = data.quiz[0]
        setQuizQuestion(q.question || (q as any).q || 'No question available')
        setQuizOptions(q.options || [])
        
        let cIdx = 0
        if ('correct_index' in q && typeof q.correct_index === 'number') {
          cIdx = q.correct_index
        } else if ('correct_answer' in q) {
          cIdx = (q.options || []).findIndex((o: string) => o === (q as any).correct_answer)
        }
        
        setCorrectIdx(cIdx >= 0 ? cIdx : 0)
        setSelectedOption(null)
      }

      // Update notes summary
      const summaryData = data.formatted_markdown || data.summary || data.structured_notes
      if (summaryData) {
        if (typeof summaryData === 'string') {
          setNotesSummary(summaryData)
        } else if (typeof summaryData === 'object') {
          const obj = summaryData as any
          setNotesSummary(obj.overall_summary || JSON.stringify(obj, null, 2))
        }
      }

      setGenerated(true)
    } catch (err: any) {
      setErrorMsg(err.message || 'AI generation failed. Ensure your AI API keys are configured in the backend.')
      setGenerated(false)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <AppShell>
      <div className="flex-1 space-y-6 print-content max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface">
                AI Notes & Flashcards Studio
              </h1>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-1 no-print">
                Generate structured notes, interactive flashcards, and quizzes from any topic.
              </p>
            </div>
            <div className="flex items-center gap-2 no-print">
              {generated && (
                <button
                  onClick={() => window.print()}
                  className="md-state flex items-center gap-2 rounded-full border border-outline-variant bg-surface-lowest px-4 py-1.5 text-xs font-bold text-on-surface"
                >
                  <Printer className="h-4 w-4 text-secondary" /> Download PDF
                </button>
              )}
              <div className="flex items-center gap-2 rounded-full bg-tertiary-container px-4 py-1.5 text-xs font-bold text-on-tertiary-container">
                <Sparkles className="h-4 w-4 text-tertiary" /> Pro AI Engine
              </div>
            </div>
          </div>

          {/* AI Input Form Card */}
          <div className="rounded-3xl border border-primary/30 bg-surface-container p-6 md-elevation-1 no-print">
          <form onSubmit={handleGenerate} className="space-y-4">
            {errorMsg && (
              <div className="text-xs text-error bg-error-container/40 rounded-lg px-3 py-2 font-medium">
                {errorMsg}
              </div>
            )}
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
            <div className="grid lg:grid-cols-2 gap-6 animate-fade-in print-content">
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
                {notesSummary ? (
                  <div className="rounded-2xl bg-surface-lowest p-4 border border-outline-variant/30 overflow-hidden">
                    <MarkdownViewer content={notesSummary} />
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>

            {/* Right: AI Flashcards & Quiz Studio */}
            <div className="space-y-6 no-print">
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
                {flashcards.length > 0 ? (
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
                            {flashcards[currentCardIdx]?.q || (flashcards[currentCardIdx] as any)?.question || 'No question available'}
                          </p>
                        </div>
                      ) : (
                        <div className="rotate-y-180">
                          <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                            Answer Explanation
                          </span>
                          <p className="text-sm font-semibold mt-3 leading-relaxed text-pretty">
                            {flashcards[currentCardIdx]?.a || (flashcards[currentCardIdx] as any)?.answer || 'No answer available'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-44 rounded-2xl border border-dashed border-outline-variant flex flex-col items-center justify-center text-on-surface-variant p-4">
                    <Brain className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-xs font-medium text-center">Flashcards could not be generated. Please try again later.</p>
                  </div>
                )}

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
                {quizOptions.length > 0 ? (
                  <>
                    <p className="text-xs font-semibold text-on-surface">
                      Q: {quizQuestion}
                    </p>

                    <div className="space-y-2 pt-2">
                      {quizOptions.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedOption(idx)}
                          className={`w-full text-left p-3 rounded-xl text-xs font-medium border transition-all ${
                            selectedOption === idx
                              ? idx === correctIdx
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                                : 'bg-error-container border-error text-on-error-container'
                              : 'bg-surface-lowest border-outline-variant/60 hover:border-tertiary text-on-surface'
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}. {opt}
                        </button>
                      ))}
                    </div>

                    {selectedOption !== null && (
                      <div className={`mt-4 p-3 rounded-xl text-xs font-bold text-center ${
                        selectedOption === correctIdx 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                          : 'bg-error-container/50 text-error'
                      }`}>
                        {selectedOption === correctIdx ? '✨ Correct! Great job!' : '❌ Incorrect. Keep studying!'}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-32 rounded-2xl border border-dashed border-outline-variant flex flex-col items-center justify-center text-on-surface-variant p-4 mt-2">
                    <HelpCircle className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-xs font-medium text-center">Practice quiz could not be generated.</p>
                  </div>
                )}
              </div>
              </div>
            </div>
          )}
      </div>
    </AppShell>
  )
}
