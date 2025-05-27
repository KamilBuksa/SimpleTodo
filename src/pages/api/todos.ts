import { z } from 'zod';
import type { APIRoute } from 'astro';
import type { TodoListResponseDTO, TodoQueryParams } from '../../types';
import { TodoService } from '../../lib/services/todo.service';

export const prerender = false;

// Query parameters validation schema
const todoQuerySchema = z.object({
  status: z.enum(['all', 'completed', 'incomplete']).default('all'),
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
  sort: z.enum(['created_at', 'updated_at', 'deadline']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export const GET: APIRoute = async ({ request, locals }): Promise<Response> => {
  try {
    // Extract and validate query parameters
    const queryParams = todoQuerySchema.parse(
      Object.fromEntries(new URL(request.url).searchParams)
    );

    // Get authenticated user
    const { data: { user }, error: authError } = await locals.supabase.auth.getUser();
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({
          error: {
            code: 'UNAUTHORIZED',
            message: 'User not authenticated',
          },
        }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get todos using the service
    const todoService = new TodoService(locals.supabase);
    const result = await todoService.getTodos(user.id, queryParams);

    return new Response(
      JSON.stringify(result),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: {
            code: 'INVALID_PARAMETERS',
            message: 'Invalid query parameters',
            details: error.errors,
          },
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Log unexpected errors
    console.error('Error in GET /api/todos:', error);
    
    return new Response(
      JSON.stringify({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}; 