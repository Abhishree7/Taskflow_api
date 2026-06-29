import { useState } from 'react'
import type { Task, TaskCreate, TaskPriority, TaskStatus } from '../types'

interface Props {
  initial?: Partial<Task>
  onSubmit: (data: TaskCreate) => void
  loading?: boolean
}

export function TaskForm({ initial, onSubmit, loading }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [status, setStatus] = useState<TaskStatus>(initial?.status ?? 'todo')
  const [priority, setPriority] = useState<TaskPriority>(initial?.priority ?? 'medium')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({ title: title.trim(), description: description.trim() || undefined, status, priority })
  }

  const inputCls = 'w-full bg-[#0f0f13] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/30 transition-colors'
  const selectCls = inputCls + ' cursor-pointer'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">Title *</label>
        <input
          className={inputCls}
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
        <textarea
          className={inputCls + ' resize-none h-20'}
          placeholder="Optional details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Status</label>
          <select className={selectCls} value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Priority</label>
          <select className={selectCls} value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
        >
          {loading ? 'Saving…' : initial ? 'Save Changes' : 'Create Task'}
        </button>
      </div>
    </form>
  )
}
