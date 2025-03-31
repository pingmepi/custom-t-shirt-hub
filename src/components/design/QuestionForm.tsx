
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Question } from "@/lib/types";

interface QuestionFormProps {
  questions: Question[];
  onComplete: (responses: Record<string, any>) => void;
}

const MOCK_QUESTIONS: Question[] = [
  {
    id: "q1",
    type: "text",
    question_text: "What's the main message you want on your t-shirt?",
    is_active: true,
  },
  {
    id: "q2",
    type: "choice",
    question_text: "What style are you looking for?",
    options: ["Minimal", "Vintage", "Bold", "Artistic", "Funny"],
    is_active: true,
  },
  {
    id: "q3",
    type: "color",
    question_text: "What's your preferred color palette?",
    options: ["Monochrome", "Vibrant", "Pastels", "Earth tones", "Neon"],
    is_active: true,
  },
  {
    id: "q4",
    type: "choice",
    question_text: "What's the occasion for this t-shirt?",
    options: ["Casual wear", "Special event", "Gift", "Team/Group", "Other"],
    is_active: true,
  },
  {
    id: "q5",
    type: "text",
    question_text: "Any additional details you'd like to include in your design?",
    is_active: true,
  },
];

const QuestionForm = ({ questions = MOCK_QUESTIONS, onComplete }: QuestionFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  
  const activeQuestions = questions.filter(q => q.is_active);
  const currentQuestion = activeQuestions[currentStep];
  
  const handleTextChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };
  
  const handleChoiceChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };
  
  const handleNext = () => {
    // Simple validation
    if (!responses[currentQuestion.id]) {
      return;
    }
    
    if (currentStep < activeQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last question - complete the form
      onComplete(responses);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!currentQuestion) {
    return <div>No questions available</div>;
  }
  
  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-brand-green">
            Question {currentStep + 1} of {activeQuestions.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(((currentStep + 1) / activeQuestions.length) * 100)}% complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-brand-green h-2 rounded-full transition-all duration-300" 
            style={{ width: `${((currentStep + 1) / activeQuestions.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">{currentQuestion.question_text}</h2>
      
      {currentQuestion.type === "text" && (
        <div className="mb-6">
          <Label htmlFor={currentQuestion.id} className="sr-only">
            {currentQuestion.question_text}
          </Label>
          <Input
            id={currentQuestion.id}
            value={responses[currentQuestion.id] || ""}
            onChange={(e) => handleTextChange(currentQuestion.id, e.target.value)}
            placeholder="Type your answer here..."
            className="w-full"
          />
        </div>
      )}
      
      {currentQuestion.type === "choice" && currentQuestion.options && (
        <div className="mb-6 space-y-2">
          <RadioGroup
            value={responses[currentQuestion.id] || ""}
            onValueChange={(value) => handleChoiceChange(currentQuestion.id, value)}
          >
            {currentQuestion.options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${currentQuestion.id}-${option}`} />
                <Label htmlFor={`${currentQuestion.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}
      
      {currentQuestion.type === "color" && currentQuestion.options && (
        <div className="mb-6 space-y-2">
          <RadioGroup
            value={responses[currentQuestion.id] || ""}
            onValueChange={(value) => handleChoiceChange(currentQuestion.id, value)}
          >
            {currentQuestion.options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${currentQuestion.id}-${option}`} />
                <Label htmlFor={`${currentQuestion.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}
      
      <div className="flex justify-between mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={handleNext}
          disabled={!responses[currentQuestion.id]}
          className="bg-brand-green hover:bg-brand-darkGreen"
        >
          {currentStep < activeQuestions.length - 1 ? "Next" : "Complete"}
        </Button>
      </div>
    </div>
  );
};

export default QuestionForm;
