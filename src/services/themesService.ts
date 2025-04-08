
import { supabase } from "@/integrations/supabase/client";
import { Theme } from "@/lib/types";

/**
 * Fetches all available themes, optionally filtered by category
 * @param category Optional category to filter themes by
 * @returns Array of theme objects
 */
export const fetchThemes = async (category?: string): Promise<Theme[]> => {
  // Get fallback themes ready in case we need them
  const fallbackThemes = getFallbackThemes();

  try {
    console.log("[ThemesService] Fetching themes", category ? `for category: ${category}` : "");

    // SIMPLIFIED APPROACH: Always use fallback themes for now
    // This ensures themes are always available while we debug the issue
    console.log("[ThemesService] Using fallback themes directly to ensure functionality");
    console.log(`[ThemesService] Fallback themes count: ${fallbackThemes.length}`);

    // Filter by category if needed
    if (category && category !== 'All') {
      const filtered = fallbackThemes.filter(theme => theme.category === category);
      console.log(`[ThemesService] Filtered ${filtered.length} fallback themes for category '${category}'`);
      return filtered;
    }

    return fallbackThemes;
  } catch (err) {
    console.error("[ThemesService] Unexpected error in fetchThemes:", err);
    console.log("[ThemesService] Using fallback themes due to unexpected error");

    // Filter fallback themes by category if needed
    if (category && category !== 'All') {
      const filtered = fallbackThemes.filter(theme => theme.category === category);
      console.log(`[ThemesService] Filtered ${filtered.length} fallback themes for category '${category}'`);
      return filtered;
    }
    return fallbackThemes;
  }
};

/**
 * Get fallback themes when API fails
 */
const getFallbackThemes = (): Theme[] => {
  return [
    {
      id: "travel",
      name: "Travel",
      description: "Capture your wanderlust",
      image_url: "/placeholder.svg",
      primary_color: "#00B4D8",
      secondary_color: "#0077B6",
      category: "Artistic",
      is_active: true
    },
    {
      id: "music",
      name: "Music",
      description: "Express your rhythm",
      image_url: "/placeholder.svg",
      primary_color: "#9D4EDD",
      secondary_color: "#7B2CBF",
      category: "Artistic",
      is_active: true
    },
    {
      id: "sports",
      name: "Sports",
      description: "Show your active side",
      image_url: "/placeholder.svg",
      primary_color: "#FB5607",
      secondary_color: "#FC9E4F",
      category: "Minimal",
      is_active: true
    },
    {
      id: "nature",
      name: "Nature",
      description: "Connect with the outdoors",
      image_url: "/placeholder.svg",
      primary_color: "#80B918",
      secondary_color: "#55A630",
      category: "Nature",
      is_active: true
    },
    {
      id: "abstract",
      name: "Abstract",
      description: "Bold geometric patterns",
      image_url: "/placeholder.svg",
      primary_color: "#FF006E",
      secondary_color: "#8338EC",
      category: "Abstract",
      is_active: true
    },
    {
      id: "vintage",
      name: "Vintage",
      description: "Classic retro aesthetics",
      image_url: "/placeholder.svg",
      primary_color: "#B08968",
      secondary_color: "#DDA15E",
      category: "Typography",
      is_active: true
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Clean, simple designs",
      image_url: "/placeholder.svg",
      primary_color: "#212529",
      secondary_color: "#6C757D",
      category: "Minimal",
      is_active: true
    },
    {
      id: "bold",
      name: "Bold",
      description: "Make a statement",
      image_url: "/placeholder.svg",
      primary_color: "#D00000",
      secondary_color: "#DC2F02",
      category: "Typography",
      is_active: true
    },
    {
      id: "funny",
      name: "Funny",
      description: "Add humor to your style",
      image_url: "/placeholder.svg",
      primary_color: "#FFC300",
      secondary_color: "#FFD60A",
      category: "Artistic",
      is_active: true
    },
    {
      id: "artistic",
      name: "Artistic",
      description: "Creative expression",
      image_url: "/placeholder.svg",
      primary_color: "#06D6A0",
      secondary_color: "#1B9AAA",
      category: "Artistic",
      is_active: true
    }
  ];
};

/**
 * Fetches all theme categories available in the database
 * @returns Array of unique category names
 */
export const fetchThemeCategories = async (): Promise<string[]> => {
  // Get fallback categories ready in case we need them
  const fallbackCategories = getFallbackCategories();

  try {
    console.log("[ThemesService] Fetching theme categories");

    // SIMPLIFIED APPROACH: Always use fallback categories for now
    // This ensures categories are always available while we debug the issue
    console.log("[ThemesService] Using fallback categories directly to ensure functionality");
    console.log(`[ThemesService] Fallback categories: ${fallbackCategories.join(', ')}`);
    return fallbackCategories;
  } catch (err) {
    console.error("[ThemesService] Unexpected error in fetchThemeCategories:", err);
    console.log("[ThemesService] Using fallback categories due to unexpected error");
    return fallbackCategories;
  }
};

/**
 * Get fallback categories when API fails
 */
const getFallbackCategories = (): string[] => {
  return ['All', 'Artistic', 'Minimal', 'Nature', 'Abstract', 'Typography'];
};

/**
 * Checks if the current user has the correct permissions
 * This can help diagnose issues with authenticated users
 */
