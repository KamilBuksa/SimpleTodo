-- Migration: Update RLS policies for DEFAULT_USER_ID
-- Description: Updates RLS policies to allow operations for the default user without requiring authentication

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can view their own todos" ON todos;
DROP POLICY IF EXISTS "Users can insert their own todos" ON todos;
DROP POLICY IF EXISTS "Users can update their own todos" ON todos;
DROP POLICY IF EXISTS "Users can delete their own todos" ON todos;

-- Create new RLS policies that allow access for the default user OR authenticated users
-- Policy for viewing todos
CREATE POLICY "Allow default user and authenticated users to view their todos"
    ON todos FOR SELECT
    USING (
        user_id = 'f2301fcd-4b3b-46af-addd-37c02f681ac8'::uuid OR 
        (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    );

-- Policy for inserting todos
CREATE POLICY "Allow default user and authenticated users to insert their todos"
    ON todos FOR INSERT
    WITH CHECK (
        user_id = 'f2301fcd-4b3b-46af-addd-37c02f681ac8'::uuid OR 
        (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    );

-- Policy for updating todos
CREATE POLICY "Allow default user and authenticated users to update their todos"
    ON todos FOR UPDATE
    USING (
        user_id = 'f2301fcd-4b3b-46af-addd-37c02f681ac8'::uuid OR 
        (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    )
    WITH CHECK (
        user_id = 'f2301fcd-4b3b-46af-addd-37c02f681ac8'::uuid OR 
        (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    );

-- Policy for deleting todos
CREATE POLICY "Allow default user and authenticated users to delete their todos"
    ON todos FOR DELETE
    USING (
        user_id = 'f2301fcd-4b3b-46af-addd-37c02f681ac8'::uuid OR 
        (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    ); 