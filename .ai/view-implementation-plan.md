# API Endpoint Implementation Plan: List Todos (GET /api/todos)

## 1. Endpoint Overview

Retrieves a paginated, filterable, and sortable list of todos for the authenticated user. The endpoint supports various query parameters for customizing the response and implements proper error handling and security measures.

## 2. Request Details

- **HTTP Method**: GET
- **URL Pattern**: `/api/todos`
- **Parameters**:
  - Optional Query Parameters:
    - `status`: Filter todos by completion status
      - Values: 'all' | 'completed' | 'incomplete'
      - Default: 'all'
    - `page`: Page number for pagination
      - Type: number
      - Default: 1
    - `limit`: Items per page
      - Type: number
      - Default: 10
      - Max: 100
    - `sort`: Field to sort by
      - Values: 'created_at' | 'updated_at' | 'deadline'
      - Default: 'created_at'
    - `order`: Sort direction
      - Values: 'asc' | 'desc'
      - Default: 'desc'

## 3. Types and Models

### Required Types (from types.ts)

```typescript
// Query Parameters
interface TodoQueryParams {
  status?: "all" | "completed" | "incomplete";
  page?: number;
  limit?: number;
  sort?: "created_at" | "updated_at" | "deadline";
  order?: "asc" | "desc";
}

// Response Types
interface TodoListResponseDTO {
  todos: TodoItemDTO[];
  pagination: PaginationDTO;
}
```

### New Types to Create

```typescript
// Zod Schema for Query Validation
const todoQuerySchema = z.object({
  status: z.enum(["all", "completed", "incomplete"]).default("all"),
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
  sort: z.enum(["created_at", "updated_at", "deadline"]).default("created_at"),
  order: z.enum(["asc", "desc"]).default("desc"),
});
```

## 4. Data Flow

1. Request Validation

   - Validate authentication token via Supabase middleware
   - Parse and validate query parameters using Zod schema

2. Service Layer (src/lib/services/todo.service.ts)

   - Build database query based on parameters
   - Apply filters and sorting
   - Calculate pagination metadata
   - Transform database results to DTOs

3. Response Formation
   - Format todos array
   - Include pagination metadata
   - Handle potential errors

## 5. Security Considerations

1. Authentication

   - Enforce Supabase authentication middleware
   - Validate token expiration
   - Extract user_id from token

2. Authorization

   - Ensure users can only access their own todos
   - Implement row-level security in Supabase

3. Input Validation

   - Sanitize query parameters
   - Validate numeric ranges
   - Prevent SQL injection via Supabase query builder

4. Rate Limiting
   - Implement rate limiting middleware
   - Consider caching frequently accessed results

## 6. Error Handling

1. Authentication Errors (401)

   - Missing authentication token
   - Invalid token
   - Expired token

2. Validation Errors (400)

   - Invalid query parameters
   - Invalid pagination values
   - Invalid sort/order values

3. Server Errors (500)
   - Database connection issues
   - Query execution errors
   - Unexpected runtime errors

## 7. Performance Considerations

1. Database Optimization

   - Create indexes on frequently queried columns
   - Use efficient sorting strategies
   - Implement proper pagination

2. Caching Strategy

   - Consider caching results for frequently accessed pages
   - Implement cache invalidation on todo updates

3. Query Optimization
   - Use efficient joins
   - Minimize database roundtrips
   - Optimize WHERE clauses

## 8. Implementation Steps

### 1. Setup and Configuration

1. Create API endpoint file at `src/pages/api/todos.ts`
2. Set up Zod validation schema
3. Configure middleware for authentication

### 2. Service Layer Implementation

1. Create TodoService in `src/lib/services/todo.service.ts`
2. Implement query building logic
3. Add pagination helper methods
4. Create DTO transformation methods

### 3. Database Layer

1. Set up Supabase query builder
2. Implement row-level security policies
3. Create necessary indexes

### 4. API Endpoint Implementation

```typescript
// src/pages/api/todos.ts
export const prerender = false;

export async function GET({ request, locals }) {
  try {
    // 1. Extract and validate query parameters
    const queryParams = todoQuerySchema.parse(Object.fromEntries(new URL(request.url).searchParams));

    // 2. Get authenticated user
    const { user } = await locals.supabase.auth.getUser();
    if (!user) {
      return new Response(
        JSON.stringify({
          error: {
            code: "UNAUTHORIZED",
            message: "User not authenticated",
          },
        }),
        { status: 401 }
      );
    }

    // 3. Get todos from service
    const todoService = new TodoService(locals.supabase);
    const result = await todoService.getTodos(user.id, queryParams);

    // 4. Return response
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    // Handle different error types appropriately
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: {
            code: "INVALID_PARAMETERS",
            message: "Invalid query parameters",
            details: error.errors,
          },
        }),
        { status: 400 }
      );
    }

    // Log unexpected errors
    console.error("Error in GET /api/todos:", error);
    return new Response(
      JSON.stringify({
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
        },
      }),
      { status: 500 }
    );
  }
}
```

### 5. Testing

1. Write unit tests for TodoService
2. Write integration tests for API endpoint
3. Test error handling scenarios
4. Performance testing with large datasets

### 6. Documentation

1. Update API documentation
2. Document service methods
3. Add code comments for complex logic
4. Create usage examples

### 7. Deployment

1. Review security settings
2. Set up monitoring
3. Configure logging
4. Deploy to staging for testing
