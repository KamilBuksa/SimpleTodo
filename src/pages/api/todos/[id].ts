import { z } from "zod";
import type { APIRoute } from "astro";
import { TodoService } from "../../../lib/services/todo.service";
import { DEFAULT_USER_ID } from "../../../db/supabase.client";
import { updateTodoSchema, toggleTodoStatusSchema } from "../../../lib/schemas/todo.schema";

export const prerender = false;

export const GET: APIRoute = async ({ params, locals }): Promise<Response> => {
  try {
    const { id } = params;

    if (!id) {
      return new Response(
        JSON.stringify({
          error: {
            code: "MISSING_TODO_ID",
            message: "Todo ID is required",
          },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const todoService = new TodoService(locals.supabase);
    const todo = await todoService.getTodoById(DEFAULT_USER_ID, id);

    return new Response(JSON.stringify(todo), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      return new Response(
        JSON.stringify({
          error: {
            code: "NOT_FOUND",
            message: "Todo not found",
          },
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.error("Error in GET /api/todos/[id]:", error);

    return new Response(
      JSON.stringify({
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
        },
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const PUT: APIRoute = async ({ params, request, locals }): Promise<Response> => {
  try {
    const { id } = params;

    if (!id) {
      return new Response(
        JSON.stringify({
          error: {
            code: "MISSING_TODO_ID",
            message: "Todo ID is required",
          },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const body = await request.json();
    const command = updateTodoSchema.parse(body);

    const todoService = new TodoService(locals.supabase);
    const result = await todoService.updateTodo(DEFAULT_USER_ID, id, command);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid request body",
            details: error.errors,
          },
        }),
        {
          status: 422,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (error instanceof Error && error.message.includes("not found")) {
      return new Response(
        JSON.stringify({
          error: {
            code: "NOT_FOUND",
            message: "Todo not found",
          },
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.error("Error in PUT /api/todos/[id]:", error);

    return new Response(
      JSON.stringify({
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
        },
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const PATCH: APIRoute = async ({ params, request, locals }): Promise<Response> => {
  try {
    const { id } = params;

    if (!id) {
      return new Response(
        JSON.stringify({
          error: {
            code: "MISSING_TODO_ID",
            message: "Todo ID is required",
          },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const body = await request.json();
    const command = toggleTodoStatusSchema.parse(body);

    const todoService = new TodoService(locals.supabase);
    const result = await todoService.toggleTodoStatus(DEFAULT_USER_ID, id, command);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid request body",
            details: error.errors,
          },
        }),
        {
          status: 422,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (error instanceof Error && error.message.includes("not found")) {
      return new Response(
        JSON.stringify({
          error: {
            code: "NOT_FOUND",
            message: "Todo not found",
          },
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.error("Error in PATCH /api/todos/[id]:", error);

    return new Response(
      JSON.stringify({
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
        },
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const DELETE: APIRoute = async ({ params, locals }): Promise<Response> => {
  try {
    const { id } = params;

    if (!id) {
      return new Response(
        JSON.stringify({
          error: {
            code: "MISSING_TODO_ID",
            message: "Todo ID is required",
          },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const todoService = new TodoService(locals.supabase);
    await todoService.deleteTodo(DEFAULT_USER_ID, id);

    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      return new Response(
        JSON.stringify({
          error: {
            code: "NOT_FOUND",
            message: "Todo not found",
          },
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.error("Error in DELETE /api/todos/[id]:", error);

    return new Response(
      JSON.stringify({
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
        },
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
