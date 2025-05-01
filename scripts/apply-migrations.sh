#!/bin/bash

# Script to apply Supabase database migrations
echo "Running Supabase database migrations..."

# Get the Supabase CLI (or use your existing installation)
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI not found. Please install it first."
    echo "Visit https://supabase.com/docs/guides/cli/getting-started for installation instructions."
    exit 1
fi

# Apply migrations
echo "Applying migrations to your Supabase project..."

# You need to be logged in and have your project reference set up
# If you haven't done this yet, run:
# supabase login
# supabase link --project-ref YOUR_PROJECT_REF

# Apply migrations
supabase db push

echo "Migrations applied successfully!"