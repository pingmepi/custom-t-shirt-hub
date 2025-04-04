import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { validateResponses, validateDesignData } from "@/utils/designValidation";
import { DesignData, QuestionResponse } from "@/lib/types";

type DesignStep = "questions" | "design" | "options";

export function useDesignNavigation() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<DesignStep>("questions");

  /**
   * Navigate to a specific step in the design flow
   */
  const navigateToStep = (
    step: DesignStep, 
    { 
      questionResponses, 
      designData 
    }: { 
      questionResponses: Record<string, QuestionResponse | string>; 
      designData: DesignData | null;
    }
  ) => {
    // Validate navigation based on the target step
    if (step === "design" && Object.keys(questionResponses).length === 0) {
      toast.error("Please complete the questions first");
      return false;
    }
    
    if (step === "options" && !validateDesignData(designData)) {
      toast.error("Please customize your design first");
      return false;
    }
    
    setActiveStep(step);
    return true;
  };

  /**
   * Handle completion of the questions step
   */
  const handleQuestionsComplete = (
    responses: Record<string, QuestionResponse | string>
  ): boolean => {
    if (!validateResponses(responses)) {
      return false;
    }
    
    setActiveStep("design");
    toast.success("Preferences saved! Let's customize your design.");
    return true;
  };

  /**
   * Redirect to login page
   */
  const redirectToLogin = (returnPath: string = "/design") => {
    navigate("/login", { state: { from: returnPath } });
  };

  return {
    activeStep,
    navigateToStep,
    handleQuestionsComplete,
    redirectToLogin
  };
}
