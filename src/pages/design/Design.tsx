

import { useEffect, useState } from "react";
import DesignStepper from "@/components/design/DesignStepper";
import QuestionsStepContent from "@/components/design/QuestionsStepContent";
import DesignStepContent from "@/components/design/DesignStepContent";
import OptionsStepContent from "@/components/design/OptionsStepContent";
import { useDesignState } from "@/hooks/useDesignState";
import { useAuth } from "@/context/AuthContext";
import LoginRequired from "@/components/design/LoginRequired";

const DesignPage = () => {
  const {
    activeStep,
    questionResponses,
    designData,
    tshirtOptions,
    isDesignComplete,
    handleQuestionsComplete,
    handleDesignUpdated,
    handleOptionsChange,
    handleSaveDesign,
    handleAddToCart,
    handleNavigateToStep,
    redirectToLogin
  } = useDesignState();

  const { isAuthenticated } = useAuth();
  // Using state to manage selected themes
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);

  // Check for saved answers in sessionStorage after login
  useEffect(() => {
    if (isAuthenticated) {
      const savedAnswers = sessionStorage.getItem('designAnswers');
      if (savedAnswers) {
        // Process the saved answers
        handleQuestionsComplete(JSON.parse(savedAnswers));
        // Remove from session storage
        sessionStorage.removeItem('designAnswers');
      }
    }
  }, [isAuthenticated, handleQuestionsComplete]);

  const renderStepContent = () => {
    // For some design steps, we require authentication
    if (activeStep === "design" && !isAuthenticated) {
      return <LoginRequired redirectToLogin={redirectToLogin} />;
    }

    switch (activeStep) {
      case "questions":
        return (
          <QuestionsStepContent
            selectedThemes={selectedThemes}
            onQuestionsComplete={handleQuestionsComplete}
            onThemesSelected={setSelectedThemes}
          />
        );
      case "design":
        return (
          <DesignStepContent
            questionResponses={questionResponses}
            onDesignUpdated={handleDesignUpdated}
            onNavigateStep={handleNavigateToStep}
            onQuestionsComplete={handleQuestionsComplete}
          />
        );
      case "options":
        return (
          <OptionsStepContent
            tshirtOptions={tshirtOptions}
            onOptionsChange={handleOptionsChange}
            onSaveDesign={handleSaveDesign}
            onAddToCart={handleAddToCart}
            onNavigateStep={handleNavigateToStep}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-center mb-8">Design Your T-Shirt</h1>
      <DesignStepper
        activeStep={activeStep}
        questionResponses={questionResponses}
        designData={designData}
        isDesignComplete={isDesignComplete}
      />
      <div className="mt-8">{renderStepContent()}</div>
    </div>
  );
};

export default DesignPage;
