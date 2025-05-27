import React, { useState, memo } from 'react'
import { Button } from '@/components/ui/button'
import type { TaskViewModel } from '../../types'
import { TaskForm } from './TaskForm'

interface TaskItemProps {
  task: TaskViewModel
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Partial<TaskViewModel>) => void
}

const TaskItemComponent: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return (
      <li className="rounded border border-gray-200 p-4 shadow-sm dark:border-gray-700 animate-fade-slide-up transition-all">
        <TaskForm
          initialValues={{ title: task.title, description: task.description ?? undefined, deadline: task.deadline ?? undefined }}
          onSubmit={async (values) => {
            await onUpdate(task.id, values)
            setIsEditing(false)
          }}
          onCancel={() => setIsEditing(false)}
        />
      </li>
    )
  }

  return (
    <li className="rounded border border-gray-200 p-4 shadow-sm dark:border-gray-700 animate-fade-slide-up transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.title}</h2>
          {task.description && <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant={task.completed ? 'outline' : 'default'} size="sm" onClick={() => onToggle(task.id, !task.completed)}>
            {task.completed ? 'Undo' : 'Done'}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(task.id)}>
            Delete
          </Button>
        </div>
      </div>
    </li>
  )
}

export const TaskItem = memo(TaskItemComponent)

export default TaskItem 