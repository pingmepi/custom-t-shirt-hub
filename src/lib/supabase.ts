// This file is a compatibility layer to avoid breaking imports
// It re-exports the main Supabase client from the integrations directory

import { supabase } from '@/integrations/supabase/client';

// Re-export the supabase client
export { supabase };

// Log a warning about using the deprecated import path
console.warn(
  '[Deprecated] Importing supabase from "@/lib/supabase" is deprecated. ' +
  'Please update your imports to use "@/integrations/supabase/client" instead.'
);
