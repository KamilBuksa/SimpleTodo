# Database Schema for SimpleTodo

## 1. Tables and Columns

### 1.1. Users Table (Extended Supabase Users)
- **id**: UUID, PRIMARY KEY.
- **email**: VARCHAR(255), NOT NULL, UNIQUE.
- **name**: VARCHAR(255), NOT NULL.
- *(Other built-in columns provided by Supabase are maintained.)*

### 1.2. Todos Table
- **id**: UUID, PRIMARY KEY.
- **user_id**: UUID, NOT NULL, FOREIGN KEY REFERENCES users(id).
- **title**: VARCHAR(255) NOT NULL.
- **description**: TEXT, with a CHECK constraint ensuring length is at most 4000 characters.
  - Constraint: CHECK (description IS NULL OR LENGTH(description) <= 4000).
- **created_at**: TIMESTAMPTZ, NOT NULL, DEFAULT NOW().
- **updated_at**: TIMESTAMPTZ, NOT NULL, DEFAULT NOW().
- **deadline**: TIMESTAMPTZ, NULL.

## 2. Relationships
- One-to-Many relationship: Each user can have multiple todos.
  - `todos.user_id` references `users.id`.

## 3. Indexes
- Unique index on `users.email` for fast lookup and enforcing uniqueness.
- Index on `todos.user_id` to optimize queries filtering by user.

## 4. PostgreSQL RLS Policies
- **Todos Table RLS Policy**: Enable Row-Level Security on the `todos` table.
  - Policy: Only allow operations (SELECT, INSERT, UPDATE, DELETE) on rows where `todos.user_id = auth.uid()`.
- *Optionally*, similar policies can be applied to the `users` table if needed.

## 5. Additional Notes
- UUIDs are used as primary keys to ensure uniqueness and scalability.
- PostgreSQL constraints (NOT NULL, UNIQUE, CHECK) enforce data integrity.
- The `updated_at` column should be automatically updated on modifications using triggers or application logic.
- This schema serves as a basis for creating database migrations and should integrate with Supabase's authentication and security mechanisms. 