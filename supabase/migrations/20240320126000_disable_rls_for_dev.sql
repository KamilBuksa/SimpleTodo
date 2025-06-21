-- Migration: Disable RLS for development
-- Description: Disables Row Level Security for todos table to simplify development

-- Drop all existing RLS policies
DROP POLICY IF EXISTS "Allow default user and authenticated users to view their todos" ON todos;
DROP POLICY IF EXISTS "Allow default user and authenticated users to insert their todo" ON todos;
DROP POLICY IF EXISTS "Allow default user and authenticated users to update their todo" ON todos;
DROP POLICY IF EXISTS "Allow default user and authenticated users to delete their todo" ON todos;

-- Disable Row Level Security on todos table
ALTER TABLE todos DISABLE ROW LEVEL SECURITY; 