import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
// import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import DesignStepper from "@/components/design/DesignStepper";
import DesignStepContent from "@/components/design/DesignStepContent";
import OptionsStepContent from "@/components/design/OptionsStepContent";
import { useDesignState } from "@/hooks/useDesignState";
import { DesignData, QuestionResponse, TShirtOptions } from "@/lib/types";
import { Button } from "@/components/ui/button";

const EditDesignPage = () => {
  const { designId } = useParams<{ designId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [designData, setDesignData] = useState<DesignData | null>(null);
  const [questionResponses, setQuestionResponses] = useState<Record<string, QuestionResponse | string>>({});
  const [tshirtOptions, setTshirtOptions] = useState<TShirtOptions>({ color: "#ffffff", size: "M", quantity: 1 });
  const [activeStep, setActiveStep] = useState<"design" | "options">("design");

  const {
    handleDesignUpdated,
    handleOptionsChange,
    handleSaveDesign,
    handleAddToCart,
    redirectToLogin
  } = useDesignState({ designId });

  // Use a ref to track if we've already fetched the design
  const hasFetchedDesign = useRef(false);

  // Fetch the design data when the component mounts
  useEffect(() => {
    // Prevent multiple fetches
    if (hasFetchedDesign.current) return;
    hasFetchedDesign.current = true;
    const fetchDesign = async () => {
      if (!designId) {
        setError("No design ID provided");
        setIsLoading(false);
        return;
      }

      if (!isAuthenticated) {
        redirectToLogin(`/design/${designId}`);
        return;
      }

      try {
        // Check if we have a session
        const { data: sessionData } = await supabase.auth.getSession();

        if (!sessionData.session) {
          console.log("[EditDesign] No active session, redirecting to login");
          redirectToLogin(`/design/${designId}`);
          return;
        }

        // Fetch the design from Supabase
        const { data, error } = await supabase
          .from("designs")
          .select("*")
          .eq("id", designId)
          .eq("user_id", user?.id)
          .single();

        if (error) {
          console.error("[EditDesign] Error fetching design:", error);

          if (error.code === "PGRST116") {
            setError("Design not found or you don't have permission to access it");
          } else {
            setError(`Error fetching design: ${error.message}`);
          }

          setIsLoading(false);
          return;
        }

        if (!data) {
          console.error("[EditDesign] No design data returned");
          setError("Design not found");
          setIsLoading(false);
          return;
        }

        // Parse the JSON data
        try {
          // Check if design_data is already an object or needs parsing
          let parsedDesignData: DesignData;
          if (typeof data.design_data === 'string') {
            parsedDesignData = JSON.parse(data.design_data) as DesignData;
          } else {
            parsedDesignData = data.design_data as DesignData;
          }

          // Check if question_responses is already an object or needs parsing
          let parsedQuestionResponses: Record<string, QuestionResponse | string>;
          if (typeof data.question_responses === 'string') {
            parsedQuestionResponses = JSON.parse(data.question_responses) as Record<string, QuestionResponse | string>;
          } else {
            parsedQuestionResponses = data.question_responses as Record<string, QuestionResponse | string>;
          }

          setDesignData(parsedDesignData);
          setQuestionResponses(parsedQuestionResponses);

          // Try to extract t-shirt options from user_style_metadata
          if (data.user_style_metadata) {
            try {
              const styleMetadata = typeof data.user_style_metadata === 'string'
                ? JSON.parse(data.user_style_metadata)
                : data.user_style_metadata;

              if (styleMetadata.tshirt_options) {
                const options = styleMetadata.tshirt_options;
                // Validate the options
                if (options.color && options.size && options.quantity) {
                  setTshirtOptions({
                    color: options.color,
                    size: options.size as TShirtOptions['size'],
                    quantity: options.quantity
                  });
                }
              }
            } catch (err) {
              console.error("[EditDesign] Error parsing t-shirt options:", err);
            }
          }

          // Design data parsed successfully
        } catch (parseError) {
          console.error("[EditDesign] Error parsing design data:", parseError);
          setError("Error parsing design data");
        }
      } catch (err) {
        console.error("[EditDesign] Exception fetching design:", err);
        setError("An unexpected error occurred while fetching the design");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDesign();
  }, [designId, isAuthenticated, user?.id, redirectToLogin]);

  const handleNavigateToStep = (step: "design" | "options") => {
    setActiveStep(step);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-brand-green mr-2" />
        <span>Loading design...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-red-700 mb-4">Error Loading Design</h1>
          <p className="text-red-600 mb-6">{error}</p>
          <Button onClick={handleBackToDashboard}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-center mb-8">Edit Your Design</h1>

      <DesignStepper
        activeStep={activeStep}
        questionResponses={questionResponses}
        designData={designData}
        isDesignComplete={false}
        editMode={true}
      />

      <div className="mt-8">
        {activeStep === "design" ? (
          <DesignStepContent
            questionResponses={questionResponses}
            onDesignUpdated={handleDesignUpdated}
            onNavigateStep={handleNavigateToStep}
            onQuestionsComplete={() => {}}
            initialDesignData={designData}
          />
        ) : (
          <OptionsStepContent
            tshirtOptions={tshirtOptions}
            onOptionsChange={handleOptionsChange}
            onSaveDesign={handleSaveDesign}
            onAddToCart={handleAddToCart}
            onNavigateStep={handleNavigateToStep}
          />
        )}
      </div>
    </div>
  );
};

export default EditDesignPage;
