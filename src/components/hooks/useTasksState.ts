import { useCallback, useEffect, useState } from "react";
import type {
  CreateTodoCommandDTO,
  TaskListViewModel,
  TaskViewModel,
  TodoItemDTO,
  TodoListResponseDTO,
  UpdateTodoCommandDTO,
} from "../../types";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore – sonner types via stub
import { toast } from "sonner";

const API_BASE = "/api/todos";

/**
 * Hook responsible for fetching and mutating Todo items via API.
 * Currently contains placeholder implementations that will be replaced in the next steps.
 */
export const useTasksState = () => {
  const [state, setState] = useState<TaskListViewModel>({
    tasks: [],
    isLoading: true,
    error: null,
  });

  // Fetch tasks on mount
  useEffect(() => {
    const fetchTasks = async () => {
      console.log("🚀 Starting to fetch tasks from:", API_BASE);
      try {
        console.log("📡 Making fetch request...");
        const res = await fetch(API_BASE);
        console.log("📡 Response received:", res.status, res.statusText);

        if (!res.ok) throw new Error(`Error ${res.status}`);

        const data: TodoListResponseDTO = await res.json();
        console.log("📦 Data received:", data);

        const tasks: TaskViewModel[] = data.todos.map((todo) => ({
          ...todo,
          isEditing: false,
          isSaving: false,
        }));
        console.log("✅ Tasks processed:", tasks.length, "tasks");
        setState({ tasks, isLoading: false, error: null });
        toast.success("Tasks loaded");
      } catch (error) {
        console.error("❌ Failed to load tasks", error);
        setState((prev) => ({ ...prev, isLoading: false, error: "Failed to load tasks" }));
        toast.error("Failed to load tasks");
      }
    };

    fetchTasks();
  }, []);

  const createTask = useCallback(async (payload: CreateTodoCommandDTO) => {
    try {
      const optimisticId = crypto.randomUUID();
      const optimisticTask: TaskViewModel = {
        id: optimisticId,
        title: payload.title,
        description: payload.description ?? null,
        deadline: payload.deadline ?? null,
        completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        isEditing: false,
        isSaving: true,
      } as unknown as TaskViewModel;

      setState((prev) => ({ ...prev, tasks: [optimisticTask, ...prev.tasks] }));

      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);

      const created: TodoItemDTO = await res.json();

      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => (t.id === optimisticId ? { ...created, isEditing: false, isSaving: false } : t)),
      }));
      toast.success("Task created");
    } catch (error) {
      console.error("Failed to create task", error);
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((t) => !t.isSaving),
        error: "Failed to create task",
      }));
      toast.error("Failed to create task");
    }
  }, []);

  const updateTask = useCallback(async (id: string, payload: UpdateTodoCommandDTO) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) => (task.id === id ? { ...task, ...payload, isSaving: true } : task)),
    }));

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);

      const updated: TodoItemDTO = await res.json();
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task) => (task.id === id ? { ...updated, isEditing: false, isSaving: false } : task)),
      }));
      toast.success("Task updated");
    } catch (error) {
      console.error("Failed to update task", error);
      setState((prev) => ({ ...prev, error: "Failed to update task" }));
      // Rollback saved flag
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task) => (task.id === id ? { ...task, isSaving: false } : task)),
      }));
      toast.error("Failed to update task");
    }
  }, []);

  const toggleTask = useCallback(async (id: string, completed: boolean) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) => (task.id === id ? { ...task, completed } : task)),
    }));

    try {
      const res = await fetch(`${API_BASE}/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
    } catch (error) {
      console.error("Failed to toggle task status", error);
      // Rollback toggle
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task) => (task.id === id ? { ...task, completed: !completed } : task)),
        error: "Failed to toggle task status",
      }));
      toast.error("Failed to toggle task status");
    }
  }, []);

  const deleteTask = useCallback(
    async (id: string) => {
      const prevTasks = state.tasks;
      setState((prev) => ({ ...prev, tasks: prev.tasks.filter((task) => task.id !== id) }));

      try {
        const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        toast.success("Task deleted");
      } catch (error) {
        console.error("Failed to delete task", error);
        // Rollback
        setState((prev) => ({ ...prev, tasks: prevTasks, error: "Failed to delete task" }));
        toast.error("Failed to delete task");
      }
    },
    [state.tasks]
  );

  return {
    ...state,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
  };
};
