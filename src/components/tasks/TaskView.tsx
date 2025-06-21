import React, { useState, useRef } from "react";
import { useTasksState } from "../hooks/useTasksState";
import { TaskForm } from "./TaskForm";
import { Dashboard } from "./Dashboard";
import { SearchBar } from "./SearchBar";
import { DragDropTaskList } from "./DragDropTaskList";
import { TaskSkeleton, DashboardSkeleton } from "../ui/loading-skeleton";
import type { TodoQueryParams, CreateTodoCommandDTO } from "../../types";
import { exportTasksToCSV, downloadCSV, parseCSVToTasks } from "../../lib/utils";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore – sonner types via stub
import { Toaster, toast } from "sonner";

export const TaskView: React.FC = () => {
  const [filters, setFilters] = useState<Pick<TodoQueryParams, "status">>({ status: "all" });
  const {
    tasks,
    allTasks,
    isLoading,
    error,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    allTasksCount,
    searchTerm,
    setSearchTerm,
    reorderTasks,
  } = useTasksState(filters);

  const [isCreating, setIsCreating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
              Your tasks
            </h2>
            <div className="flex gap-2">
              <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg dark:bg-gray-800">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
            ))}
          </div>
        </div>
        <DashboardSkeleton />
        <div className="mb-4 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <TaskSkeleton count={5} />
      </div>
    );
  }

  if (error) {
    return <p className="p-4 text-center text-red-500">{error}</p>;
  }

  const filterOptions = [
    { value: "all", label: "All", count: allTasksCount.total },
    { value: "incomplete", label: "Active", count: allTasksCount.active },
    { value: "completed", label: "Completed", count: allTasksCount.completed },
  ] as const;

  const handleExport = () => {
    if (allTasks.length === 0) {
      toast.error("No tasks to export");
      return;
    }

    const csvContent = exportTasksToCSV(allTasks);
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    downloadCSV(csvContent, `tasks_${timestamp}.csv`);
    toast.success(`Exported ${allTasks.length} tasks`);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      toast.error("Please select a CSV file");
      return;
    }

    setIsImporting(true);
    try {
      const content = await file.text();
      const importedTasks = parseCSVToTasks(content);

      if (importedTasks.length === 0) {
        toast.error("No valid tasks found in CSV file");
        return;
      }

      // Import tasks one by one
      let successCount = 0;
      for (const task of importedTasks) {
        try {
          await createTask({
            title: task.title || "Untitled",
            description: task.description,
            deadline: task.deadline,
          });
          successCount++;
        } catch (error) {
          console.error("Failed to import task:", task.title, error);
        }
      }

      toast.success(`Imported ${successCount} out of ${importedTasks.length} tasks`);
    } catch (error) {
      console.error("Import failed:", error);
      toast.error("Failed to import tasks");
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleTaskReorder = (fromIndex: number, toIndex: number) => {
    console.log(`Reordering task from ${fromIndex} to ${toIndex}`);

    // Get the task that's being moved for the toast message
    const movedTask = tasks[fromIndex];

    // Use the hook's reorder function
    reorderTasks(fromIndex, toIndex);

    // Show success message
    toast.success(`Task "${movedTask.title}" moved to position ${toIndex + 1}`);

    // TODO: Add backend API call to persist the new order
    // For now, the order will reset on page refresh
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
              Your tasks
            </h2>
            <button
              onClick={() => setShowDashboard(!showDashboard)}
              className="px-2 py-1 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-300"
            >
              {showDashboard ? "📊 Hide Stats" : "📊 Show Stats"}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              className="rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 hover:scale-105 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:translate-y-0 transition-all duration-200 ease-out animate-fade-slide-down"
              onClick={handleExport}
              disabled={allTasks.length === 0}
              title="Export all tasks to CSV"
            >
              📤 Export
            </button>
            <button
              className="rounded bg-purple-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-purple-700 hover:scale-105 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:translate-y-0 transition-all duration-200 ease-out animate-fade-slide-down"
              onClick={handleImportClick}
              disabled={isImporting}
              title="Import tasks from CSV"
            >
              📥 {isImporting ? "Importing..." : "Import"}
            </button>
            <button
              className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 hover:scale-105 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200 ease-out animate-fade-slide-down"
              onClick={() => setIsCreating((prev) => !prev)}
            >
              {isCreating ? "Close" : "Add task"}
            </button>
          </div>
        </div>

        {/* Hidden file input */}
        <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />

        {/* Filter tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg dark:bg-gray-800 animate-fade-slide-up">
          {filterOptions.map((option, index) => (
            <button
              key={option.value}
              onClick={() => setFilters({ status: option.value })}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-out hover:scale-105 animate-fade-slide-up ${
                filters.status === option.value
                  ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-300"
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {option.label}
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-gray-200 text-gray-600 rounded-full dark:bg-gray-600 dark:text-gray-300 transition-all duration-200 hover:scale-110">
                {option.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard */}
      {showDashboard && (
        <div className="animate-fade-slide-up">
          <Dashboard tasks={tasks} allTasks={allTasks} />
        </div>
      )}

      {/* Search Bar */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search tasks by title or description..."
      />

      {/* Create Task Form */}
      {isCreating && (
        <div className="mb-6 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm transition-all duration-300 ease-out animate-scale-in">
          <TaskForm
            onSubmit={async (values) => {
              await createTask(values as CreateTodoCommandDTO);
              setIsCreating(false);
            }}
            onCancel={() => setIsCreating(false)}
          />
        </div>
      )}

      {/* Task List with Drag & Drop */}
      <DragDropTaskList
        tasks={tasks}
        onTaskUpdate={updateTask}
        onTaskDelete={deleteTask}
        onTaskToggle={toggleTask}
        onTaskReorder={handleTaskReorder}
      />

      {/* Global toasts */}
      <Toaster richColors position="top-right" />
    </div>
  );
};
