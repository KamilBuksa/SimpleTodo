import { useCallback, useEffect, useState } from "react";
import type {
  CreateTodoCommandDTO,
  TaskListViewModel,
  TaskViewModel,
  TodoItemDTO,
  TodoListResponseDTO,
  UpdateTodoCommandDTO,
  TodoQueryParams,
} from "../../types";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore – sonner types via stub
import { toast } from "sonner";

const API_BASE = "/api/todos";

/**
 * Hook responsible for fetching and mutating Todo items via API.
 * Currently contains placeholder implementations that will be replaced in the next steps.
 */
export const useTasksState = (filters?: Pick<TodoQueryParams, "status">) => {
  const [state, setState] = useState<TaskListViewModel>({
    tasks: [],
    isLoading: true,
    error: null,
  });

  const [allTasksCount, setAllTasksCount] = useState({
    total: 0,
    completed: 0,
    active: 0,
  });

  // Fetch tasks on mount and when filters change
  useEffect(() => {
    const fetchTasks = async () => {
      console.log("🚀 Starting to fetch tasks from:", API_BASE);
      try {
        // Fetch all tasks for counts (without filters)
        const allTasksRes = await fetch(API_BASE);
        if (!allTasksRes.ok) throw new Error(`Error ${allTasksRes.status}`);
        const allTasksData: TodoListResponseDTO = await allTasksRes.json();

        // Update counts
        const total = allTasksData.todos.length;
        const completed = allTasksData.todos.filter((t) => t.completed).length;
        const active = total - completed;
        setAllTasksCount({ total, completed, active });

        // Build query string with filters for displayed tasks
        const queryParams = new URLSearchParams();
        if (filters?.status) {
          queryParams.set("status", filters.status);
        }

        const url = queryParams.toString() ? `${API_BASE}?${queryParams.toString()}` : API_BASE;

        console.log("📡 Making fetch request to:", url);
        const res = await fetch(url);
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
  }, [filters]);

  const updateTaskCounts = useCallback(async () => {
    try {
      const allTasksRes = await fetch(API_BASE);
      if (!allTasksRes.ok) {
        console.warn("Failed to fetch tasks for count update:", allTasksRes.status);
        return;
      }
      const allTasksData: TodoListResponseDTO = await allTasksRes.json();

      // Handle case where todos might be undefined
      const todos = allTasksData.todos || [];
      const total = todos.length;
      const completed = todos.filter((t) => t.completed).length;
      const active = total - completed;
      setAllTasksCount({ total, completed, active });
    } catch (error) {
      console.error("Failed to update task counts", error);
    }
  }, []);

  const createTask = useCallback(
    async (payload: CreateTodoCommandDTO) => {
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

        // Optimistically update counts
        setAllTasksCount((prev) => ({ ...prev, total: prev.total + 1, active: prev.active + 1 }));

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
        // Rollback count update - don't await to avoid additional errors
        updateTaskCounts().catch(console.error);
        toast.error("Failed to create task");
      }
    },
    [updateTaskCounts]
  );

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

  const toggleTask = useCallback(
    async (id: string, completed: boolean) => {
      setState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task) => (task.id === id ? { ...task, completed } : task)),
      }));

      // Optimistically update counts
      setAllTasksCount((prev) => ({
        ...prev,
        completed: completed ? prev.completed + 1 : prev.completed - 1,
        active: completed ? prev.active - 1 : prev.active + 1,
      }));

      try {
        const res = await fetch(`${API_BASE}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed }),
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        toast.success(completed ? "Task completed" : "Task marked as active");
      } catch (error) {
        console.error("Failed to toggle task status", error);
        // Rollback toggle
        setState((prev) => ({
          ...prev,
          tasks: prev.tasks.map((task) => (task.id === id ? { ...task, completed: !completed } : task)),
          error: "Failed to toggle task status",
        }));
        // Rollback count update - don't await to avoid additional errors
        updateTaskCounts().catch(console.error);
        toast.error("Failed to toggle task status");
      }
    },
    [updateTaskCounts]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      const prevTasks = state.tasks;
      const taskToDelete = state.tasks.find((t) => t.id === id);
      setState((prev) => ({ ...prev, tasks: prev.tasks.filter((task) => task.id !== id) }));

      // Optimistically update counts
      if (taskToDelete) {
        setAllTasksCount((prev) => ({
          ...prev,
          total: prev.total - 1,
          completed: taskToDelete.completed ? prev.completed - 1 : prev.completed,
          active: taskToDelete.completed ? prev.active : prev.active - 1,
        }));
      }

      try {
        const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        toast.success("Task deleted");
      } catch (error) {
        console.error("Failed to delete task", error);
        // Rollback
        setState((prev) => ({ ...prev, tasks: prevTasks, error: "Failed to delete task" }));
        updateTaskCounts().catch(console.error);
        toast.error("Failed to delete task");
      }
    },
    [state.tasks, updateTaskCounts]
  );

  return {
    ...state,
    allTasksCount,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
  };
};
