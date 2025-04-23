#!/bin/bash

# Script to apply RLS policies to the Supabase database
# This script should be run after setting up the Supabase CLI

echo "Applying RLS policies to Supabase database..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI is not installed. Please install it first."
    echo "See: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Apply migrations
echo "Applying migrations..."
supabase migration up

# Verify RLS policies
echo "Verifying RLS policies..."
supabase db remote commit

echo "RLS policies applied successfully!"
echo "Note: If you're using a hosted Supabase instance, you may need to apply these policies manually through the Supabase dashboard."
echo "See the SQL files in the supabase/migrations directory for the SQL statements to run."
