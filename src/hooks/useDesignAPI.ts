
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DesignData, QuestionResponse, UserStylePreference } from "@/lib/types";
import { extractPreferences } from "@/utils/designTransformation";
import { designImages } from "@/assets";

interface SaveDesignParams {
  userId: string | undefined;
  questionResponses: Record<string, QuestionResponse | string>;
  designData: DesignData;
  previewUrl?: string;
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
    previewUrl = designImages.designFlow // Using imported image
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
      console.log("Extracted preferences:", preferences);

      // Create metadata object
      const userStyleMetadata: UserStylePreference = {
        color_scheme: preferences.color ? [preferences.color] : undefined,
        style_preference: preferences.style,
        timestamp: new Date().toISOString(),
      };

      // First verify authentication
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        console.error("No valid session found");
        throw new Error("Authentication required");
      }

      // For test user, bypass profile check and creation
      if (userId === "0ad70049-b2a7-4248-a395-811665c971fe") {
        console.log("Test user detected - bypassing profile check");
      } else {
        // For regular users, check for profile
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
      }

      // Serialize data to JSON-compatible formats
      const serializedQuestionResponses = JSON.stringify(questionResponses);
      const serializedDesignData = JSON.stringify(designData);
      const serializedUserStyleMetadata = JSON.stringify(userStyleMetadata);

      console.log("Preparing to insert design into Supabase");

      // Make sure we're authenticated with the correct user
      console.log("Preparing to insert design with user ID:", userId);

      // For test user, completely bypass database operations
      if (userId === "0ad70049-b2a7-4248-a395-811665c971fe") {
        console.log("Using test user - bypassing database operations completely");

        // Generate a mock design ID
        const mockDesignId = "test-design-" + Date.now();

        // Store design data in localStorage for test user
        try {
          const testUserDesigns = JSON.parse(localStorage.getItem('testUserDesigns') || '[]');
          testUserDesigns.push({
            id: mockDesignId,
            user_id: userId,
            question_responses: questionResponses,
            design_data: designData,
            preview_url: previewUrl,
            user_style_metadata: userStyleMetadata,
            name: "My Test Design",
            created_at: new Date().toISOString()
          });
          localStorage.setItem('testUserDesigns', JSON.stringify(testUserDesigns));
          console.log("Saved test user design to localStorage");
        } catch (e) {
          console.error("Failed to save test user design to localStorage:", e);
        }

        // Simulate a delay to make it feel like a real save
        await new Promise(resolve => setTimeout(resolve, 500));

        console.log("Mock design saved with ID:", mockDesignId);
        toast.success("Design saved successfully!");
        return {
          success: true,
          designId: mockDesignId
        };
      }

      // For regular users, use the normal approach
      // Insert the design with all required fields
      console.log("Inserting design into Supabase for regular user");
      const { data, error: supabaseError } = await supabase
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

  return {
    saveDesign,
    fetchBaseDesignImage,
    loading,
    error
  };
}
