
import { useState } from "react";
import { DesignData, TShirtOptions as TShirtOptionsType, QuestionResponse } from "@/lib/types";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useDesignAPI } from "@/hooks/useDesignAPI";
import { useDesignNavigation } from "@/hooks/useDesignNavigation";
import { validateAuthentication, validateDesignData } from "@/utils/designValidation";

interface UseDesignStateProps {
  designId?: string;
}

export function useDesignState(props?: UseDesignStateProps) {
  const { designId } = props || {};
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { saveDesign, loading, error } = useDesignAPI();
  const {
    activeStep,
    navigateToStep,
    handleQuestionsComplete: navigationHandleQuestionsComplete,
    redirectToLogin
  } = useDesignNavigation();

  // Local state
  const [questionResponses, setQuestionResponses] = useState<Record<string, QuestionResponse | string>>({});
  const [designData, setDesignData] = useState<DesignData | null>(null);
  const [tshirtOptions, setTshirtOptions] = useState<TShirtOptionsType>({
    color: "#ffffff",
    size: "M",
    quantity: 1,
  });
  const [isDesignComplete, setIsDesignComplete] = useState(false);

  /**
   * Handle completion of the questions step
   */
  const handleQuestionsComplete = (responses: Record<string, QuestionResponse | string>) => {
    console.log("[useDesignState] handleQuestionsComplete called with responses:", responses);

    // Check if this is just a theme selection
    const isThemeSelectionOnly =
      Object.keys(responses).length === 1 &&
      Object.keys(responses)[0] === 'theme_selection';

    // Call the navigation handler
    const success = navigationHandleQuestionsComplete(responses);
    console.log("[useDesignState] navigationHandleQuestionsComplete result:", success);

    if (success) {
      // Store the responses
      setQuestionResponses(responses);
      console.log("[useDesignState] Question responses updated");

      // If this is just theme selection, we might want to do additional handling here
      if (isThemeSelectionOnly) {
        console.log("[useDesignState] Theme selection only, additional handling if needed");
      }
    } else {
      console.log("[useDesignState] Failed to complete questions step");
    }
  };

  /**
   * Handle design updates
   */
  const handleDesignUpdated = (data: DesignData) => {
    if (!data) {
      toast.error("Design data is incomplete");
      return;
    }

    setDesignData(data);
  };

  /**
   * Handle options changes
   */
  const handleOptionsChange = (options: TShirtOptionsType) => {
    setTshirtOptions(options);
  };

  /**
   * Save the design to the database
   */
  const handleSaveDesign = async () => {
    if (!validateAuthentication(isAuthenticated)) {
      redirectToLogin();
      return;
    }

    if (!validateDesignData(designData)) {
      return;
    }

    // Include t-shirt options in user style metadata
    const userStyleMetadata = {
      tshirt_options: tshirtOptions
    };

    const result = await saveDesign({
      userId: user?.id,
      questionResponses,
      designData: designData as DesignData,
      previewUrl: "/design-flow.png", // This would be replaced with an actual preview
      designId, // Pass the designId if we're editing an existing design
      userStyleMetadata // Pass the t-shirt options
    });

    if (result.success) {
      setIsDesignComplete(true);
    }
  };

  /**
   * Add the current design to cart
   */
  const handleAddToCart = () => {
    if (!validateAuthentication(isAuthenticated)) {
      redirectToLogin();
      return;
    }

    if (!validateDesignData(designData)) {
      return;
    }

    toast.success("Added to cart successfully!");
  };

  /**
   * Navigate to a specific step in the design flow
   */
  const handleNavigateToStep = (step: string) => {
    navigateToStep(step as "questions" | "design" | "options", {
      questionResponses,
      designData
    });
  };

  return {
    activeStep,
    questionResponses,
    designData,
    tshirtOptions,
    isDesignComplete,
    loading,
    error,
    handleQuestionsComplete,
    handleDesignUpdated,
    handleOptionsChange,
    handleSaveDesign,
    handleAddToCart,
    handleNavigateToStep,
    redirectToLogin
  };
}
