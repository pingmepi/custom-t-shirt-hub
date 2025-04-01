import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginRequired from "@/components/design/LoginRequired";
import DesignStepper from "@/components/design/DesignStepper";
import QuestionsStepContent from "@/components/design/QuestionsStepContent";
import DesignStepContent from "@/components/design/DesignStepContent";
import OptionsStepContent from "@/components/design/OptionsStepContent";
import { supabase } from "@/integrations/supabase/client";
import { useDesignState } from "@/hooks/useDesignState";

const DesignPage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Centralized state management using useDesignState hook
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
    redirectToLogin,
  } = useDesignState(user);

  // Check authentication status
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    fetchUser();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Create Your Custom T-Shirt</h1>
        <p className="text-lg text-gray-600">
          Follow these steps to design a t-shirt that's uniquely yours.
        </p>
      </div>

      {/* Stepper Component */}
      <DesignStepper
        activeStep={activeStep}
        questionResponses={questionResponses}
        designData={designData}
        isDesignComplete={isDesignComplete}
      />

      {/* Conditional Rendering for Login and Tabs */}
      {!user && (activeStep === "design" || activeStep === "options") ? (
        <LoginRequired redirectToLogin={redirectToLogin} />
      ) : (
        <Tabs value={activeStep} onValueChange={handleNavigateToStep}>
          <TabsList className="hidden">
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="design">Design Editor</TabsTrigger>
            <TabsTrigger value="options">Options</TabsTrigger>
          </TabsList>

          {/* Questions Step */}
          <TabsContent value="questions" className="mt-6">
            <QuestionsStepContent onQuestionsComplete={handleQuestionsComplete} />
          </TabsContent>

          {/* Design Step */}
          <TabsContent value="design" className="mt-6">
            <DesignStepContent
              questionResponses={questionResponses}
              onDesignUpdated={handleDesignUpdated}
              onNavigateStep={handleNavigateToStep}
            />
          </TabsContent>

          {/* Options Step */}
          <TabsContent value="options" className="mt-6">
            <OptionsStepContent
              tshirtOptions={tshirtOptions}
              onOptionsChange={handleOptionsChange}
              onSaveDesign={handleSaveDesign}
              onAddToCart={handleAddToCart}
              onNavigateStep={handleNavigateToStep}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default DesignPage;
