# Database Migration Template with RLS Safeguards

This document provides a template for creating safe database migrations that preserve Row Level Security (RLS) policies.

## Migration Template

When creating a new migration file, use this template to ensure RLS policies are preserved:

```sql
-- Migration: [MIGRATION_NAME]
-- Description: [BRIEF_DESCRIPTION]
-- Date: [YYYY-MM-DD]

-- 1. Begin transaction
BEGIN;

-- 2. Make your schema changes here
-- Example: Add a new column
-- ALTER TABLE designs ADD COLUMN new_column TEXT;

-- 3. Verify RLS is enabled on affected tables
DO $$
BEGIN
    -- Check if RLS is enabled on the designs table
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'designs' 
        AND rowsecurity = true
    ) THEN
        -- Enable RLS if it's not enabled
        ALTER TABLE public.designs ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'Enabled Row Level Security on designs table';
    END IF;
END
$$;

-- 4. Verify required policies exist
DO $$
BEGIN
    -- Check if the SELECT policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public'
        AND tablename = 'designs' 
        AND policyname = 'Users can view their own designs'
    ) THEN
        -- Create the policy if it doesn't exist
        CREATE POLICY "Users can view their own designs"
        ON public.designs FOR SELECT
        USING (auth.uid() = user_id);
        
        RAISE NOTICE 'Created missing SELECT policy on designs table';
    END IF;

    -- Check if the INSERT policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public'
        AND tablename = 'designs' 
        AND policyname = 'Users can insert their own designs'
    ) THEN
        -- Create the policy if it doesn't exist
        CREATE POLICY "Users can insert their own designs"
        ON public.designs FOR INSERT
        WITH CHECK (auth.uid() = user_id);
        
        RAISE NOTICE 'Created missing INSERT policy on designs table';
    END IF;

    -- Check if the UPDATE policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public'
        AND tablename = 'designs' 
        AND policyname = 'Users can update their own designs'
    ) THEN
        -- Create the policy if it doesn't exist
        CREATE POLICY "Users can update their own designs"
        ON public.designs FOR UPDATE
        USING (auth.uid() = user_id);
        
        RAISE NOTICE 'Created missing UPDATE policy on designs table';
    END IF;

    -- Check if the DELETE policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public'
        AND tablename = 'designs' 
        AND policyname = 'Users can delete their own designs'
    ) THEN
        -- Create the policy if it doesn't exist
        CREATE POLICY "Users can delete their own designs"
        ON public.designs FOR DELETE
        USING (auth.uid() = user_id);
        
        RAISE NOTICE 'Created missing DELETE policy on designs table';
    END IF;
END
$$;

-- 5. Verify permissions for authenticated role
DO $$
BEGIN
    -- Grant necessary permissions to authenticated role
    GRANT SELECT, INSERT, UPDATE, DELETE ON public.designs TO authenticated;
    RAISE NOTICE 'Granted permissions to authenticated role';
END
$$;

-- 6. Commit transaction
COMMIT;
```

## Using the Template

1. Copy the template to a new migration file in `supabase/migrations/`
2. Name the file with a timestamp and descriptive name, e.g., `20240605000000_add_new_column.sql`
3. Replace the placeholders with your specific migration details
4. Modify the schema changes section with your actual changes
5. Add or remove policy checks for tables other than `designs` as needed

## Best Practices

- **Always use transactions** to ensure all changes are applied atomically
- **Make migrations idempotent** so they can be run multiple times without errors
- **Include RLS verification** for any table that contains user data
- **Test migrations** in a development environment before applying to production
- **Run the verification script** after applying migrations:
  ```bash
  ./scripts/verify-rls-policies.sh
  ```

## Common Pitfalls to Avoid

- **Don't use `DROP TABLE` without recreating policies** on the new table
- **Don't use `DISABLE ROW LEVEL SECURITY`** without re-enabling it
- **Don't modify policy conditions** without ensuring they still protect user data
- **Don't forget to grant permissions** to the authenticated role

By following this template, you can ensure that database migrations preserve the necessary RLS policies and prevent the "designs not loading" issue from recurring.
