import React, { useState, memo } from "react";
import { Button } from "@/components/ui/button";
import type { TaskViewModel, UpdateTodoCommandDTO } from "../../types";
import { TaskForm } from "./TaskForm";
import { getDeadlineStatus, formatDeadline, getPriorityColor, getPriorityIcon, getPriorityLabel, formatTimeEstimate } from "../../lib/utils";

interface TaskItemProps {
  task: TaskViewModel;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: UpdateTodoCommandDTO) => void;
}

const TaskItemComponent: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const deadlineStatus = getDeadlineStatus(task.deadline);

  if (isEditing) {
    // Convert deadline from datetime format to date format for the form
    const deadlineForForm = task.deadline ? task.deadline.split("T")[0] : undefined;

    return (
      <li className="rounded border border-gray-200 p-4 shadow-sm dark:border-gray-700 animate-fade-slide-up transition-all">
        <TaskForm
          initialValues={{
            title: task.title,
            description: task.description ?? undefined,
            deadline: deadlineForForm,
            priority: task.priority,
            time_estimate: task.time_estimate,
          }}
          onSubmit={async (values) => {
            await onUpdate(task.id, values as UpdateTodoCommandDTO);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
          isEditing={true}
        />
      </li>
    );
  }

  return (
    <li
      className={`rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm animate-fade-slide-up transition-all duration-200 ${deadlineStatus.color} ${task.completed ? "opacity-60" : ""}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-2 mb-1">
            <h2 className={`text-lg font-medium flex-1 ${task.completed ? "line-through text-gray-400" : ""}`}>{task.title}</h2>
            
            {/* Priority indicator */}
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(task.priority)} animate-fade-slide-up`}>
              <span className="animate-bounce-gentle">{getPriorityIcon(task.priority)}</span>
              {getPriorityLabel(task.priority)}
            </div>
          </div>

          {task.description && <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>}

          <div className="flex items-center gap-3 mt-2">
            {/* Deadline indicator */}
            {task.deadline && (
              <div
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${deadlineStatus.textColor} animate-fade-slide-up hover:scale-105 transition-all duration-200 ease-out`}
              >
                <span className="animate-bounce-gentle">📅</span> {formatDeadline(task.deadline)}
                {deadlineStatus.label && deadlineStatus.status !== "future" && (
                  <span className="font-semibold animate-pulse-glow">• {deadlineStatus.label}</span>
                )}
              </div>
            )}

            {/* Time estimate indicator */}
            {task.time_estimate && (
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 animate-fade-slide-up hover:scale-105 transition-all duration-200 ease-out">
                <span className="animate-bounce-gentle">⏱️</span> {formatTimeEstimate(task.time_estimate)}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={task.completed ? "outline" : "default"}
            size="sm"
            onClick={() => onToggle(task.id, !task.completed)}
            className="hover:scale-105 hover:-translate-y-0.5 transition-all duration-200 ease-out"
          >
            {task.completed ? "Undo" : "Done"}
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => setIsEditing(true)}
            className="hover:scale-105 hover:-translate-y-0.5 transition-all duration-200 ease-out"
          >
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onDelete(task.id)}
            className="hover:scale-105 hover:-translate-y-0.5 hover:wiggle transition-all duration-200 ease-out"
          >
            Delete
          </Button>
        </div>
      </div>
    </li>
  );
};

export const TaskItem = memo(TaskItemComponent);

export default TaskItem;
