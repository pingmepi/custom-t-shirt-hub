# Troubleshooting Guide

## Common Issues

### Unable to load user profile designs

**Symptoms:**
- Dashboard shows "Unable to load user profile designs" error
- User is authenticated but designs don't appear
- Console shows successful authentication but no designs data
- Designs were loading previously but suddenly stopped

**Possible Causes:**
1. **Row Level Security (RLS) policies not applied**: The designs table may have RLS enabled but no policies that allow users to access their own designs.
2. **Authentication token issues**: The JWT token might be valid for authentication but not properly configured for database access.
3. **Database permission issues**: The authenticated user role might not have the necessary permissions on the designs table.
4. **RLS policies were removed or modified**: Sometimes RLS policies can be accidentally removed or modified during database changes.

**Solutions:**

1. **Apply RLS policies**:
   - Run the migration script: `./scripts/fix-rls-policies.sh`
   - Or manually apply the SQL from `supabase/migrations/20240603000000_fix_designs_rls.sql`

2. **Check authentication**:
   - Use the "Diagnose Issue" button on the dashboard to run diagnostic queries
   - Verify in the console that the user ID in the session matches the expected user ID
   - Try logging out and logging back in to refresh your authentication tokens

3. **Verify database permissions**:
   - Ensure the authenticated role has SELECT, INSERT, UPDATE, DELETE permissions on the designs table
   - Check that the user_id column in designs matches the authenticated user's ID

4. **Use the enhanced debugging tools**:
   - The dashboard now includes enhanced debugging tools that can help diagnose RLS issues
   - Click the "Diagnose Issue" button when you encounter the error
   - The diagnostic results will show if the designs table is accessible and if there are any authentication issues

### JWT Token Expired or Invalid

**Symptoms:**
- User is suddenly logged out
- API calls fail with 401 Unauthorized
- Console shows JWT validation errors

**Solutions:**
1. Implement token refresh logic (already done in our auth service)
2. Clear browser storage and log in again
3. Check that the Supabase URL and API key are correct in environment variables

## Debugging Tools

### Dashboard Diagnostic Tool

The dashboard includes a "Diagnose Issue" button that:
1. Tests authentication status
2. Attempts to query the profiles table
3. Attempts to query the designs table
4. Reports detailed results for troubleshooting

### Console Logging

Enhanced console logging has been added to help diagnose issues:
- Authentication state changes are logged
- Database query attempts and results are logged
- Detailed error information is provided

## Security Considerations

When troubleshooting, be aware of these security considerations:
- Don't disable RLS as a quick fix - this would expose all user data
- Don't use the service_role key in client-side code
- Ensure that any diagnostic information is only visible to the affected user
- Remember that JWT tokens in localStorage are vulnerable to XSS attacks
