'use client'

import { useState, useEffect } from 'react'
import {
  CheckCircle2,
  Circle,
  Filter,
  Plus,
  Search,
  Sparkles,
  Tag,
  Trash2,
} from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api'

type Task = {
  id: number
  title: string
  subject: string
  priority: 'High' | 'Medium' | 'Low'
  dueDate: string
  done: boolean
}

// Fallback data shown while backend is loading or if user is not logged in
const FALLBACK_TASKS: Task[] = [
  {
    id: 1,
    title: 'Finish Calculus problem set #5',
    subject: 'Math',
    priority: 'High',
    dueDate: 'Today',
    done: true,
  },
  {
    id: 2,
    title: 'Read Biology Chapter 7 & 8',
    subject: 'Bio',
    priority: 'Medium',
    dueDate: 'Tomorrow',
    done: true,
  },
  {
    id: 3,
    title: 'Draft History essay outline on Industrial Revolution',
    subject: 'History',
    priority: 'High',
    dueDate: 'Aug 10',
    done: false,
  },
  {
    id: 4,
    title: 'Implement Binary Search Tree in C++',
    subject: 'CS',
    priority: 'High',
    dueDate: 'Aug 12',
    done: false,
  },
  {
    id: 5,
    title: 'Spanish Vocabulary Deck Review',
    subject: 'Languages',
    priority: 'Low',
    dueDate: 'Aug 14',
    done: false,
  },
]

/** Map backend task shape to frontend shape */
function mapTask(t: any): Task {
  return {
    id: t.id,
    title: t.title,
    subject: t.subject || '',
    priority: (t.priority === 'high' ? 'High' : t.priority === 'medium' ? 'Medium' : 'Low') as Task['priority'],
    dueDate: t.due_date
      ? new Date(t.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : 'No date',
    done: t.completed,
  }
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loaded, setLoaded] = useState(false)

  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newSubject, setNewSubject] = useState('Math')
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('High')
  const [newDueDate, setNewDueDate] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch tasks from the backend on mount
  useEffect(() => {
    apiGet<{ tasks: any[] }>('/api/tasks')
      .then((data) => {
        if (data.tasks) {
          setTasks(data.tasks.map(mapTask))
        }
        setLoaded(true)
      })
      .catch(() => {
        // Not logged in or backend down
        setLoaded(true)
      })
  }, [])

  const toggleTask = async (id: number) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    )

    // Sync with backend
    try {
      await apiPut(`/api/tasks/${id}`, { completed: !task.done })
    } catch {
      // Revert on failure
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: task.done } : t))
      )
    }
  }

  const deleteTask = async (id: number) => {
    const prev = tasks
    setTasks((t) => t.filter((x) => x.id !== id))

    try {
      await apiDelete(`/api/tasks/${id}`)
    } catch {
      setTasks(prev)
    }
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    // Optimistic local add
    const tempTask: Task = {
      id: Date.now(),
      title: newTitle,
      subject: newSubject,
      priority: newPriority,
      dueDate: 'This Week',
      done: false,
    }
    setTasks([tempTask, ...tasks])
    setNewTitle('')
    setNewDueDate('')
    setIsModalOpen(false)

    // Persist to backend
    try {
      const data = await apiPost<{ task: any }>('/api/tasks', {
        title: newTitle,
        subject: newSubject,
        priority: newPriority.toLowerCase(),
        due_date: newDueDate ? new Date(newDueDate).toISOString() : null,
      })
      // Replace temp task with real one from backend
      setTasks((prev) =>
        prev.map((t) => (t.id === tempTask.id ? mapTask(data.task) : t))
      )
    } catch {
      // Keep local task even if backend fails
    }
  }

  const filteredTasks = tasks.filter((t) => {
    const matchesFilter =
      activeFilter === 'All' ||
      (activeFilter === 'High Priority' && t.priority === 'High') ||
      t.subject === activeFilter
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const completedCount = tasks.filter((t) => t.done).length

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface">
              Smart Task Management
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
              Organize assignments, coursework, and daily study goals.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="md-state inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-on-primary md-elevation-1 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" /> Add New Task
          </button>
        </div>

        {/* Progress Bar Header */}
        <div className="rounded-2xl border border-outline-variant/60 bg-surface-container p-4">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-on-surface">Overall Completion Rate</span>
            <span className="text-primary">{completedCount} of {tasks.length} completed ({tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0}%)</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-variant overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Filter Chips & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {['All', 'High Priority', 'Math', 'CS', 'Bio', 'History', 'Languages'].map(
              (filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`md-state shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    activeFilter === filter
                      ? 'bg-primary text-on-primary md-elevation-1'
                      : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {filter}
                </button>
              )
            )}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-3 text-xs rounded-full bg-surface-container border border-outline-variant/60 focus:border-primary outline-none text-on-surface"
            />
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.map((t) => (
            <div
              key={t.id}
              className="md-state flex items-center justify-between rounded-2xl border border-outline-variant/60 bg-surface-container p-4 transition-all hover:md-elevation-1"
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-4">
                <button
                  onClick={() => toggleTask(t.id)}
                  aria-label="Toggle completed"
                  className="shrink-0"
                >
                  {t.done ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 text-outline" />
                  )}
                </button>
                <span
                  className={`text-sm font-medium truncate ${
                    t.done
                      ? 'line-through text-on-surface-variant opacity-60'
                      : 'text-on-surface'
                  }`}
                >
                  {t.title}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    t.priority === 'High'
                      ? 'bg-error-container text-on-error-container'
                      : t.priority === 'Medium'
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'bg-surface-variant text-on-surface-variant'
                  }`}
                >
                  {t.priority}
                </span>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-surface-variant text-on-surface-variant text-[10px] font-bold">
                  {t.subject}
                </span>
                {t.dueDate && t.dueDate !== 'No date' && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-outline-variant/60 text-on-surface-variant text-[10px] font-bold">
                    📅 {t.dueDate}
                  </span>
                )}
                <button
                  onClick={() => deleteTask(t.id)}
                  className="p-1.5 text-on-surface-variant hover:text-error rounded-full transition-colors"
                  aria-label="Delete task"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {filteredTasks.length === 0 && (
            <div className="text-center py-12 text-on-surface-variant text-xs">
              No tasks match your active filter.
            </div>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl border border-outline-variant/60 bg-surface-container-high p-6 md-elevation-4 animate-slide-up">
            <h2 className="text-lg font-bold text-on-surface mb-4">Add New Task</h2>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Complete Chemistry Lab Worksheet"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-outline bg-surface-lowest text-xs text-on-surface outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    Subject
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-outline bg-surface-lowest text-xs text-on-surface outline-none focus:border-primary"
                  >
                    <option value="Math">Math</option>
                    <option value="CS">Computer Science</option>
                    <option value="Bio">Biology</option>
                    <option value="History">History</option>
                    <option value="Languages">Languages</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full h-11 px-3 rounded-xl border border-outline bg-surface-lowest text-xs text-on-surface outline-none focus:border-primary"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-outline bg-surface-lowest text-xs text-on-surface outline-none focus:border-primary"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-on-surface-variant rounded-full hover:bg-surface-variant"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-primary text-on-primary rounded-full md-elevation-1"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  )
}
