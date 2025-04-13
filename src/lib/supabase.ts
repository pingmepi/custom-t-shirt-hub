import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = 'https://lchamzwbdmqpmabvaqpi.supabase.co';
const supabaseAnonKey = 'your-anon-key'; // Replace with your actual anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'sb-lchamzwbdmqpmabvaqpi-auth-token',
    storage: localStorage,
    autoRefreshToken: true,
  }
});