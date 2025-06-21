import React, { useState } from "react";
import type { TaskViewModel } from "../../types";
import { TaskItem } from "./TaskItem";

interface DragDropTaskListProps {
  tasks: TaskViewModel[];
  onTaskUpdate: (id: string, updates: Partial<TaskViewModel>) => void;
  onTaskDelete: (id: string) => void;
  onTaskToggle: (id: string, completed: boolean) => void;
  onTaskReorder?: (fromIndex: number, toIndex: number) => void;
}

export const DragDropTaskList: React.FC<DragDropTaskListProps> = ({
  tasks,
  onTaskUpdate,
  onTaskDelete,
  onTaskToggle,
  onTaskReorder,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.currentTarget.outerHTML);

    // Add visual feedback with proper typing
    const target = e.currentTarget as HTMLLIElement;
    target.style.opacity = "0.5";
  };

  const handleDragEnd = (e: React.DragEvent<HTMLLIElement>) => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    const target = e.currentTarget as HTMLLIElement;
    target.style.opacity = "1";
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLLIElement>, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex !== null && draggedIndex !== dropIndex && onTaskReorder) {
      console.log(`Moving task from index ${draggedIndex} to ${dropIndex}`);
      onTaskReorder(draggedIndex, dropIndex);
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <div className="text-6xl mb-4">📝</div>
        <p className="text-lg font-medium">No tasks found</p>
        <p className="text-sm">Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task, index) => (
        <li
          key={task.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
          className={`transition-all duration-200 cursor-move ${draggedIndex === index ? "opacity-50 scale-95" : ""} ${
            dragOverIndex === index ? "transform scale-105" : ""
          }`}
          style={{
            transform: dragOverIndex === index ? "translateY(-2px)" : "translateY(0)",
            boxShadow: dragOverIndex === index ? "0 8px 25px rgba(0,0,0,0.15)" : "none",
          }}
        >
          <div className="relative">
            {/* Drag indicator */}
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-30 hover:opacity-60 transition-opacity pointer-events-none">
              <div className="flex flex-col space-y-0.5">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              </div>
            </div>

            {/* Drop zone indicator */}
            {dragOverIndex === index && draggedIndex !== index && (
              <div className="absolute inset-x-0 -top-1 h-0.5 bg-blue-500 rounded-full z-10"></div>
            )}

            <div className="pl-6">
              <TaskItem task={task} onToggle={onTaskToggle} onDelete={onTaskDelete} onUpdate={onTaskUpdate} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
