import { CheckCircle } from "lucide-react";

/**
 * Design stepper step type
 */
type Step = 'questions' | 'design' | 'options';

/**
 * Props for the DesignStepper component
 */
interface DesignStepperProps {
  activeStep: string;
  questionResponses: Record<string, any>;
  designData: any;
  isDesignComplete: boolean;
}

/**
 * StepItem configuration type
 */
interface StepItem {
  id: Step;
  label: string;
  number: number;
  isActive: boolean;
  isCompleted: boolean;
}

/**
 * DesignStepper displays the progress of the design workflow
 */
const DesignStepper = ({
  activeStep,
  questionResponses = {}, 
  designData = null,
  isDesignComplete = false,
}: DesignStepperProps) => {
  // Check if questions have been answered
  const hasQuestionResponses = questionResponses && Object.keys(questionResponses).length > 0;
  
  // Check if there is valid design data
  const hasDesignData = Boolean(designData);
  
  // Calculate progress width based on active step
  const getProgressWidth = (): string => {
    switch(activeStep) {
      case 'questions': return '33%';
      case 'design': return '66%';
      case 'options': return '100%';
      default: return '33%';
    }
  };
  
  // Define all steps in the workflow
  const steps: StepItem[] = [
    {
      id: 'questions' as Step,
      label: 'Preferences',
      number: 1,
      isActive: activeStep === 'questions',
      isCompleted: hasQuestionResponses
    },
    {
      id: 'design' as Step,
      label: 'Design',
      number: 2,
      isActive: activeStep === 'design',
      isCompleted: hasDesignData
    },
    {
      id: 'options' as Step,
      label: 'Options',
      number: 3,
      isActive: activeStep === 'options',
      isCompleted: isDesignComplete
    }
  ];

  return (
    <div className="mb-8">
      <div className="relative">
        {/* Progress bar */}
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
          <div
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-brand-green transition-width duration-500"
            style={{ width: getProgressWidth() }}
          ></div>
        </div>
        
        {/* Step indicators */}
        <div className="flex justify-between">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                  step.isActive 
                    ? "border-brand-green bg-brand-green text-white" 
                    : step.isCompleted
                      ? "border-brand-green bg-brand-lightGreen" 
                      : "border-gray-300"
                }`}
              >
                {step.isCompleted ? <CheckCircle size={18} /> : step.number}
              </div>
              <span className="mt-2 text-sm font-medium">{step.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesignStepper;
