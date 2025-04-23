#!/bin/bash

# Script to fix RLS policies in the Supabase database
# This script applies the latest migration to fix RLS policies

echo "Applying RLS policy fixes to Supabase database..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI is not installed. Please install it first."
    echo "See: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Apply the latest migration
echo "Applying migration: 20240603000000_fix_designs_rls.sql"
supabase db push --db-url "$SUPABASE_DB_URL" --password "$SUPABASE_DB_PASSWORD"

if [ $? -eq 0 ]; then
    echo "✅ RLS policies successfully applied!"
else
    echo "❌ Failed to apply RLS policies. Please check the error message above."
    echo "You may need to apply the migration manually through the Supabase dashboard."
    echo "SQL file: supabase/migrations/20240603000000_fix_designs_rls.sql"
fi

echo ""
echo "To verify the policies are working:"
echo "1. Open the Supabase dashboard"
echo "2. Go to Authentication > Policies"
echo "3. Check that the designs table has the following policies:"
echo "   - Users can view their own designs"
echo "   - Users can insert their own designs"
echo "   - Users can update their own designs"
echo "   - Users can delete their own designs"
echo ""
echo "If the policies are not listed, you may need to apply them manually."
