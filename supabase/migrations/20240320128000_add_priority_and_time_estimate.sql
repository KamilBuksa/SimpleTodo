-- Add priority and time_estimate columns to todos table
ALTER TABLE todos 
ADD COLUMN priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
ADD COLUMN time_estimate INTEGER; -- Time estimate in minutes

-- Add comment for clarity
COMMENT ON COLUMN todos.priority IS 'Task priority: low, medium, high, urgent';
COMMENT ON COLUMN todos.time_estimate IS 'Estimated time to complete task in minutes'; 