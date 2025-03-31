import { CheckCircle } from "lucide-react";
import { useState } from "react";

interface DesignStepperProps {
  activeStep: string;
  questionResponses: Record<string, any>;
  designData: any;
  isDesignComplete: boolean;
}

const DesignStepper: React.FC<DesignStepperProps> = ({
  activeStep,
  questionResponses,
  designData,
  isDesignComplete,
}) => {
  console.log("DesignStepper received designData:", designData); // Log the designData prop
  console.log("DesignStepper received activeStep:", activeStep); // Log the activeStep prop
  return (
    <div className="mb-8">
      <div className="relative">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
          <div
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-brand-green transition-width duration-500"
            style={{ width: activeStep === "questions" ? "33%" : activeStep === "design" ? "66%" : "100%" }}
          ></div>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col items-center">
            <div 
              className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                activeStep === "questions" 
                  ? "border-brand-green bg-brand-green text-white" 
                  : Object.keys(questionResponses).length 
                    ? "border-brand-green bg-brand-lightGreen" 
                    : "border-gray-300"
              }`}
            >
              {Object.keys(questionResponses).length ? <CheckCircle size={18} /> : "1"}
            </div>
            <span className="mt-2 text-sm font-medium">Preferences</span>
          </div>
          <div className="flex flex-col items-center">
            <div 
              className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                activeStep === "design" 
                  ? "border-brand-green bg-brand-green text-white" 
                  : designData 
                    ? "border-brand-green bg-brand-lightGreen" 
                    : "border-gray-300"
              }`}
            >
              {designData ? <CheckCircle size={18} /> : "2"}
            </div>
            <span className="mt-2 text-sm font-medium">Design</span>
          </div>
          <div className="flex flex-col items-center">
            <div 
              className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                activeStep === "options" 
                  ? "border-brand-green bg-brand-green text-white" 
                  : isDesignComplete 
                    ? "border-brand-green bg-brand-lightGreen" 
                    : "border-gray-300"
              }`}
            >
              {isDesignComplete ? <CheckCircle size={18} /> : "3"}
            </div>
            <span className="mt-2 text-sm font-medium">Options</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Import the QuestionForm component
import QuestionForm from "./QuestionForm";

const ParentComponent = () => {
  const [designData, setDesignData] = useState<any[]>([]);

  const handleFormSubmit = (data: any) => {
    console.log("Form submitted with data:", data); // Log submitted data
    setDesignData((prev) => {
      const updatedData = [...prev, data];
      console.log("Updated designData array:", updatedData); // Log updated array
      return updatedData;
    });
  };
      {/* Ensure QuestionForm is imported or defined */}
      <QuestionForm onSubmit={handleFormSubmit} />
  return (
    <div>
      <QuestionForm onSubmit={handleFormSubmit} />
      <div className="mt-4">
        <h2 className="text-lg font-medium">Current Design Data:</h2>
        <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(designData, null, 2)}</pre>
      </div>
    </div>
  );
};

export default DesignStepper;
