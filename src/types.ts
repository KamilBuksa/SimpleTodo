// Base Types
import type { Database } from './db/database.types'

// Database Todo Type
export type TodoEntity = Database['public']['Tables']['todos']['Row']

// Pagination
export interface PaginationDTO {
  total: number
  page: number
  limit: number
  total_pages: number
}

// Todo DTOs
export interface TodoItemDTO extends Omit<TodoEntity, 'user_id'> {
  completed: boolean
}

export interface TodoListResponseDTO {
  todos: TodoItemDTO[]
  pagination: PaginationDTO
}

// Command Models
export interface CreateTodoCommandDTO {
  title: string
  description?: string | null
  deadline?: string | null
}

export type UpdateTodoCommandDTO = Partial<CreateTodoCommandDTO>

export interface ToggleTodoStatusCommandDTO {
  completed: boolean
}

// Error Response
export interface ErrorResponseDTO {
  error: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}

// Query Parameters
export interface TodoQueryParams {
  status?: 'all' | 'completed' | 'incomplete'
  page?: number
  limit?: number
  sort?: 'created_at' | 'updated_at' | 'deadline'
  order?: 'asc' | 'desc'
} 