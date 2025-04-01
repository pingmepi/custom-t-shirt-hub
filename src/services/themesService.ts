
import { supabase } from "@/integrations/supabase/client";
import { Theme } from "@/lib/types";

/**
 * Fetches all available themes, optionally filtered by category
 * @param category Optional category to filter themes by
 * @returns Array of theme objects
 */
export const fetchThemes = async (category?: string): Promise<Theme[]> => {
  try {
    let query = supabase
      .from('themes')
      .select('*')
      .eq('is_active', true);
    
    if (category && category !== 'All') {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) {
      console.error("Error fetching themes:", error);
      throw new Error("Failed to fetch themes");
    }
    
    return data as Theme[];
  } catch (err) {
    console.error("Error in fetchThemes:", err);
    throw err;
  }
};

/**
 * Fetches all theme categories available in the database
 * @returns Array of unique category names
 */
export const fetchThemeCategories = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('themes')
      .select('category')
      .eq('is_active', true)
      .order('category');
    
    if (error) {
      console.error("Error fetching theme categories:", error);
      throw new Error("Failed to fetch theme categories");
    }

    // Extract unique categories
    const categories = Array.from(
      new Set(data.map(item => item.category).filter(Boolean))
    );
    
    return ['All', ...categories] as string[];
  } catch (err) {
    console.error("Error in fetchThemeCategories:", err);
    return ['All'];
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
    const { error } = await supabase.rpc('track_theme_selection', {
      p_theme_ids: themeIds,
      p_design_session_id: designSessionId
    });
    
    if (error) {
      console.error("Error tracking theme selections:", error);
    }
  } catch (err) {
    console.error("Error in trackThemeSelections:", err);
  }
};
