# RLS Policy Checklist

Use this checklist when making database changes to ensure Row Level Security (RLS) policies are preserved.

## Pre-Change Checklist

Before making database changes:

- [ ] Run the verification script to check current RLS status:
  ```bash
  ./scripts/verify-rls-policies.sh
  ```

- [ ] Document the existing RLS policies for affected tables
- [ ] Create a backup of the database if possible
- [ ] Use the migration template from `docs/database-migration-template.md`

## During Implementation

When implementing database changes:

- [ ] Use transactions to ensure atomic changes
- [ ] Include RLS verification in your migration scripts
- [ ] Never disable RLS without re-enabling it
- [ ] Preserve policy conditions that protect user data
- [ ] Grant appropriate permissions to the authenticated role

## Post-Change Verification

After applying database changes:

- [ ] Run the verification script again:
  ```bash
  ./scripts/verify-rls-policies.sh
  ```

- [ ] Verify in the Supabase dashboard that policies exist
- [ ] Test with multiple user accounts to ensure proper isolation
- [ ] Check that users can access only their own data
- [ ] Verify the dashboard loads designs correctly

## Required Policies

The following policies must exist on the designs table:

### User Policies

| Policy Name | Operation | Condition |
|-------------|-----------|-----------|
| Users can view their own designs | SELECT | auth.uid() = user_id |
| Users can insert their own designs | INSERT | auth.uid() = user_id |
| Users can update their own designs | UPDATE | auth.uid() = user_id |
| Users can delete their own designs | DELETE | auth.uid() = user_id |

### Admin Policies

| Policy Name | Operation | Condition |
|-------------|-----------|-----------|
| Admins can view all designs | SELECT | auth.jwt() ->> 'role' = 'admin' |
| Admins can insert all designs | INSERT | auth.jwt() ->> 'role' = 'admin' |
| Admins can update all designs | UPDATE | auth.jwt() ->> 'role' = 'admin' |
| Admins can delete all designs | DELETE | auth.jwt() ->> 'role' = 'admin' |

## Recovery Procedure

If RLS policies are missing:

1. Run the fix script:
   ```bash
   ./scripts/fix-rls-policies.sh
   ```

2. Verify the fix was successful:
   ```bash
   ./scripts/verify-rls-policies.sh
   ```

3. Document the incident and update procedures if necessary
