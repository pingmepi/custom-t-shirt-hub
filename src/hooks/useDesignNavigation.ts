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
    console.log("[useDesignNavigation] handleQuestionsComplete called with responses:", responses);

    // Skip validation for theme selection only responses
    const isThemeSelectionOnly =
      Object.keys(responses).length === 1 &&
      Object.keys(responses)[0] === 'theme_selection';

    // If it's just theme selection, don't navigate yet - we'll show questions first
    if (isThemeSelectionOnly) {
      console.log("[useDesignNavigation] Theme selection only, not navigating yet");
      return true;
    }

    // For regular question responses, validate and navigate
    if (!validateResponses(responses)) {
      console.log("[useDesignNavigation] Response validation failed");
      return false;
    }

    console.log("[useDesignNavigation] Setting activeStep to 'design'");
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
