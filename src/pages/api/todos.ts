import { z } from 'zod';
import type { APIRoute } from 'astro';
import type { TodoListResponseDTO, TodoQueryParams } from '../../types';
import { TodoService } from '../../lib/services/todo.service';
import { DEFAULT_USER_ID } from '../../db/supabase.client';
import { createTodoSchema } from '../../lib/schemas/todo.schema';

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

    // Use default user for simplicity (no authentication required)
    const todoService = new TodoService(locals.supabase);
    const result = await todoService.getTodos(DEFAULT_USER_ID, queryParams);

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

export const POST: APIRoute = async ({ request, locals }): Promise<Response> => {
  try {
    // Parse and validate request body
    const body = await request.json();
    const command = createTodoSchema.parse(body);

    // Use default user for simplicity (no authentication required)
    const todoService = new TodoService(locals.supabase);
    const result = await todoService.createTodo(DEFAULT_USER_ID, command);

    return new Response(
      JSON.stringify(result),
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request body',
            details: error.errors,
          },
        }),
        { 
          status: 422,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (error instanceof Error && error.message.includes('Failed to create todo')) {
      return new Response(
        JSON.stringify({
          error: {
            code: 'CREATE_FAILED',
            message: error.message,
          },
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Log unexpected errors
    console.error('Error in POST /api/todos:', error);
    
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

 