// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lchamzwbdmqpmabvaqpi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjaGFtendiZG1xcG1hYnZhcXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NDk2NDQsImV4cCI6MjA1OTAyNTY0NH0.6xB_TQjXacVzLUtITx0L9A_OSLaaaarwkujCkLiC958";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);