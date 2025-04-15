
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DesignData, QuestionResponse, UserStylePreference, TShirtDesign } from "@/lib/types";
import { extractPreferences } from "@/utils/designTransformation";
import { designImages } from "@/assets";

interface SaveDesignParams {
  userId: string | undefined;
  questionResponses: Record<string, QuestionResponse | string>;
  designData: DesignData;
  previewUrl?: string;
  designId?: string; // Optional designId for updating existing designs
  userStyleMetadata?: any; // Optional user style metadata including t-shirt options
}

interface SaveDesignResult {
  success: boolean;
  error?: string;
  designId?: string;
}

export function useDesignAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Saves a design to the database
   */
  const saveDesign = async ({
    userId,
    questionResponses,
    designData,
    previewUrl = designImages.designFlow, // Using imported image
    designId, // Optional designId for updating existing designs
    userStyleMetadata: providedStyleMetadata = {}
  }: SaveDesignParams): Promise<SaveDesignResult> => {
    if (!userId) {
      console.error("User ID is required to save a design");
      setError("User ID is required to save a design");
      return { success: false, error: "User ID is required" };
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      console.error("Invalid UUID format for user ID:", userId);
      setError("Invalid user ID format");
      return { success: false, error: "Invalid user ID format" };
    }

    try {
      console.log("Saving design for user:", userId);
      setLoading(true);
      setError(null);

      // Extract preferences for metadata
      const preferences = extractPreferences(questionResponses);

      // Create metadata object, merging with any provided metadata
      const userStyleMetadata: UserStylePreference = {
        color_scheme: preferences.color ? [preferences.color] : undefined,
        style_preference: preferences.style,
        timestamp: new Date().toISOString(),
        ...providedStyleMetadata // Merge any provided metadata (like t-shirt options)
      };

      // First verify authentication
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        console.error("No valid session found");
        throw new Error("Authentication required");
      }

      // Check for profile
      const { error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .single();

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          // Profile doesn't exist, create one
          const { error: createError } = await supabase
            .from("profiles")
            .insert({
              id: userId,
              full_name: "New User",
              role: "user",
              created_at: new Date().toISOString()
            });

          if (createError) {
            console.error("Failed to create profile:", createError);
            throw new Error("Failed to create user profile");
          }
        } else {
          console.error("Error checking profile:", profileError);
          throw new Error("Failed to verify user profile");
        }
      }

      // Serialize data to JSON-compatible formats
      const serializedQuestionResponses = JSON.stringify(questionResponses);
      const serializedDesignData = JSON.stringify(designData);
      const serializedUserStyleMetadata = JSON.stringify(userStyleMetadata);

      console.log("Preparing to insert design into Supabase");

      // Make sure we're authenticated with the correct user
      console.log("Preparing to insert design with user ID:", userId);

      // Check if we're updating an existing design or creating a new one
      let data: any = null;
      let supabaseError: any = null;

      if (designId) {
        // Update existing design
        console.log(`Updating existing design with ID: ${designId}`);
        const { data: updateData, error: updateError } = await supabase
          .from("designs")
          .update({
            question_responses: serializedQuestionResponses,
            design_data: serializedDesignData,
            preview_url: previewUrl,
            user_style_metadata: serializedUserStyleMetadata,
            updated_at: new Date().toISOString()
          })
          .eq('id', designId)
          .eq('user_id', userId) // Ensure the user owns this design
          .select('id')
          .single();

        data = updateData;
        supabaseError = updateError;
      } else {
        // Insert new design
        console.log("Inserting new design into Supabase for regular user");
        const { data: insertData, error: insertError } = await supabase
          .from("designs")
          .insert({
            user_id: userId,
            question_responses: serializedQuestionResponses,
            design_data: serializedDesignData,
            preview_url: previewUrl,
            user_style_metadata: serializedUserStyleMetadata,
            name: "My Design", // Add a default name as this field is required
            created_at: new Date().toISOString()
          })
          .select('id')
          .single();

        data = insertData;
        supabaseError = insertError;
      }

      if (supabaseError) {
        console.error("Error saving design:", supabaseError);
        setError("Failed to save design. Please try again.");
        toast.error("Failed to save design. Please try again.");
        return {
          success: false,
          error: supabaseError.message
        };
      }

      console.log("Design saved successfully, ID:", data?.id);
      toast.success("Design saved successfully!");
      return {
        success: true,
        designId: data?.id
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      console.error("Error saving design:", err);
      setError(errorMessage);
      toast.error("Failed to save design. Please try again.");
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch design base image based on user responses
   */
  const fetchBaseDesignImage = async (questionResponses: Record<string, QuestionResponse | string>) => {
    try {
      console.log("Fetching base design image based on responses:", questionResponses);
      setLoading(true);
      setError(null);

      // This is a placeholder - in the future this would call your LLM API
      // For now, we'll simulate by returning a placeholder image based on some of the responses

      // Extract some key preferences to choose different placeholder images
      const stylePreference = Object.values(questionResponses).find(
        response => typeof response === 'string' &&
        ['Minimal', 'Vintage', 'Bold', 'Artistic', 'Funny'].includes(response)
      );

      console.log("Style preference detected:", stylePreference);

      // Just for demonstration - map different styles to different placeholder images
      let placeholderImageUrl = designImages.designFlow; // Using imported image

      if (stylePreference === "Minimal") {
        placeholderImageUrl = designImages.placeholder;
      } else if (stylePreference === "Vintage") {
        placeholderImageUrl = designImages.designFlow;
      } else if (stylePreference === "Bold") {
        placeholderImageUrl = designImages.placeholder;
      }

      console.log("Selected placeholder image:", placeholderImageUrl);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Design generated based on your preferences!");
      return placeholderImageUrl;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      console.error("Error generating base design:", err);
      setError(errorMessage);
      toast.error("Failed to generate design. Using default template.");
      return designImages.designFlow; // Using imported image
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch user designs from the database
   * @param userId The ID of the user whose designs to fetch
   * @returns Array of user designs
   */
  const fetchUserDesigns = async (userId: string): Promise<TShirtDesign[]> => {
    if (!userId) {
      setError("User ID is required to fetch designs");
      return [];
    }

    try {
      console.log("[DesignAPI] Fetching designs for user:", userId);
      setLoading(true);
      setError(null);

      // First verify authentication
      const { data: sessionData } = await supabase.auth.getSession();

      // Debug authentication status
      if (sessionData?.session) {
        console.log("[DesignAPI] Session found:", {
          userId: sessionData.session.user.id,
          expiresAt: new Date(sessionData.session.expires_at * 1000).toLocaleString(),
          tokenLength: sessionData.session.access_token.length
        });

        // Test RLS policies by trying to access a different user's designs
        // This should fail if RLS is working correctly
        if (sessionData.session.user.id !== userId) {
          console.log("[DesignAPI] Warning: Attempting to fetch designs for a different user than the authenticated one");
        }
      } else {
        console.error("[DesignAPI] No valid session found when fetching designs");
        throw new Error("Authentication required");
      }

      // Fetch designs from Supabase
      console.log(`[DesignAPI] Querying designs table for user_id: ${userId}`);
      const { data, error } = await supabase
        .from('designs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Debug query results
      if (data) {
        console.log(`[DesignAPI] Query returned ${data.length} designs`);
      }

      if (error) {
        console.error("[DesignAPI] Error fetching designs:", error);
        throw new Error(`Failed to fetch designs: ${error.message}`);
      }

      // Parse the JSON fields in each design
      const parsedDesigns = data?.map(design => {
        try {
          // Parse JSON fields if they're stored as strings
          const questionResponses = typeof design.question_responses === 'string'
            ? JSON.parse(design.question_responses)
            : design.question_responses;

          const designData = typeof design.design_data === 'string'
            ? JSON.parse(design.design_data)
            : design.design_data;

          const userStyleMetadata = typeof design.user_style_metadata === 'string'
            ? JSON.parse(design.user_style_metadata)
            : design.user_style_metadata;

          return {
            ...design,
            question_responses: questionResponses,
            design_data: designData,
            user_style_metadata: userStyleMetadata
          } as TShirtDesign;
        } catch (parseError) {
          console.error("[DesignAPI] Error parsing design data:", parseError);
          // Return the original design if parsing fails
          return design as TShirtDesign;
        }
      }) || [];

      console.log(`[DesignAPI] Successfully fetched ${parsedDesigns.length} designs`);
      return parsedDesigns;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      console.error("[DesignAPI] Error fetching designs:", err);
      setError(errorMessage);
      toast.error("Failed to load your designs. Please try again.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    saveDesign,
    fetchBaseDesignImage,
    fetchUserDesigns,
    loading,
    error
  };
}
