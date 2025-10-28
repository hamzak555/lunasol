-- Temporarily disable RLS on events table to test
-- This allows all operations without authentication checks
-- You can re-enable later if needed

-- Disable RLS on events table
ALTER TABLE events DISABLE ROW LEVEL SECURITY;

-- Verify the change
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'events';
