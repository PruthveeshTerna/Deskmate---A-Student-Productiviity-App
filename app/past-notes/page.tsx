'use client'

import { useState, useEffect } from 'react'
import { BookOpen, History, FileText, Printer, Trash2 } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { MarkdownViewer } from '@/components/markdown-viewer'
import { apiGet, apiDelete } from '@/lib/api'

export default function PastNotesPage() {
  const [historyNotes, setHistoryNotes] = useState<any[]>([])
  const [selectedNote, setSelectedNote] = useState<any | null>(null)

  const fetchHistory = () => {
    apiGet<{ notes: any[] }>('/api/notes')
      .then((data) => {
        if (data.notes) setHistoryNotes(data.notes)
      })
      .catch(() => {})
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const loadHistoryNote = (note: any) => {
    setSelectedNote(note)
  }

  const handleDeleteNote = async (e: React.MouseEvent, noteId: number) => {
    e.stopPropagation()
    if (!confirm('Are you sure you want to delete this note?')) return

    try {
      await apiDelete(`/api/notes/${noteId}`)
      setHistoryNotes(prev => prev.filter(n => n.id !== noteId))
      if (selectedNote?.id === noteId) {
        setSelectedNote(null)
      }
    } catch (err) {
      console.error('Failed to delete note:', err)
      alert('Failed to delete note.')
    }
  }

  return (
    <AppShell>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* History Sidebar */}
        <div className="lg:w-80 shrink-0 sidebar-history print:hidden">
          <div className="rounded-3xl border border-outline-variant/60 bg-surface-container p-4 h-full min-h-[500px]">
            <h2 className="text-sm font-bold text-on-surface flex items-center gap-2 mb-4">
              <History className="h-4 w-4 text-primary" /> Past AI Notes
            </h2>
            <div className="space-y-2 overflow-y-auto max-h-[75vh] no-scrollbar">
              {historyNotes.length > 0 ? (
                historyNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => loadHistoryNote(note)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all group cursor-pointer relative ${
                      selectedNote?.id === note.id
                        ? 'bg-primary-container border-primary text-on-primary-container'
                        : 'bg-surface-lowest border-outline-variant/40 hover:bg-surface-container-high hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-3">
                        <FileText className={`h-4 w-4 shrink-0 ${selectedNote?.id === note.id ? 'text-primary' : 'text-secondary group-hover:text-primary transition-colors'}`} />
                        <span className="text-sm font-bold truncate pr-6">
                          {note.title || 'Untitled Note'}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteNote(e, note.id)}
                        className={`absolute right-4 p-1.5 rounded-full transition-colors ${selectedNote?.id === note.id ? 'text-on-primary-container hover:bg-on-primary-container/10' : 'text-on-surface-variant opacity-0 group-hover:opacity-100 hover:text-error hover:bg-error-container/20'}`}
                        title="Delete Note"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-[11px] font-medium pl-7 truncate opacity-80">
                      {note.subject || 'AI Generated'} • {new Date(note.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-on-surface-variant text-center py-4">
                  No past notes found.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-6 print-content">
          {selectedNote ? (
            <div className="animate-fade-in space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface">
                    {selectedNote.title || 'Past AI Note'}
                  </h1>
                  <p className="text-xs sm:text-sm text-on-surface-variant mt-1 no-print">
                    {selectedNote.subject || 'Generated Note'}
                  </p>
                </div>
                <div className="flex items-center gap-2 no-print">
                  <button
                    onClick={() => window.print()}
                    className="md-state flex items-center gap-2 rounded-full border border-outline-variant bg-surface-lowest px-4 py-1.5 text-xs font-bold text-on-surface hover:border-primary transition-colors"
                  >
                    <Printer className="h-4 w-4 text-secondary" /> Download PDF
                  </button>
                </div>
              </div>

              {/* Note Content Viewer */}
              <div className="rounded-3xl border border-outline-variant/60 bg-surface-container p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
                  <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" /> Note Document
                  </h2>
                  <span className="text-[10px] font-bold text-primary bg-primary-container px-2.5 py-0.5 rounded-full">
                    {new Date(selectedNote.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-on-surface">
                  <div className="rounded-2xl bg-surface-lowest p-6 border border-outline-variant/30 min-h-[400px] overflow-hidden">
                    <MarkdownViewer content={selectedNote.content} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8 rounded-3xl border border-dashed border-outline-variant/60 bg-surface-variant/20 no-print">
              <History className="h-16 w-16 text-on-surface-variant/40 mb-4" />
              <h2 className="text-xl font-bold text-on-surface mb-2">Select a Past Note</h2>
              <p className="text-sm text-on-surface-variant max-w-sm">
                Choose a note from the sidebar to view its contents and download it as a PDF.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
