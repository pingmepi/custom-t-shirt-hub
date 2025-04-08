
import { supabase } from "@/integrations/supabase/client";
import { Theme } from "@/lib/types";

/**
 * Fetches all available themes, optionally filtered by category
 * @param category Optional category to filter themes by
 * @returns Array of theme objects
 */
export const fetchThemes = async (category?: string): Promise<Theme[]> => {
  try {
    console.log("[ThemesService] Fetching themes", category ? `for category: ${category}` : "");

    // First check if we have a session
    const { data: sessionData } = await supabase.auth.getSession();
    console.log("[ThemesService] Session check:", sessionData.session ? "Active session" : "No session");

    // Proceed with query regardless of session (using RLS policies)
    let query = supabase
      .from('themes')
      .select('*')
      .eq('is_active', true);

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    const { data, error } = await query.order('name');

    if (error) {
      console.error("[ThemesService] Error fetching themes:", error);

      // If we get a 401 error, try to use fallback themes
      if (error.code === "PGRST301" || error.code === "401") {
        console.log("[ThemesService] Authentication error, using fallback themes");
        return getFallbackThemes();
      }

      throw new Error("Failed to fetch themes");
    }

    if (!data || data.length === 0) {
      console.log("[ThemesService] No themes found, using fallback themes");
      return getFallbackThemes();
    }

    console.log(`[ThemesService] Successfully fetched ${data.length} themes`);
    return data as Theme[];
  } catch (err) {
    console.error("[ThemesService] Error in fetchThemes:", err);
    return getFallbackThemes();
  }
};

/**
 * Get fallback themes when API fails
 */
const getFallbackThemes = (): Theme[] => {
  return [
    {
      id: "minimal",
      name: "Minimal",
      description: "Clean, simple designs with lots of white space",
      category: "Style",
      primary_color: "#ffffff",
      secondary_color: "#000000",
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: "bold",
      name: "Bold",
      description: "Strong, eye-catching designs with vibrant colors",
      category: "Style",
      primary_color: "#ff0000",
      secondary_color: "#000000",
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: "vintage",
      name: "Vintage",
      description: "Retro-inspired designs with a nostalgic feel",
      category: "Style",
      primary_color: "#f5e1c0",
      secondary_color: "#8b4513",
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: "funny",
      name: "Funny",
      description: "Humorous designs that make people laugh",
      category: "Content",
      primary_color: "#ffff00",
      secondary_color: "#ff00ff",
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: "artistic",
      name: "Artistic",
      description: "Creative, expressive designs with an artistic flair",
      category: "Style",
      primary_color: "#800080",
      secondary_color: "#4b0082",
      is_active: true,
      created_at: new Date().toISOString()
    }
  ];
};

/**
 * Fetches all theme categories available in the database
 * @returns Array of unique category names
 */
export const fetchThemeCategories = async (): Promise<string[]> => {
  try {
    console.log("[ThemesService] Fetching theme categories");

    // First check if we have a session
    const { data: sessionData } = await supabase.auth.getSession();
    console.log("[ThemesService] Session check for categories:", sessionData.session ? "Active session" : "No session");

    const { data, error } = await supabase
      .from('themes')
      .select('category')
      .eq('is_active', true)
      .order('category');

    if (error) {
      console.error("[ThemesService] Error fetching theme categories:", error);

      // If we get a 401 error, use fallback categories
      if (error.code === "PGRST301" || error.code === "401") {
        console.log("[ThemesService] Authentication error, using fallback categories");
        return getFallbackCategories();
      }

      throw new Error("Failed to fetch theme categories");
    }

    if (!data || data.length === 0) {
      console.log("[ThemesService] No categories found, using fallback categories");
      return getFallbackCategories();
    }

    // Extract unique categories
    const categoriesSet = new Set<string>();
    data.forEach(item => {
      if (item.category) {
        categoriesSet.add(item.category);
      }
    });

    const categories = ['All', ...Array.from(categoriesSet)];
    console.log(`[ThemesService] Successfully fetched ${categories.length - 1} categories`);
    return categories;
  } catch (err) {
    console.error("[ThemesService] Error in fetchThemeCategories:", err);
    return getFallbackCategories();
  }
};

/**
 * Get fallback categories when API fails
 */
const getFallbackCategories = (): string[] => {
  return ['All', 'Style', 'Content'];
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
