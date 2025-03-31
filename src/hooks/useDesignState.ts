
import { useState } from "react";
import { TShirtOptions as TShirtOptionsType } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function useDesignState(user: any) {
  const navigate = useNavigate();
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

  const handleQuestionsComplete = (responses: Record<string, any>) => {
    setQuestionResponses(responses);
    setActiveStep("design");
    toast.success("Preferences saved! Let's customize your design.");
  };

  const handleDesignUpdated = (data: any) => {
    setDesignData(data);
  };

  const handleOptionsChange = (options: TShirtOptionsType) => {
    setTshirtOptions(options);
  };

  const handleSaveDesign = async () => {
    if (!user) {
      toast.error("Please login or sign up to save your design");
      navigate("/login");
      return;
    }
    
    try {
      setLoading(true);
      // Save the design to the database
      const { data, error } = await supabase
        .from("designs")
        .insert({
          user_id: user.id,
          question_responses: questionResponses,
          design_data: designData,
          preview_url: "/design-flow.png" // This would be replaced with an actual preview in a real implementation
        });
        
      if (error) throw error;
      
      setIsDesignComplete(true);
      toast.success("Design saved successfully!");
    } catch (error) {
      console.error("Error saving design:", error);
      toast.error("Failed to save design. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login or sign up to add to cart");
      navigate("/login");
      return;
    }
    toast.success("Added to cart successfully!");
  };

  const handleNavigateToStep = (step: string) => {
    if (step === "design" && !Object.keys(questionResponses).length) {
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
    handleQuestionsComplete,
    handleDesignUpdated,
    handleOptionsChange,
    handleSaveDesign,
    handleAddToCart,
    handleNavigateToStep,
    redirectToLogin
  };
}
