import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import DesignCanvas from "@/components/design/DesignCanvas";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface DesignStepContentProps {
  questionResponses: Record<string, any>;
  onDesignUpdated: (data: any) => void;
  onNavigateStep: (step: string) => void;
  onQuestionsComplete: (responses: Record<string, any>) => void;
}

const DesignStepContent = ({ 
  questionResponses, 
  onDesignUpdated,
  onNavigateStep,
  onQuestionsComplete
}: DesignStepContentProps) => {
  const [designData, setDesignData] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const handleDesignUpdated = (data: any) => {
    setDesignData(data);
    onDesignUpdated(data);
    
    toast({
      title: "Design updated",
      description: "Your design has been updated successfully.",
    });
  };

  const redirectToLogin = () => {
    // Store current design state in session storage
    sessionStorage.setItem('currentDesignState', JSON.stringify({
      questionResponses,
      designData
    }));
    navigate("/login", { state: { from: "/design" } });
  };

  // Restore design state after login
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
  }, [isAuthenticated]);

  // Create a nicely formatted display of question responses
  const formatResponses = () => {
    return Object.entries(questionResponses).map(([questionId, answer]) => {
      // Try to determine what the question was about based on the answer
      let questionLabel = `Question ${questionId.replace("q", "")}`;
      
      if (typeof answer === 'string' && answer.startsWith('#')) {
        questionLabel = 'Color choice';
      } else if (
        typeof answer === 'string' && 
        ['Minimal', 'Vintage', 'Bold', 'Artistic', 'Funny'].includes(answer)
      ) {
        questionLabel = 'Style preference';
      } else if (questionId === 'q1') {
        questionLabel = 'Main message';
      } else if (questionId === 'q5') {
        questionLabel = 'Additional details';
      } else if (questionId === 'q4') {
        questionLabel = 'Occasion';
      }
      
      return { 
        id: questionId,
        label: questionLabel,
        answer: answer 
      };
    });
  };

  const formattedResponses = formatResponses();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr,300px] lg:gap-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Design Your T-Shirt</h2>
          <p className="text-gray-600 mb-6">
            Use the editor below to customize your design. Add text, shapes, or upload your own images.
          </p>
          
          <DesignCanvas 
            initialImageUrl="/design-flow.png"
            onDesignUpdated={handleDesignUpdated}
          />
          
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
              disabled={!designData}
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
            {formattedResponses.map(({ id, label, answer }) => (
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
                ) : (
                  <span className="text-sm font-medium mt-1">{answer}</span>
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
