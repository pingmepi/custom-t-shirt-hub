# Row Level Security (RLS) Policy Safeguards

## Overview

This document provides guidance on maintaining Row Level Security (RLS) policies in our Supabase database, with a focus on preventing the "designs not loading" issue that can occur when RLS policies are missing or incorrectly configured.

## The Issue

**Problem**: Users can authenticate successfully but cannot access their designs in the dashboard.

**Root Cause**: Row Level Security (RLS) is enabled on the designs table, but the necessary policies that allow users to access their own designs are missing or incorrectly configured.

**Impact**: Users can log in but see an empty dashboard or error messages when trying to view their designs.

## How RLS Works

Row Level Security (RLS) is a PostgreSQL feature that restricts which rows a user can access in a database table. In our application:

1. RLS is enabled on tables like `profiles`, `designs`, and `orders`
2. Policies define which rows a user can SELECT, INSERT, UPDATE, or DELETE
3. For the `designs` table, policies ensure users can only access designs where `user_id` matches their authenticated user ID

## Required RLS Policies

The following policies must be present on the `designs` table:

### User Policies

These policies ensure regular users can only access their own designs:

```sql
-- Policy for selecting designs
CREATE POLICY "Users can view their own designs"
ON designs FOR SELECT
USING (auth.uid() = user_id);

-- Policy for inserting designs
CREATE POLICY "Users can insert their own designs"
ON designs FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy for updating designs
CREATE POLICY "Users can update their own designs"
ON designs FOR UPDATE
USING (auth.uid() = user_id);

-- Policy for deleting designs
CREATE POLICY "Users can delete their own designs"
ON designs FOR DELETE
USING (auth.uid() = user_id);
```

### Admin Policies

These policies allow admin users to access all designs regardless of the user_id:

```sql
-- Policy for admins to select any design
CREATE POLICY "Admins can view all designs"
ON designs FOR SELECT
USING (auth.jwt() ->> 'role' = 'admin');

-- Policy for admins to insert any design
CREATE POLICY "Admins can insert all designs"
ON designs FOR INSERT
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Policy for admins to update any design
CREATE POLICY "Admins can update all designs"
ON designs FOR UPDATE
USING (auth.jwt() ->> 'role' = 'admin');

-- Policy for admins to delete any design
CREATE POLICY "Admins can delete all designs"
ON designs FOR DELETE
USING (auth.jwt() ->> 'role' = 'admin');
```

## Safeguards to Prevent RLS Issues

### 1. Database Migration Safeguards

- **Never disable RLS** on tables containing user data
- **Include policy checks** in migration scripts:

```sql
-- Example of a safe migration that verifies policies exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'designs'
        AND policyname = 'Users can view their own designs'
    ) THEN
        CREATE POLICY "Users can view their own designs"
        ON designs FOR SELECT
        USING (auth.uid() = user_id);

        RAISE NOTICE 'Created missing SELECT policy on designs table';
    END IF;
END
$$;
```

- **Use idempotent migrations** that can be run multiple times without causing errors
- **Version control all migrations** to track changes to RLS policies

### 2. Development Workflow Safeguards

- **Run the RLS verification script** before deploying changes:
  ```bash
  ./scripts/verify-rls-policies.sh
  ```

- **Include RLS policy checks** in your CI/CD pipeline
- **Review RLS policies** as part of code reviews for database changes
- **Test with multiple user accounts** to ensure proper isolation

### 3. Monitoring and Detection

- **Log database access errors** to quickly identify RLS issues
- **Set up alerts** for unusual patterns of permission denied errors
- **Periodically audit RLS policies** to ensure they're correctly configured
- **Use the dashboard diagnostic tools** to check for RLS issues

### 4. Recovery Procedures

If RLS policies are accidentally removed or modified:

1. Run the fix script:
   ```bash
   ./scripts/fix-rls-policies.sh
   ```

2. Or manually apply the SQL from `supabase/migrations/20240603000000_fix_designs_rls.sql`

3. Verify the policies are correctly applied in the Supabase dashboard

## Verification Checklist

Before deploying changes that affect the database, verify:

- [ ] RLS is enabled on all tables containing user data
- [ ] Appropriate policies exist for each table
- [ ] Policies use the correct user ID comparison (e.g., `auth.uid() = user_id`)
- [ ] Policies cover all necessary operations (SELECT, INSERT, UPDATE, DELETE)
- [ ] Changes have been tested with multiple user accounts

## Troubleshooting

If users report they cannot see their designs:

1. Check if RLS is enabled on the designs table:
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'designs';
   ```

2. Verify the necessary policies exist:
   ```sql
   SELECT policyname, permissive, cmd FROM pg_policies WHERE tablename = 'designs';
   ```

3. Check for permission errors in the logs

4. Use the dashboard's "Diagnose Issue" button to get detailed information

5. Apply the fix script if necessary:
   ```bash
   ./scripts/fix-rls-policies.sh
   ```

## Additional Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Our Troubleshooting Guide](./troubleshooting.md)
