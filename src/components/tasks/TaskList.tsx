import React, { memo } from 'react'
import type { TaskViewModel } from '../../types'
import TaskItem from './TaskItem'

interface TaskListProps {
  tasks: TaskViewModel[]
  onTaskUpdate: (id: string, task: Partial<TaskViewModel>) => void
  onTaskDelete: (id: string) => void
  onTaskToggle: (id: string, completed: boolean) => void
}

const TaskListComponent: React.FC<TaskListProps> = ({ tasks, onTaskUpdate, onTaskDelete, onTaskToggle }) => {
  if (tasks.length === 0) {
    return <p className="text-center text-gray-500">No tasks yet. Enjoy your free time! 🎉</p>
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onTaskToggle}
          onDelete={onTaskDelete}
          onUpdate={onTaskUpdate}
        />
      ))}
    </ul>
  )
}

export const TaskList = memo(TaskListComponent)

export default TaskList 