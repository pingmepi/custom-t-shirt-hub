
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import DesignCanvas from "@/components/design/DesignCanvas";

interface DesignStepContentProps {
  questionResponses: Record<string, any>;
  onDesignUpdated: (data: any) => void;
  onNavigateStep: (step: string) => void;
}

const DesignStepContent = ({ 
  questionResponses, 
  onDesignUpdated,
  onNavigateStep
}: DesignStepContentProps) => {
  const [designData, setDesignData] = useState<any>(null);

  const handleDesignUpdated = (data: any) => {
    setDesignData(data);
    onDesignUpdated(data);
  };

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
          <div className="space-y-2">
            {Object.entries(questionResponses).map(([questionId, answer]) => (
              <div key={questionId} className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">
                  Question {questionId.replace("q", "")}:
                </span>
                <span className="text-sm">{answer}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignStepContent;
