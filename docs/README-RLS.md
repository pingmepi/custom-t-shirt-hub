# Row Level Security (RLS) Documentation

## Overview

This directory contains documentation and tools for managing Row Level Security (RLS) in our Supabase database. RLS is a critical security feature that ensures users can only access their own data.

## The "Designs Not Loading" Issue

We encountered an issue where users could authenticate successfully but couldn't access their designs in the dashboard. This was caused by missing or incorrectly configured RLS policies on the designs table.

## Documentation

- [RLS Policy Safeguards](./rls-policy-safeguards.md) - Comprehensive guide to maintaining RLS policies
- [Database Migration Template](./database-migration-template.md) - Template for creating safe database migrations
- [RLS Policy Checklist](./rls-policy-checklist.md) - Checklist for database changes
- [Troubleshooting Guide](./troubleshooting.md) - Guide for diagnosing and fixing RLS issues

## Scripts

- `scripts/verify-rls-policies.sh` - Verifies that necessary RLS policies are in place
- `scripts/fix-rls-policies.sh` - Fixes missing or incorrect RLS policies

## CI/CD Integration

We've added a GitHub Actions workflow (`.github/workflows/verify-rls-policies.yml`) that automatically verifies RLS policies on pull requests that modify database-related files.

## Required RLS Policies

The following policies must be present on the `designs` table:

### User Policies

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

See [Admin User Setup](./admin-user-setup.md) for information on how to set up admin users.

## Best Practices

1. **Always verify RLS policies** before and after database changes
2. **Use the migration template** for all database changes
3. **Include policy checks** in migration scripts
4. **Test with multiple user accounts** to ensure proper isolation
5. **Run the verification script** as part of your development workflow

## Troubleshooting

If users report they cannot see their designs:

1. Check the console logs for specific error messages
2. Use the dashboard's "Diagnose Issue" button to get detailed information
3. Run the verification script to check RLS policies:
   ```bash
   ./scripts/verify-rls-policies.sh
   ```
4. Apply the fix script if necessary:
   ```bash
   ./scripts/fix-rls-policies.sh
   ```

## Additional Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
