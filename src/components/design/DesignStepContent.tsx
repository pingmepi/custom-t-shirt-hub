
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import DesignCanvas from "@/components/design/DesignCanvas";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoginRequired from "./LoginRequired";
import { useDesignAPI } from "@/hooks/useDesignAPI";
import { DesignData, QuestionResponse } from "@/lib/types";
import { designImages } from "@/assets";

interface DesignStepContentProps {
  questionResponses: Record<string, QuestionResponse | string>;
  onDesignUpdated: (data: DesignData) => void;
  onNavigateStep: (step: string) => void;
  onQuestionsComplete: (responses: Record<string, QuestionResponse | string>) => void;
}

const DesignStepContent = ({
  questionResponses,
  onDesignUpdated,
  onNavigateStep,
  onQuestionsComplete
}: DesignStepContentProps) => {
  const [designData, setDesignData] = useState<DesignData | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { fetchBaseDesignImage } = useDesignAPI();

  const handleDesignUpdated = useCallback((data: DesignData) => {
    setDesignData(data);
    onDesignUpdated(data);

    toast({
      title: "Design updated",
      description: "Your design has been updated successfully.",
    });
  }, [onDesignUpdated, toast]);

  const redirectToLogin = () => {
    sessionStorage.setItem('currentDesignState', JSON.stringify({
      questionResponses,
      designData
    }));
    navigate("/login", { state: { from: "/design" } });
  };

  // Generate base image based on user's responses
  useEffect(() => {
    const generateBaseImage = async () => {
      // Only generate if we have question responses and no image already
      if (Object.keys(questionResponses).length > 0 && !generatedImageUrl) {
        setIsGeneratingImage(true);
        try {
          const imageUrl = await fetchBaseDesignImage(questionResponses);
          setGeneratedImageUrl(imageUrl);
        } catch (error) {
          console.error("Error generating image:", error);
          toast({
            title: "Generation error",
            description: "Failed to generate your design. Using a default template.",
            variant: "destructive",
          });
          setGeneratedImageUrl(designImages.designFlow); // Using imported image
        } finally {
          setIsGeneratingImage(false);
        }
      }
    };

    generateBaseImage();
  }, [questionResponses, fetchBaseDesignImage, generatedImageUrl, toast]);

  useEffect(() => {
    if (isAuthenticated) {
      const savedState = sessionStorage.getItem('currentDesignState');
      if (savedState) {
        const { questionResponses: savedResponses, designData: savedDesign } = JSON.parse(savedState);
        if (savedResponses) onQuestionsComplete(savedResponses);
        if (savedDesign) handleDesignUpdated(savedDesign);
        sessionStorage.removeItem('currentDesignState');
      }
    }
  }, [isAuthenticated, onQuestionsComplete, handleDesignUpdated]);

  if (!isAuthenticated) {
    return <LoginRequired redirectToLogin={redirectToLogin} />;
  }

  // Get question text mappings for display
  const getDisplayResponses = () => {
    // Process each question response for display
    return Object.entries(questionResponses).map(([questionId, answer]) => {
      // Determine question label based on answer content and question ID patterns
      let questionText = '';

      if (questionId.startsWith('q')) {
        // Handle hardcoded questions
        if (questionId === 'q1') {
          questionText = 'Main message';
        } else if (questionId === 'q5') {
          questionText = 'Additional details';
        } else if (questionId === 'q4') {
          questionText = 'Occasion';
        } else if (questionId === 'q3') {
          questionText = 'Color preference';
        } else if (questionId === 'q2') {
          questionText = 'Style preference';
        }
      } else {
        // For database questions, use the first 20 characters of the answer as context
        const shortAnswer = typeof answer === 'string'
          ? (answer.length > 20 ? answer.substring(0, 20) + '...' : answer)
          : 'Your answer';

        questionText = `Response: ${shortAnswer}`;
      }

      // Special case formatting
      if (typeof answer === 'string' && answer.startsWith('#')) {
        return {
          id: questionId,
          label: 'Color choice',
          answer
        };
      } else if (
        typeof answer === 'string' &&
        ['Minimal', 'Vintage', 'Bold', 'Artistic', 'Funny', 'Minimalist'].includes(answer)
      ) {
        return {
          id: questionId,
          label: 'Style preference',
          answer
        };
      }

      return {
        id: questionId,
        label: questionText,
        answer
      };
    });
  };

  const displayResponses = getDisplayResponses();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr,300px] lg:gap-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Design Your T-Shirt</h2>
          <p className="text-gray-600 mb-6">
            Use the editor below to customize your design. Add text, shapes, or upload your own images.
          </p>

          {isGeneratingImage ? (
            <div className="flex flex-col items-center justify-center h-[600px]">
              <Loader2 className="h-12 w-12 animate-spin text-brand-green mb-4" />
              <p className="text-gray-600">Generating your custom design based on your preferences...</p>
            </div>
          ) : (
            <DesignCanvas
              initialImageUrl={generatedImageUrl || designImages.designFlow} // Using imported image
              onDesignUpdated={handleDesignUpdated}
            />
          )}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => onNavigateStep("questions")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Questions
            </Button>
            <Button
              onClick={() => onNavigateStep("options")}
              disabled={!designData || isGeneratingImage}
              className="bg-brand-green hover:bg-brand-darkGreen"
            >
              Next: Choose Options
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Your Preferences</h3>
          <div className="space-y-3">
            {displayResponses.map(({ id, label, answer }) => (
              <div key={id} className="flex flex-col">
                <span className="text-sm font-medium text-gray-600">
                  {label}:
                </span>

                {typeof answer === 'string' && answer.startsWith('#') ? (
                  <div className="flex items-center mt-1">
                    <div
                      className="h-4 w-4 rounded-full mr-2"
                      style={{ backgroundColor: answer }}
                    ></div>
                    <span className="text-sm">{answer}</span>
                  </div>
                ) : typeof answer === 'string' ? (
                  <span className="text-sm font-medium mt-1">{answer}</span>
                ) : (
                  <span className="text-sm font-medium mt-1">{typeof answer === 'object' && 'answer' in answer ? String(answer.answer) : 'Complex response'}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignStepContent;
