import { supabase } from "@/integrations/supabase/client";

/**
 * Debug utility to check Supabase connection and query capabilities
 * This helps diagnose issues with authentication, RLS policies, and database access
 */
export const debugSupabaseQuery = async (userId: string | undefined) => {
  console.log("[DebugUtils] Starting Supabase query debug");
  
  // Check authentication status
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error("[DebugUtils] Session error:", sessionError);
    return { success: false, error: sessionError };
  }
  
  if (!sessionData.session) {
    console.error("[DebugUtils] No active session found");
    return { success: false, error: "No active session" };
  }
  
  console.log("[DebugUtils] Active session found for user:", sessionData.session.user.id);
  
  // Check if we can access the profiles table
  try {
    console.log("[DebugUtils] Attempting to query profiles table");
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name")
      .eq("id", sessionData.session.user.id)
      .single();
    
    if (profileError) {
      console.error("[DebugUtils] Profile query error:", profileError);
      return { success: false, error: profileError };
    }
    
    console.log("[DebugUtils] Successfully queried profiles table:", profileData);
  } catch (error) {
    console.error("[DebugUtils] Exception querying profiles:", error);
    return { success: false, error };
  }
  
  // Check if we can access the designs table
  try {
    console.log("[DebugUtils] Attempting to query designs table");
    const { data: designsData, error: designsError } = await supabase
      .from("designs")
      .select("id, created_at")
      .eq("user_id", userId || sessionData.session.user.id)
      .limit(1);
    
    if (designsError) {
      console.error("[DebugUtils] Designs query error:", designsError);
      return { success: false, error: designsError };
    }
    
    console.log("[DebugUtils] Successfully queried designs table:", designsData);
    return { success: true, data: { designs: designsData, userId: sessionData.session.user.id } };
  } catch (error) {
    console.error("[DebugUtils] Exception querying designs:", error);
    return { success: false, error };
  }
};
