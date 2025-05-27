# REST API Plan

## 1. Resources

### 1.1. Users

- Managed by Supabase Auth
- Extended with additional fields in the database
- Properties:
  - id (UUID)
  - email (string)
  - name (string)
  - created_at (timestamp)
  - updated_at (timestamp)

### 1.2. Todos

- Main resource for task management
- Properties:
  - id (UUID)
  - user_id (UUID, references Users)
  - title (string)
  - description (string, optional)
  - created_at (timestamp)
  - updated_at (timestamp)
  - deadline (timestamp, optional)

## 2. Endpoints

### 2.1. Todo Management

#### 2.1.1. List Todos

- **Method**: GET
- **Path**: `/api/todos`
- **Description**: Retrieve a list of todos for the authenticated user
- **Query Parameters**:
  - status: string (optional) - Filter by status ("all", "completed", "incomplete")
  - page: number (optional) - Page number for pagination
  - limit: number (optional) - Items per page (default: 10)
  - sort: string (optional) - Sort field ("created_at", "updated_at", "deadline")
  - order: string (optional) - Sort order ("asc", "desc")
- **Response**:
  ```json
  {
    "todos": [
      {
        "id": "uuid",
        "title": "string",
        "description": "string",
        "created_at": "timestamp",
        "updated_at": "timestamp",
        "deadline": "timestamp",
        "completed": boolean
      }
    ],
    "pagination": {
      "total": number,
      "page": number,
      "limit": number,
      "total_pages": number
    }
  }
  ```
- **Success**: 200 OK
- **Errors**:
  - 401 Unauthorized - User not authenticated
  - 400 Bad Request - Invalid query parameters

#### 2.1.2. Create Todo

- **Method**: POST
- **Path**: `/api/todos`
- **Description**: Create a new todo for the authenticated user
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string (optional)",
    "deadline": "timestamp (optional)"
  }
  ```
- **Response**:
  ```json
  {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "created_at": "timestamp",
    "updated_at": "timestamp",
    "deadline": "timestamp",
    "completed": false
  }
  ```
- **Success**: 201 Created
- **Errors**:
  - 401 Unauthorized - User not authenticated
  - 400 Bad Request - Invalid request body
  - 422 Unprocessable Entity - Validation errors

#### 2.1.3. Update Todo

- **Method**: PUT
- **Path**: `/api/todos/:id`
- **Description**: Update an existing todo
- **URL Parameters**:
  - id: UUID - Todo identifier
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string (optional)",
    "deadline": "timestamp (optional)"
  }
  ```
- **Response**:
  ```json
  {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "created_at": "timestamp",
    "updated_at": "timestamp",
    "deadline": "timestamp",
    "completed": boolean
  }
  ```
- **Success**: 200 OK
- **Errors**:
  - 401 Unauthorized - User not authenticated
  - 403 Forbidden - Todo belongs to another user
  - 404 Not Found - Todo not found
  - 422 Unprocessable Entity - Validation errors

#### 2.1.4. Toggle Todo Status

- **Method**: PATCH
- **Path**: `/api/todos/:id/status`
- **Description**: Toggle the completion status of a todo
- **URL Parameters**:
  - id: UUID - Todo identifier
- **Request Body**:
  ```json
  {
    "completed": boolean
  }
  ```
- **Response**:
  ```json
  {
    "id": "uuid",
    "completed": boolean,
    "updated_at": "timestamp"
  }
  ```
- **Success**: 200 OK
- **Errors**:
  - 401 Unauthorized - User not authenticated
  - 403 Forbidden - Todo belongs to another user
  - 404 Not Found - Todo not found

#### 2.1.5. Delete Todo

- **Method**: DELETE
- **Path**: `/api/todos/:id`
- **Description**: Delete a todo
- **URL Parameters**:
  - id: UUID - Todo identifier
- **Response**: No content
- **Success**: 204 No Content
- **Errors**:
  - 401 Unauthorized - User not authenticated
  - 403 Forbidden - Todo belongs to another user
  - 404 Not Found - Todo not found

## 3. Authentication and Authorization

### 3.1. Authentication

- Implemented using Supabase Authentication
- JWT tokens used for API authentication
- Token must be included in Authorization header:
  ```
  Authorization: Bearer <jwt_token>
  ```

### 3.2. Authorization

- Row Level Security (RLS) policies in Supabase ensure users can only access their own todos
- All API endpoints require authentication
- Additional application-level checks ensure user can only modify their own todos

## 4. Validation and Business Logic

### 4.1. Todo Validation

- Title:
  - Required
  - String type
  - Non-empty
- Description:
  - Optional
  - String type
  - Maximum length: 4000 characters
- Deadline:
  - Optional
  - Valid ISO 8601 timestamp
  - Must be in the future when creating/updating

### 4.2. Business Logic

- Todos are always associated with the authenticated user
- Updated_at timestamp is automatically updated on modifications
- Completed status can only be toggled, not set directly during creation
- List endpoint supports filtering by status and sorting by various fields
- Pagination is implemented to handle large sets of todos efficiently

## 5. Error Handling

### 5.1. Standard Error Response Format

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {} // Optional additional error details
  }
}
```

### 5.2. Common Error Codes

- 400 Bad Request - Invalid input data
- 401 Unauthorized - Missing or invalid authentication
- 403 Forbidden - Insufficient permissions
- 404 Not Found - Resource not found
- 422 Unprocessable Entity - Validation errors
- 429 Too Many Requests - Rate limit exceeded
- 500 Internal Server Error - Server-side error

## 6. Rate Limiting

- Rate limiting is implemented per user
- Limits:
  - 100 requests per minute per user
  - 1000 requests per hour per user
- Rate limit headers included in responses:
  ```
  X-RateLimit-Limit: <limit>
  X-RateLimit-Remaining: <remaining>
  X-RateLimit-Reset: <timestamp>
  ```
