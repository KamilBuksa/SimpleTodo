-- Migration: Add completed column to todos table
-- Description: Adds a boolean completed column to track todo completion status

-- Add completed column to todos table
ALTER TABLE todos ADD COLUMN completed boolean NOT NULL DEFAULT false;

-- Create index for efficient filtering by completed status
CREATE INDEX todos_completed_idx ON todos(completed);

-- Create composite index for user_id and completed for efficient queries
CREATE INDEX todos_user_id_completed_idx ON todos(user_id, completed); 