import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, LogOut, Zap, CheckCircle2, Clock, Circle, LayoutGrid, ChevronLeft, ChevronRight } from 'lucide-react'
import { fetchTasks, createTask, updateTask, deleteTask } from '../api/tasks'
import { TaskCard } from '../components/TaskCard'
import { TaskForm } from '../components/TaskForm'
import { Modal } from '../components/Modal'
import { StatCard } from '../components/StatCard'
import type { Task, TaskCreate, TaskStatus } from '../types'
import { useAuth } from '../hooks/useAuth'

const nextStatus: Record<TaskStatus, TaskStatus> = {
  todo: 'in_progress',
  in_progress: 'done',
  done: 'todo',
}

export function DashboardPage() {
  const { logout } = useAuth()
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all')

  const { data, isLoading } = useQuery({
    queryKey: ['tasks', page],
    queryFn: () => fetchTasks(page, 20),
  })

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks'] }); setShowCreate(false) },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<TaskCreate> }) => updateTask(id, payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks'] }); setEditing(null) },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  })

  const allTasks = data?.items ?? []
  const filtered = filterStatus === 'all' ? allTasks : allTasks.filter(t => t.status === filterStatus)

  const counts = {
    total: data?.total ?? 0,
    todo: allTasks.filter(t => t.status === 'todo').length,
    in_progress: allTasks.filter(t => t.status === 'in_progress').length,
    done: allTasks.filter(t => t.status === 'done').length,
  }

  return (
    <div className="min-h-screen bg-[#0f0f13] flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-white/7 flex flex-col bg-[#0c0c10]">
        <div className="p-5 border-b border-white/7">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Zap size={15} className="text-white" fill="white" />
            </div>
            <span className="font-semibold text-white text-sm">TaskFlow</span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          <button
            onClick={() => setFilterStatus('all')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${filterStatus === 'all' ? 'bg-white/8 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
          >
            <LayoutGrid size={14} /> All Tasks
          </button>
          <button
            onClick={() => setFilterStatus('todo')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${filterStatus === 'todo' ? 'bg-white/8 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
          >
            <Circle size={14} /> To Do
          </button>
          <button
            onClick={() => setFilterStatus('in_progress')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${filterStatus === 'in_progress' ? 'bg-white/8 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
          >
            <Clock size={14} /> In Progress
          </button>
          <button
            onClick={() => setFilterStatus('done')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${filterStatus === 'done' ? 'bg-white/8 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
          >
            <CheckCircle2 size={14} /> Done
          </button>
        </nav>

        <div className="p-3 border-t border-white/7">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-rose-400 hover:bg-rose-500/8 transition-colors"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="px-6 py-4 border-b border-white/7 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-white">
              {filterStatus === 'all' ? 'All Tasks' : filterStatus === 'in_progress' ? 'In Progress' : filterStatus === 'todo' ? 'To Do' : 'Done'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">{data?.total ?? 0} tasks total</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-lg shadow-indigo-600/20"
          >
            <Plus size={15} /> New Task
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <StatCard label="Total Tasks" value={counts.total} color="bg-slate-700/60" icon={<LayoutGrid size={18} className="text-slate-300" />} />
            <StatCard label="To Do" value={counts.todo} color="bg-slate-700/60" icon={<Circle size={18} className="text-slate-300" />} />
            <StatCard label="In Progress" value={counts.in_progress} color="bg-indigo-500/20" icon={<Clock size={18} className="text-indigo-400" />} />
            <StatCard label="Done" value={counts.done} color="bg-emerald-500/20" icon={<CheckCircle2 size={18} className="text-emerald-400" />} />
          </div>

          {/* Task grid */}
          {isLoading ? (
            <div className="flex items-center justify-center h-48 text-slate-500 text-sm">Loading tasks…</div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-600">
              <CheckCircle2 size={32} className="mb-3 opacity-40" />
              <p className="text-sm">No tasks here yet</p>
              <button onClick={() => setShowCreate(true)} className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                Create your first task →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={setEditing}
                  onDelete={(id) => deleteMutation.mutate(id)}
                  onStatusCycle={(t) => updateMutation.mutate({ id: t.id, payload: { status: nextStatus[t.status] } })}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {data && data.pages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/8 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-slate-400">
                Page {data.page} of {data.pages}
              </span>
              <button
                disabled={page === data.pages}
                onClick={() => setPage(p => p + 1)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/8 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Create modal */}
      {showCreate && (
        <Modal title="New Task" onClose={() => setShowCreate(false)}>
          <TaskForm
            onSubmit={(data) => createMutation.mutate(data)}
            loading={createMutation.isPending}
          />
        </Modal>
      )}

      {/* Edit modal */}
      {editing && (
        <Modal title="Edit Task" onClose={() => setEditing(null)}>
          <TaskForm
            initial={editing}
            onSubmit={(data) => updateMutation.mutate({ id: editing.id, payload: data })}
            loading={updateMutation.isPending}
          />
        </Modal>
      )}
    </div>
  )
}
