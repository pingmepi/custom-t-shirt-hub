# Admin User Setup Guide

This document explains how to set up and manage admin users in the application.

## Overview

Admin users have special privileges that allow them to:
- View all designs regardless of who created them
- Modify any design in the system
- Access admin-only features in the application

## How Admin Access Works

Admin access is implemented through:

1. **Row Level Security (RLS) Policies**: Special policies that grant admins access to all rows in protected tables
2. **JWT Claims**: The user's JWT token contains a 'role' claim that identifies them as an admin
3. **Database Role**: A dedicated 'admin' role in the database with appropriate permissions

## Setting Up an Admin User

### Method 1: Using the Supabase Dashboard

1. Go to the Supabase dashboard
2. Navigate to Authentication > Users
3. Find the user you want to make an admin
4. Click on the user to open their details
5. In the "User Metadata" section, add or modify the JSON to include the admin role:
   ```json
   {
     "role": "admin"
   }
   ```
6. Save the changes

### Method 2: Using SQL

You can also set a user as an admin using SQL in the Supabase SQL Editor:

```sql
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE id = 'user-uuid-here';
```

Replace `user-uuid-here` with the actual UUID of the user.

## Verifying Admin Status

To verify that a user has admin privileges:

1. Log in as the user
2. Open the browser console
3. Run the following code to check the JWT token:
   ```javascript
   const { data: { session } } = await supabase.auth.getSession();
   console.log(session.user.user_metadata);
   ```
4. Verify that the output includes `"role": "admin"`

## Testing Admin Access

To test that admin access is working correctly:

1. Log in as a regular user and create a design
2. Log out and log in as an admin user
3. Navigate to the dashboard
4. Verify that you can see the design created by the regular user
5. Try to edit or delete the design to confirm you have full access

## Troubleshooting

If admin access is not working as expected:

1. **Check JWT Token**: Verify that the JWT token contains the admin role claim
2. **Check RLS Policies**: Run the verification script to ensure admin policies exist:
   ```bash
   ./scripts/verify-rls-policies.sh
   ```
3. **Check Database Role**: Verify that the admin role exists and has the necessary permissions
4. **Check JWT Claim Syntax**: Ensure the policy is using the correct syntax: `auth.jwt() ->> 'role' = 'admin'`

## Security Considerations

- Be very careful about who you grant admin access to
- Regularly audit the list of admin users
- Consider implementing additional safeguards for sensitive operations
- Monitor admin actions through logging and auditing

## Additional Resources

- [Supabase JWT Documentation](https://supabase.com/docs/guides/auth/auth-jwt)
- [PostgreSQL Role Management](https://www.postgresql.org/docs/current/user-manag.html)
- [Our RLS Policy Safeguards](./rls-policy-safeguards.md)
