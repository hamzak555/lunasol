-- Check current RLS status on events table
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'events';

-- Force disable RLS on events table
ALTER TABLE public.events DISABLE ROW LEVEL SECURITY;

-- Drop ALL policies on events table
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'events' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.events';
    END LOOP;
END $$;

-- Verify RLS is now disabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'events';

-- Show any remaining policies (should be none)
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'events' AND schemaname = 'public';
