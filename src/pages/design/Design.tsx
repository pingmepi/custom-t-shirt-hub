
import { useNavigate } from "react-router-dom";
import { useState } from "react";
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
    handleQuestionsComplete,
    handleDesignUpdated,
    handleOptionsChange,
    handleSaveDesign,
    handleAddToCart,
    handleNavigateToStep,
    redirectToLogin
  } = useDesignState();
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);

  const handleThemeSelect = (themes: string[]) => {
    setSelectedThemes(themes);
  };

  const renderStepContent = () => {
    // For some design steps, we require authentication
    if (activeStep === "design" && !isAuthenticated) {
      return <LoginRequired redirectToLogin={redirectToLogin} />;
    }

    switch (activeStep) {
      case "themes":
        return (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Select Themes</h2>
            {/* Theme selection component would go here */}
          </div>
        );
      case "questions":
        return (
          <QuestionsStepContent
            selectedThemes={selectedThemes}
            onComplete={handleQuestionsComplete}
          />
        );
      case "design":
        return (
          <DesignStepContent
            questionResponses={questionResponses}
            onDesignUpdate={handleDesignUpdated}
            onSaveDesign={handleSaveDesign}
          />
        );
      case "options":
        return (
          <OptionsStepContent
            tshirtOptions={tshirtOptions}
            onOptionsChange={handleOptionsChange}
            onAddToCart={handleAddToCart}
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
        onStepClick={handleNavigateToStep}
      />
      <div className="mt-8">{renderStepContent()}</div>
    </div>
  );
};

export default DesignPage;
