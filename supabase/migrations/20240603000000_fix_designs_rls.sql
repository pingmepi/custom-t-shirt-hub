-- This migration ensures that RLS policies are correctly applied to the designs table
-- It will first check if RLS is enabled, and if not, enable it
-- Then it will create or replace the necessary policies

-- First, check if RLS is enabled on the designs table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename = 'designs'
        AND rowsecurity = true
    ) THEN
        -- Enable RLS on the designs table
        ALTER TABLE public.designs ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'Enabled Row Level Security on designs table';
    ELSE
        RAISE NOTICE 'Row Level Security already enabled on designs table';
    END IF;
END
$$;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own designs" ON public.designs;
DROP POLICY IF EXISTS "Users can insert their own designs" ON public.designs;
DROP POLICY IF EXISTS "Users can update their own designs" ON public.designs;
DROP POLICY IF EXISTS "Users can delete their own designs" ON public.designs;
DROP POLICY IF EXISTS "Admins can view all designs" ON public.designs;
DROP POLICY IF EXISTS "Admins can insert all designs" ON public.designs;
DROP POLICY IF EXISTS "Admins can update all designs" ON public.designs;
DROP POLICY IF EXISTS "Admins can delete all designs" ON public.designs;

-- Create policies for the designs table
CREATE POLICY "Users can view their own designs"
ON public.designs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own designs"
ON public.designs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own designs"
ON public.designs FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own designs"
ON public.designs FOR DELETE
USING (auth.uid() = user_id);

-- Create admin policies for the designs table
CREATE POLICY "Admins can view all designs"
ON public.designs FOR SELECT
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can insert all designs"
ON public.designs FOR INSERT
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can update all designs"
ON public.designs FOR UPDATE
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete all designs"
ON public.designs FOR DELETE
USING (auth.jwt() ->> 'role' = 'admin');

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.designs TO authenticated;

-- Create admin role if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_roles WHERE rolname = 'admin'
    ) THEN
        CREATE ROLE admin;
        RAISE NOTICE 'Created admin role';
    END IF;
END
$$;

-- Grant necessary permissions to admin role
GRANT SELECT, INSERT, UPDATE, DELETE ON public.designs TO admin;

-- Verify that the policies were created
DO $$
DECLARE
    policy_count integer;
    user_policies integer;
    admin_policies integer;
BEGIN
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies
    WHERE tablename = 'designs' AND schemaname = 'public';

    SELECT COUNT(*) INTO user_policies
    FROM pg_policies
    WHERE tablename = 'designs' AND schemaname = 'public'
    AND policyname LIKE 'Users can%';

    SELECT COUNT(*) INTO admin_policies
    FROM pg_policies
    WHERE tablename = 'designs' AND schemaname = 'public'
    AND policyname LIKE 'Admins can%';

    RAISE NOTICE 'Number of policies on designs table: %', policy_count;
    RAISE NOTICE 'User policies: %', user_policies;
    RAISE NOTICE 'Admin policies: %', admin_policies;

    IF policy_count < 8 THEN
        RAISE WARNING 'Expected at least 8 policies on designs table, but found %', policy_count;
    ELSE
        RAISE NOTICE 'Successfully created all required policies on designs table';
    END IF;

    IF user_policies < 4 THEN
        RAISE WARNING 'Expected 4 user policies, but found %', user_policies;
    END IF;

    IF admin_policies < 4 THEN
        RAISE WARNING 'Expected 4 admin policies, but found %', admin_policies;
    END IF;
END
$$;
