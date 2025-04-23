#!/bin/bash

# Script to verify RLS policies in the Supabase database
# This script checks if the necessary RLS policies are in place

echo "Verifying RLS policies in Supabase database..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI is not installed. Please install it first."
    echo "See: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Function to run SQL and return the result
run_sql() {
    local sql="$1"
    supabase db query --db-url "$SUPABASE_DB_URL" --password "$SUPABASE_DB_PASSWORD" "$sql"
}

# Check if RLS is enabled on important tables
echo "Checking if RLS is enabled on important tables..."
RLS_CHECK=$(run_sql "SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('designs', 'profiles', 'orders');")

echo "$RLS_CHECK"

# Check if necessary policies exist
echo -e "\nChecking if necessary policies exist..."
POLICY_CHECK=$(run_sql "SELECT tablename, policyname, cmd, permissive FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('designs', 'profiles', 'orders');")

echo "$POLICY_CHECK"

# Verify specific policies for designs table
echo -e "\nVerifying specific policies for designs table..."
DESIGNS_POLICIES=$(run_sql "SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'designs';")

# Check for required policies
REQUIRED_POLICIES=(
    "Users can view their own designs"
    "Users can insert their own designs"
    "Users can update their own designs"
    "Users can delete their own designs"
    "Admins can view all designs"
    "Admins can insert all designs"
    "Admins can update all designs"
    "Admins can delete all designs"
)

MISSING_POLICIES=()
for policy in "${REQUIRED_POLICIES[@]}"; do
    if ! echo "$DESIGNS_POLICIES" | grep -q "$policy"; then
        MISSING_POLICIES+=("$policy")
    fi
done

if [ ${#MISSING_POLICIES[@]} -eq 0 ]; then
    echo -e "\n✅ All required policies are present on the designs table."
else
    echo -e "\n❌ The following required policies are missing from the designs table:"
    for policy in "${MISSING_POLICIES[@]}"; do
        echo "   - $policy"
    done
    echo -e "\nTo fix this issue, run: ./scripts/fix-rls-policies.sh"
fi

# Check permissions for authenticated role
echo -e "\nChecking permissions for authenticated role..."
PERMISSIONS_CHECK=$(run_sql "SELECT grantee, table_name, privilege_type FROM information_schema.role_table_grants WHERE grantee = 'authenticated' AND table_name IN ('designs', 'profiles', 'orders');")

echo "$PERMISSIONS_CHECK"

# Check permissions for admin role
echo -e "\nChecking permissions for admin role..."
ADMIN_PERMISSIONS_CHECK=$(run_sql "SELECT grantee, table_name, privilege_type FROM information_schema.role_table_grants WHERE grantee = 'admin' AND table_name IN ('designs', 'profiles', 'orders');")

echo "$ADMIN_PERMISSIONS_CHECK"

# Check if admin role exists
echo -e "\nVerifying admin role exists..."
ADMIN_ROLE_CHECK=$(run_sql "SELECT rolname FROM pg_roles WHERE rolname = 'admin';")

echo "$ADMIN_ROLE_CHECK"

# Summary
echo -e "\n=== Summary ==="
if [ ${#MISSING_POLICIES[@]} -eq 0 ]; then
    echo "✅ RLS policies are correctly configured."
else
    echo "❌ Some required RLS policies are missing. Run ./scripts/fix-rls-policies.sh to fix."
fi

# Provide instructions for manual verification
echo -e "\nTo manually verify in the Supabase dashboard:"
echo "1. Go to Authentication > Policies"
echo "2. Check that the designs table has the following policies:"
echo "   User policies:"
echo "   - Users can view their own designs"
echo "   - Users can insert their own designs"
echo "   - Users can update their own designs"
echo "   - Users can delete their own designs"
echo ""
echo "   Admin policies:"
echo "   - Admins can view all designs"
echo "   - Admins can insert all designs"
echo "   - Admins can update all designs"
echo "   - Admins can delete all designs"
echo ""
echo "3. Verify that user policies use 'auth.uid() = user_id' as the condition"
echo "4. Verify that admin policies use 'auth.jwt() ->> ''role'' = ''admin''' as the condition"
