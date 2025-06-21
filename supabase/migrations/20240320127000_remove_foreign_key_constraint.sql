-- Migration: Remove foreign key constraint for development
-- Description: Removes the foreign key constraint between todos.user_id and auth.users(id) for development simplicity

-- Drop the foreign key constraint
ALTER TABLE todos DROP CONSTRAINT IF EXISTS todos_user_id_fkey; 