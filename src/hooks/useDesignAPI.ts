import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DesignData, QuestionResponse, UserStylePreference } from "@/lib/types";
import { extractPreferences } from "@/utils/designTransformation";

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
    previewUrl = "/design-flow.png" // Default preview
  }: SaveDesignParams): Promise<SaveDesignResult> => {
    if (!userId) {
      setError("User ID is required to save a design");
      return { success: false, error: "User ID is required" };
    }

    try {
      setLoading(true);
      setError(null);
      
      // Extract preferences for metadata
      const preferences = extractPreferences(questionResponses);
      
      // Create metadata object
      const userStyleMetadata: UserStylePreference = {
        color_scheme: preferences.color ? [preferences.color] : undefined,
        style_preference: preferences.style,
        timestamp: new Date().toISOString(),
      };
      
      // Save the design to the database
      const { data, error: supabaseError } = await supabase
        .from("designs")
        .insert({
          user_id: userId,
          question_responses: questionResponses,
          design_data: designData,
          preview_url: previewUrl,
          user_style_metadata: userStyleMetadata
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

  return {
    saveDesign,
    loading,
    error
  };
}
