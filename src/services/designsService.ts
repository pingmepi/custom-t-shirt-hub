import { supabase } from "@/integrations/supabase/client";
import { TShirtDesign } from "@/lib/types";
import { toast } from "sonner";

/**
 * Fetch all designs for a specific user
 * @param userId The user ID to fetch designs for
 * @returns Array of designs or empty array if none found
 */
export const fetchUserDesigns = async (userId: string): Promise<TShirtDesign[]> => {
  console.log("[DesignsService] Fetching designs for user:", userId);
  console.log("[DesignsService] !");
  const response = await supabase
    .from('profiles')
    .select('*').single();
  console.log(response);

  if (!userId) {
    console.error("[DesignsService] No user ID provided");
    return [];
  }
  
  try {
    // First, verify the session is valid
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error("[DesignsService] Session error:", sessionError);
      throw new Error("Authentication error: " + sessionError.message);
    }
    
    if (!sessionData.session) {
      console.error("[DesignsService] No active session");
      throw new Error("No active session");
    }
    

    // Attempt to fetch designs
    const { data, error } = await supabase
      .from('designs')
      .select('id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("[DesignsService] Error fetching designs:", error);
      
      // Check for specific error types
      if (error.code === 'PGRST301' || error.message.includes('JWT')) {
        console.log("[DesignsService] JWT error detected, attempting to refresh session");
        
        // Try refreshing the session
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.error("[DesignsService] Failed to refresh session:", refreshError);
          throw new Error("Session refresh failed: " + refreshError.message);
        }
        
        if (!refreshData.session) {
          console.error("[DesignsService] No session after refresh");
          throw new Error("Session refresh failed: No session returned");
        }
        
        // Retry the query with the refreshed session
        console.log("[DesignsService] Retrying query with refreshed session");
        const { data: retryData, error: retryError } = await supabase
          .from('designs')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (retryError) {
          console.error("[DesignsService] Error fetching designs after refresh:", retryError);
          throw new Error("Failed to fetch designs after session refresh: " + retryError.message);
        }
        
        console.log("[DesignsService] Successfully fetched designs after refresh:", retryData?.length || 0);
        return retryData as TShirtDesign[] || [];
      }
      
      // For RLS policy issues
      if (error.code === 'PGRST116' || error.message.includes('permission denied')) {
        console.error("[DesignsService] Permission denied. Possible RLS policy issue.");
        throw new Error("Permission denied. Please check database permissions.");
      }
      
      throw new Error("Failed to fetch designs: " + error.message);
    }
    
    console.log("[DesignsService] Successfully fetched designs:", data?.length || 0);
    return data as TShirtDesign[] || [];
  } catch (error: any) {
    console.error("[DesignsService] Exception in fetchUserDesigns:", error);
    throw error;
  }
};

/**
 * Fetch a single design by ID
 * @param designId The design ID to fetch
 * @param userId Optional user ID for verification
 * @returns The design or null if not found
 */
export const fetchDesignById = async (designId: string, userId?: string): Promise<TShirtDesign | null> => {
  console.log("[DesignsService] Fetching design by ID:", designId);
  
  if (!designId) {
    console.error("[DesignsService] No design ID provided");
    return null;
  }
  
  try {
    // First, verify the session is valid
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("[DesignsService] Session error:", sessionError);
      throw new Error("Authentication error: " + sessionError.message);
    }
    
    if (!sessionData.session) {
      console.error("[DesignsService] No active session");
      throw new Error("No active session");
    }
    
    // Build the query
    let query = supabase
      .from('designs')
      .select('*')
      .eq('id', designId);
    
    // If userId is provided, add it to the query for additional security
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    // Execute the query
    const { data, error } = await query.single();
    
    if (error) {
      console.error("[DesignsService] Error fetching design:", error);
      
      // Check for specific error types
      if (error.code === 'PGRST301' || error.message.includes('JWT')) {
        console.log("[DesignsService] JWT error detected, attempting to refresh session");
        
        // Try refreshing the session
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.error("[DesignsService] Failed to refresh session:", refreshError);
          throw new Error("Session refresh failed: " + refreshError.message);
        }
        
        if (!refreshData.session) {
          console.error("[DesignsService] No session after refresh");
          throw new Error("Session refresh failed: No session returned");
        }
        
        // Retry the query with the refreshed session
        console.log("[DesignsService] Retrying query with refreshed session");
        const { data: retryData, error: retryError } = await query.single();
        
        if (retryError) {
          console.error("[DesignsService] Error fetching design after refresh:", retryError);
          throw new Error("Failed to fetch design after session refresh: " + retryError.message);
        }
        
        console.log("[DesignsService] Successfully fetched design after refresh");
        return retryData as TShirtDesign;
      }
      
      // For RLS policy issues
      if (error.code === 'PGRST116' || error.message.includes('permission denied')) {
        console.error("[DesignsService] Permission denied. Possible RLS policy issue.");
        throw new Error("Permission denied. Please check database permissions.");
      }
      
      // For not found
      if (error.code === 'PGRST116') {
        console.log("[DesignsService] Design not found");
        return null;
      }
      
      throw new Error("Failed to fetch design: " + error.message);
    }
    
    console.log("[DesignsService] Successfully fetched design");
    return data as TShirtDesign;
  } catch (error: any) {
    console.error("[DesignsService] Exception in fetchDesignById:", error);
    throw error;
  }
};

/**
 * Check if the designs table is accessible
 * This can help diagnose issues with RLS policies
 */
export const checkDesignsTableAccess = async (): Promise<boolean> => {
  // return true;
  try {
    console.log("[DesignsService] Checking designs table access");
    
    // First, verify the session is valid
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      console.error("[DesignsService] No valid session for table access check");
      return false;
    }
    
    // Try a simple count query to check access
    const { count, error } = await supabase
      .from('designs')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error("[DesignsService] Error checking designs table access:", error);
      return false;
    }
    
    console.log("[DesignsService] Designs table is accessible, count:", count);
    return true;
  } catch (error) {
    console.error("[DesignsService] Exception checking designs table access:", error);
    return false;
  }
};