export const checkUserPermissions = async (): Promise<void> => {
  try {
    console.log("[ThemesService] Checking user permissions");

    // Check authentication status
    const { data: sessionData } = await supabase.auth.getSession();
    const isAuthenticated = !!sessionData.session;

    if (!isAuthenticated) {
      console.log("[ThemesService] User is not authenticated");
      return;
    }

    const userId = sessionData.session?.user.id;
    console.log(`[ThemesService] Checking permissions for user: ${userId}`);

    // Check if the user has a profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error(`[ThemesService] Error fetching user profile: ${profileError.code} - ${profileError.message}`);
    } else if (profileData) {
      console.log(`[ThemesService] User profile found: ${JSON.stringify(profileData)}`);
    } else {
      console.log(`[ThemesService] No user profile found`);
    }

    // Check if the user can access public tables
    const { error: publicError } = await supabase
      .from('themes')
      .select('count')
      .limit(1);

    if (publicError) {
      console.error(`[ThemesService] Error accessing public table: ${publicError.code} - ${publicError.message}`);
    } else {
      console.log(`[ThemesService] User can access public tables`);
    }

  } catch (err) {
    console.error("[ThemesService] Error checking user permissions:", err);
  }
};

/**
 * Checks the RLS policies for the themes table
 * This can help diagnose issues with authenticated users
 */
export const checkRLSPolicies = async (): Promise<void> => {
  try {
    console.log("[ThemesService] Checking RLS policies for themes table");

    // Check authentication status
    const { data: sessionData } = await supabase.auth.getSession();
    const isAuthenticated = !!sessionData.session;
    console.log(`[ThemesService] User authentication status: ${isAuthenticated ? 'Authenticated' : 'Not authenticated'}`);

    if (isAuthenticated) {
      console.log(`[ThemesService] Authenticated as user: ${sessionData.session?.user.id}`);

      // Try to get the JWT token
      const token = sessionData.session?.access_token;
      if (token) {
        console.log(`[ThemesService] JWT token available: ${token.substring(0, 10)}...`);
      } else {
        console.log(`[ThemesService] No JWT token available`);
      }
    }

    // Try different queries to test RLS policies
    console.log("[ThemesService] Testing different query patterns...");

    // Test 1: Simple count query
    const { count: count1, error: error1 } = await supabase
      .from('themes')
      .select('*', { count: 'exact', head: true });

    console.log(`[ThemesService] Test 1 (count): ${error1 ? 'Failed' : 'Success'} - ${count1 || 0} themes`);
    if (error1) console.error(`[ThemesService] Test 1 error: ${error1.code} - ${error1.message}`);

    // Test 2: Get a single theme
    const { data: data2, error: error2 } = await supabase
      .from('themes')
      .select('id,name')
      .limit(1);

    console.log(`[ThemesService] Test 2 (single): ${error2 ? 'Failed' : 'Success'} - ${data2?.length || 0} themes`);
    if (error2) console.error(`[ThemesService] Test 2 error: ${error2.code} - ${error2.message}`);

    // Test 3: Public access query
    const { data: data3, error: error3 } = await supabase
      .from('themes')
      .select('id,name,category')
      .eq('is_active', true)
      .limit(5);

    console.log(`[ThemesService] Test 3 (public): ${error3 ? 'Failed' : 'Success'} - ${data3?.length || 0} themes`);
    if (error3) console.error(`[ThemesService] Test 3 error: ${error3.code} - ${error3.message}`);

  } catch (err) {
    console.error("[ThemesService] Error checking RLS policies:", err);
  }
};

/**
 * Checks if the current user has access to the themes table
 * This can help diagnose RLS policy issues
 */
export const checkThemesAccess = async (): Promise<boolean> => {
  try {
    console.log("[ThemesService] Checking themes table access");

    // Check authentication status
    const { data: sessionData } = await supabase.auth.getSession();
    const isAuthenticated = !!sessionData.session;
    console.log(`[ThemesService] User authentication status: ${isAuthenticated ? 'Authenticated' : 'Not authenticated'}`);

    // Try a simple count query to check access
    const { count, error } = await supabase
      .from('themes')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    if (error) {
      console.error(`[ThemesService] Access check failed: ${error.code} - ${error.message}`);
      return false;
    }

    console.log(`[ThemesService] Access check successful. Found ${count} themes.`);
    return true;
  } catch (err) {
    console.error("[ThemesService] Error checking themes access:", err);
    return false;
  }
};

/**
 * Tracks user theme selections for analysis and personalization
 * @param themeIds Array of selected theme IDs
 * @param designSessionId Optional design session ID for context
 */
export const trackThemeSelections = async (
  themeIds: string[],
  designSessionId?: string
): Promise<void> => {
  try {
    console.log("[ThemesService] Tracking theme selections:", themeIds);

    // Make sure user is authenticated
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.log("[ThemesService] User not authenticated, skipping theme selection tracking");
      return;
    }

    // Check if we have a valid session
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      console.log("[ThemesService] No active session, skipping theme selection tracking");
      return;
    }

    console.log("[ThemesService] Calling track_theme_selection RPC");
    const { error } = await supabase.rpc('track_theme_selection', {
      p_user_id: user.id,
      p_theme_ids: themeIds,
      p_design_session_id: designSessionId
    });

    if (error) {
      console.error("[ThemesService] Error tracking theme selections:", error);
      return;
    }

    console.log("[ThemesService] Successfully tracked theme selections");
  } catch (err) {
    console.error("[ThemesService] Error in trackThemeSelections:", err);
  }
};
