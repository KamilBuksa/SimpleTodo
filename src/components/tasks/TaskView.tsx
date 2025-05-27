import React, { useState } from 'react'
import { useTasksState } from '../hooks/useTasksState'
import TaskList from './TaskList'
import { TaskForm } from './TaskForm'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore – sonner types via stub
import { Toaster } from 'sonner'

export const TaskView: React.FC = () => {
  const { tasks, isLoading, error, createTask, updateTask, toggleTask, deleteTask } = useTasksState()
  const [isCreating, setIsCreating] = useState(false)

  if (isLoading) {
    return <p className="p-4 text-center">Loading tasks…</p>
  }

  if (error) {
    return <p className="p-4 text-center text-red-500">{error}</p>
  }

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your tasks</h1>
        <button
          className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          onClick={() => setIsCreating((prev) => !prev)}
        >
          {isCreating ? 'Close' : 'Add task'}
        </button>
      </header>

      {isCreating && (
        <div className="mb-6 rounded border border-gray-200 p-4 shadow-sm dark:border-gray-700">
          <TaskForm
            onSubmit={async (values) => {
              await createTask(values)
              setIsCreating(false)
            }}
            onCancel={() => setIsCreating(false)}
          />
        </div>
      )}

      <TaskList
        tasks={tasks}
        onTaskUpdate={updateTask}
        onTaskDelete={deleteTask}
        onTaskToggle={toggleTask}
      />

      {/* Global toasts */}
      <Toaster richColors />
    </div>
  )
} 