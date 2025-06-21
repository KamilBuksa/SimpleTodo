import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../db/database.types";
import type {
  TodoQueryParams,
  TodoListResponseDTO,
  TodoItemDTO,
  PaginationDTO,
  CreateTodoCommandDTO,
  UpdateTodoCommandDTO,
  ToggleTodoStatusCommandDTO,
} from "../../types";

export class TodoService {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getTodos(userId: string, params: TodoQueryParams): Promise<TodoListResponseDTO> {
    // Start building the query
    let query = this.supabase.from("todos").select("*", { count: "exact" }).eq("user_id", userId);

    // Apply status filter
    if (params.status && params.status !== "all") {
      query = query.eq("completed", params.status === "completed");
    }

    // Apply sorting
    query = query.order(params.sort || "created_at", {
      ascending: params.order === "asc",
    });

    // Apply pagination
    const limit = params.limit || 10;
    const page = params.page || 1;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to);

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    // Transform data to DTOs
    const todos: TodoItemDTO[] = data.map((todo) => ({
      ...todo,
      completed: todo.completed || false,
      priority: todo.priority || "medium",
      time_estimate: todo.time_estimate,
    }));

    // Calculate pagination metadata
    const totalPages = count ? Math.ceil(count / limit) : 0;
    const pagination: PaginationDTO = {
      total: count || 0,
      page,
      limit,
      total_pages: totalPages,
    };

    return {
      todos,
      pagination,
    };
  }

  async getTodoById(userId: string, todoId: string): Promise<TodoItemDTO> {
    const { data, error } = await this.supabase
      .from("todos")
      .select("*")
      .eq("id", todoId)
      .eq("user_id", userId)
      .single();

    if (error) {
      throw new Error(`Failed to get todo: ${error.message}`);
    }

    if (!data) {
      throw new Error("Todo not found or you do not have permission to view it");
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      created_at: data.created_at,
      updated_at: data.updated_at,
      deadline: data.deadline,
      completed: data.completed || false,
      priority: data.priority || "medium",
      time_estimate: data.time_estimate,
    };
  }

  async createTodo(userId: string, command: CreateTodoCommandDTO): Promise<TodoItemDTO> {
    const { data, error } = await this.supabase
      .from("todos")
      .insert([
        {
          user_id: userId,
          title: command.title,
          description: command.description,
          deadline: command.deadline,
          priority: command.priority || "medium",
          time_estimate: command.time_estimate,
          completed: false,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create todo: ${error.message}`);
    }

    if (!data) {
      throw new Error("Failed to create todo: No data returned");
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      created_at: data.created_at,
      updated_at: data.updated_at,
      deadline: data.deadline,
      completed: data.completed,
      priority: data.priority || "medium",
      time_estimate: data.time_estimate,
    };
  }

  async updateTodo(userId: string, todoId: string, command: UpdateTodoCommandDTO): Promise<TodoItemDTO> {
    // Filter out undefined values to avoid issues with Supabase
    const updateData: Partial<{
      title: string;
      description: string | null;
      deadline: string | null;
      priority: "low" | "medium" | "high" | "urgent";
      time_estimate: number | null;
    }> = {};

    if (command.title !== undefined) {
      updateData.title = command.title;
    }

    if (command.description !== undefined) {
      updateData.description = command.description;
    }

    if (command.deadline !== undefined) {
      updateData.deadline = command.deadline;
    }

    if (command.priority !== undefined) {
      updateData.priority = command.priority;
    }

    if (command.time_estimate !== undefined) {
      updateData.time_estimate = command.time_estimate;
    }

    // If no fields to update, return current todo
    if (Object.keys(updateData).length === 0) {
      return this.getTodoById(userId, todoId);
    }

    const { data, error } = await this.supabase
      .from("todos")
      .update(updateData)
      .eq("id", todoId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update todo: ${error.message}`);
    }

    if (!data) {
      throw new Error("Todo not found or you do not have permission to update it");
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      created_at: data.created_at,
      updated_at: data.updated_at,
      deadline: data.deadline,
      completed: data.completed,
      priority: data.priority || "medium",
      time_estimate: data.time_estimate,
    };
  }

  async toggleTodoStatus(
    userId: string,
    todoId: string,
    command: ToggleTodoStatusCommandDTO
  ): Promise<{ id: string; completed: boolean; updated_at: string }> {
    const { data, error } = await this.supabase
      .from("todos")
      .update({ completed: command.completed })
      .eq("id", todoId)
      .eq("user_id", userId)
      .select("id, completed, updated_at")
      .single();

    if (error) {
      throw new Error(`Failed to toggle todo status: ${error.message}`);
    }

    if (!data) {
      throw new Error("Todo not found or you do not have permission to update it");
    }

    return {
      id: data.id,
      completed: data.completed || false,
      updated_at: data.updated_at,
    };
  }

  async deleteTodo(userId: string, todoId: string): Promise<void> {
    const { error } = await this.supabase.from("todos").delete().eq("id", todoId).eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to delete todo: ${error.message}`);
    }
  }
}
