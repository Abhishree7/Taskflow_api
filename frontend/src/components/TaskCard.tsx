import { Pencil, Trash2, CheckCircle2, Circle, Clock } from 'lucide-react'
import type { Task } from '../types'
import { PriorityBadge, StatusBadge } from './Badge'

const statusIcon = {
  todo: <Circle size={14} className="text-slate-500" />,
  in_progress: <Clock size={14} className="text-indigo-400" />,
  done: <CheckCircle2 size={14} className="text-emerald-400" />,
}

interface Props {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onStatusCycle: (task: Task) => void
}

const nextStatus = { todo: 'in_progress', in_progress: 'done', done: 'todo' } as const

export function TaskCard({ task, onEdit, onDelete, onStatusCycle }: Props) {
  return (
    <div className="group relative bg-[#16161e] border border-white/7 hover:border-white/12 rounded-xl p-4 transition-all duration-200 hover:shadow-lg hover:shadow-black/30">
      <div className="flex items-start gap-3">
        <button
          onClick={() => onStatusCycle(task)}
          className="mt-0.5 shrink-0 hover:scale-110 transition-transform"
          title={`Mark as ${nextStatus[task.status]}`}
        >
          {statusIcon[task.status]}
        </button>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${task.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-100'}`}>
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{task.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2.5">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            <span className="text-xs text-slate-600 ml-auto">
              {new Date(task.updated_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(task)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}
