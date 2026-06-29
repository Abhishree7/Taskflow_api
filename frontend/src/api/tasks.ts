import client from './client'
import type { PaginatedTasks, Task, TaskCreate, TaskUpdate } from '../types'

export async function fetchTasks(page = 1, pageSize = 20): Promise<PaginatedTasks> {
  const { data } = await client.get<PaginatedTasks>('/tasks', { params: { page, page_size: pageSize } })
  return data
}

export async function createTask(payload: TaskCreate): Promise<Task> {
  const { data } = await client.post<Task>('/tasks', payload)
  return data
}

export async function updateTask(id: string, payload: TaskUpdate): Promise<Task> {
  const { data } = await client.patch<Task>(`/tasks/${id}`, payload)
  return data
}

export async function deleteTask(id: string): Promise<void> {
  await client.delete(`/tasks/${id}`)
}
