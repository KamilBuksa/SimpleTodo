import React, { useState } from "react";
import { useTasksState } from "../hooks/useTasksState";
import TaskList from "./TaskList";
import { TaskForm } from "./TaskForm";
import type { TodoQueryParams } from "../../types";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore – sonner types via stub
import { Toaster } from "sonner";

export const TaskView: React.FC = () => {
  const [filters, setFilters] = useState<Pick<TodoQueryParams, "status">>({ status: "all" });
  const { tasks, isLoading, error, createTask, updateTask, toggleTask, deleteTask, allTasksCount } =
    useTasksState(filters);
  const [isCreating, setIsCreating] = useState(false);

  if (isLoading) {
    return <p className="p-4 text-center">Loading tasks…</p>;
  }

  if (error) {
    return <p className="p-4 text-center text-red-500">{error}</p>;
  }

  const filterOptions = [
    { value: "all", label: "All", count: allTasksCount.total },
    { value: "incomplete", label: "Active", count: allTasksCount.active },
    { value: "completed", label: "Completed", count: allTasksCount.completed },
  ] as const;

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <header className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Your tasks</h1>
          <button
            className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            onClick={() => setIsCreating((prev) => !prev)}
          >
            {isCreating ? "Close" : "Add task"}
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg dark:bg-gray-800">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilters({ status: option.value })}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                filters.status === option.value
                  ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              {option.label}
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-gray-200 text-gray-600 rounded-full dark:bg-gray-600 dark:text-gray-300">
                {option.count}
              </span>
            </button>
          ))}
        </div>
      </header>

      {isCreating && (
        <div className="mb-6 rounded border border-gray-200 p-4 shadow-sm dark:border-gray-700">
          <TaskForm
            onSubmit={async (values) => {
              await createTask(values);
              setIsCreating(false);
            }}
            onCancel={() => setIsCreating(false)}
          />
        </div>
      )}

      <TaskList tasks={tasks} onTaskUpdate={updateTask} onTaskDelete={deleteTask} onTaskToggle={toggleTask} />

      {/* Global toasts */}
      <Toaster richColors />
    </div>
  );
};
