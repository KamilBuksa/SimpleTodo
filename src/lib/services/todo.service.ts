import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../db/database.types';
import type { TodoQueryParams, TodoListResponseDTO, TodoItemDTO, PaginationDTO } from '../../types';

export class TodoService {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getTodos(userId: string, params: TodoQueryParams): Promise<TodoListResponseDTO> {
    // Start building the query
    let query = this.supabase
      .from('todos')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    // Apply status filter
    if (params.status && params.status !== 'all') {
      query = query.eq('completed', params.status === 'completed');
    }

    // Apply sorting
    query = query.order(params.sort || 'created_at', {
      ascending: params.order === 'asc',
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
    const todos: TodoItemDTO[] = data.map(todo => ({
      ...todo,
      completed: todo.completed || false,
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
} 