import React, { useState, memo } from "react";
import { Button } from "@/components/ui/button";
import type { TaskViewModel, UpdateTodoCommandDTO } from "../../types";
import { TaskForm } from "./TaskForm";
import { getDeadlineStatus, formatDeadline } from "../../lib/utils";

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
          <h2 className={`text-lg font-medium ${task.completed ? "line-through text-gray-400" : ""}`}>{task.title}</h2>
          {task.description && <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>}

          {/* Deadline indicator */}
          {task.deadline && (
            <div
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium mt-2 ${deadlineStatus.textColor}`}
            >
              📅 {formatDeadline(task.deadline)}
              {deadlineStatus.label && deadlineStatus.status !== "future" && (
                <span className="font-semibold">• {deadlineStatus.label}</span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={task.completed ? "outline" : "default"}
            size="sm"
            onClick={() => onToggle(task.id, !task.completed)}
          >
            {task.completed ? "Undo" : "Done"}
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
  );
};

export const TaskItem = memo(TaskItemComponent);

export default TaskItem;
