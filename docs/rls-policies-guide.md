# Row Level Security (RLS) Policies Guide

## Overview

This document explains how Row Level Security (RLS) works in our Supabase database and how to troubleshoot common issues related to data access.

## What is Row Level Security?

Row Level Security (RLS) is a feature in PostgreSQL that allows us to restrict which rows a user can access in a database table. This is essential for multi-tenant applications where users should only see their own data.

## Current RLS Policies

Our application uses the following RLS policies:

### Profiles Table

- Users can only view, insert, and update their own profile data
- The user's ID must match the `id` column in the profiles table

### Designs Table

- Users can only view, insert, update, and delete their own designs
- The user's ID must match the `user_id` column in the designs table

## Common Issues

### "Unable to load user profile designs"

This issue typically occurs when:

1. RLS policies are enabled but not properly configured
2. The user's authentication token is invalid or expired
3. The user doesn't have any designs in the database

### Debugging Steps

1. Check if the user is properly authenticated:
   - Look for a valid session in the browser's local storage
   - Verify that token refresh is working correctly

2. Verify RLS policies are correctly applied:
   - Use the "Diagnose Issue" button on the dashboard to run diagnostic queries
   - Check the console for detailed error messages

3. Ensure the user has the correct permissions:
   - The authenticated user should have the `authenticated` role in Supabase
   - The user's ID should match the `user_id` in the designs table

## Applying RLS Policies

If you need to apply or update RLS policies, you can:

1. Use the Supabase CLI:
   ```bash
   ./scripts/apply-rls-policies.sh
   ```

2. Apply them manually through the Supabase dashboard:
   - Go to the SQL Editor
   - Run the SQL statements from the migration files in `supabase/migrations/`

## Testing RLS Policies

To test if RLS policies are working correctly:

1. Sign in as a test user
2. Create a design
3. Sign out and sign in as a different user
4. Verify that the second user cannot see the first user's designs

## Troubleshooting

If you're still experiencing issues:

1. Check the browser console for specific error messages
2. Use the diagnostic tools in the dashboard
3. Verify that the Supabase client is correctly configured
4. Ensure environment variables are properly set

## Additional Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
