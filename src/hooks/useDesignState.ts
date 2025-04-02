
import { useState } from "react";
import { TShirtOptions as TShirtOptionsType } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function useDesignState() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [activeStep, setActiveStep] = useState<string>("questions");
  const [questionResponses, setQuestionResponses] = useState<Record<string, any>>({});
  const [designData, setDesignData] = useState<any>(null);
  const [tshirtOptions, setTshirtOptions] = useState<TShirtOptionsType>({
    color: "#ffffff",
    size: "M",
    quantity: 1,
  });
  const [isDesignComplete, setIsDesignComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Added by lovable: Validate that data is not empty
  const validateResponses = (responses: Record<string, any>): boolean => {
    if (!responses || Object.keys(responses).length === 0) {
      toast.error("Please answer all questions before proceeding");
      return false;
    }
    
    // Check if any response is empty
    for (const [_, value] of Object.entries(responses)) {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        toast.error("Please provide answers to all questions");
        return false;
      }
    }
    
    return true;
  };

  const handleQuestionsComplete = (responses: Record<string, any>) => {
    if (!validateResponses(responses)) {
      return;
    }
    
    setQuestionResponses(responses);
    setActiveStep("design");
    toast.success("Preferences saved! Let's customize your design.");
  };

  const handleDesignUpdated = (data: any) => {
    if (!data) {
      toast.error("Design data is incomplete");
      return;
    }
    
    setDesignData(data);
  };

  const handleOptionsChange = (options: TShirtOptionsType) => {
    setTshirtOptions(options);
  };

  const handleSaveDesign = async () => {
    if (!isAuthenticated) {
      toast.error("Please login or sign up to save your design");
      navigate("/login");
      return;
    }
    
    if (!designData) {
      toast.error("Please complete your design before saving");
      return;
    }

    // Added by lovable: Extra validation for design data
    if (!validateDesignData(designData)) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Save the design to the database
      const { data, error } = await supabase
        .from("designs")
        .insert({
          user_id: user?.id,
          question_responses: questionResponses,
          design_data: designData,
          preview_url: "/design-flow.png", // This would be replaced with an actual preview in a real implementation
          
          // Added by lovable: Store additional metadata
          user_style_metadata: {
            preferences: extractPreferences(questionResponses),
            timestamp: new Date().toISOString(),
          }
        });
        
      if (error) {
        console.error("Error saving design:", error);
        setError("Failed to save design. Please try again.");
        toast.error("Failed to save design. Please try again.");
        return;
      }
      
      setIsDesignComplete(true);
      toast.success("Design saved successfully!");
    } catch (error) {
      console.error("Error saving design:", error);
      setError("An unexpected error occurred. Please try again.");
      toast.error("Failed to save design. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Added by lovable: Validate design data
  const validateDesignData = (data: any): boolean => {
    if (!data) {
      toast.error("Design data is missing");
      return false;
    }
    
    // Add more specific validations as needed based on your design data structure
    return true;
  };

  // Added by lovable: Extract user preferences from question responses
  const extractPreferences = (responses: Record<string, any>): Record<string, any> => {
    // Map responses to user preferences - can be extended based on specific questions
    const preferences: Record<string, any> = {};
    
    // Extract color preferences
    const colorAnswer = Object.values(responses).find(value => 
      typeof value === 'string' && 
      (value.startsWith('#') || 
       ['red', 'blue', 'green', 'black', 'white', 'yellow', 'purple', 'orange', 'pink', 
        'pastel', 'bright', 'dark', 'light', 'muted'].some(color => 
          value.toLowerCase().includes(color)
       )
      )
    );
    
    if (colorAnswer) {
      preferences.color = colorAnswer;
    }
    
    // Extract style preferences
    const styleAnswer = Object.values(responses).find(value => 
      typeof value === 'string' && 
      ['minimal', 'vintage', 'bold', 'artistic', 'funny', 'modern', 'retro', 
       'classic', 'elegant', 'simple', 'complex'].some(style => 
         value.toLowerCase().includes(style)
      )
    );
    
    if (styleAnswer) {
      preferences.style = styleAnswer;
    }
    
    return preferences;
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login or sign up to add to cart");
      navigate("/login");
      return;
    }
    
    if (!designData) {
      toast.error("Please complete your design before adding to cart");
      return;
    }
    
    toast.success("Added to cart successfully!");
  };

  const handleNavigateToStep = (step: string) => {
    if (step === "design" && Object.keys(questionResponses).length === 0) {
      toast.error("Please complete the questions first");
      return;
    }
    
    if (step === "options" && !designData) {
      toast.error("Please customize your design first");
      return;
    }
    
    setActiveStep(step);
  };

  const redirectToLogin = () => {
    navigate("/login");
  };

  return {
    activeStep,
    questionResponses,
    designData,
    tshirtOptions,
    isDesignComplete,
    loading,
    error, // Added by lovable
    handleQuestionsComplete,
    handleDesignUpdated,
    handleOptionsChange,
    handleSaveDesign,
    handleAddToCart,
    handleNavigateToStep,
    redirectToLogin
  };
}
