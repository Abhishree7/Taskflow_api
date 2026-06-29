import clsx from 'clsx'
import type { TaskPriority, TaskStatus } from '../types'

const statusStyles: Record<TaskStatus, string> = {
  todo: 'bg-slate-700/60 text-slate-300 border border-slate-600',
  in_progress: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40',
  done: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
}

const statusLabels: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
}

const priorityStyles: Record<TaskPriority, string> = {
  low: 'bg-sky-500/15 text-sky-400 border border-sky-500/30',
  medium: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  high: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', statusStyles[status])}>
      {statusLabels[status]}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize', priorityStyles[priority])}>
      {priority}
    </span>
  )
}
