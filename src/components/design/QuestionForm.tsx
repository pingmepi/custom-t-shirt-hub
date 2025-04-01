
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Question } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

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
    type: "color", // Now properly handled as color type
    question_text: "What's your preferred color palette?",
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
    type: "textarea",
    question_text: "Any additional details you'd like to include in your design?",
    is_active: true,
  },
];

const QuestionForm = ({ questions: initialQuestions, onComplete }: QuestionFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [questions, setQuestions] = useState<Question[]>(initialQuestions.length ? initialQuestions : MOCK_QUESTIONS);
  const [loading, setLoading] = useState(initialQuestions.length === 0);
  
  useEffect(() => {
    const fetchQuestions = async () => {
      if (initialQuestions.length === 0) {
        try {
          const { data, error } = await supabase
            .from('questions')
            .select('*')
            .eq('is_active', true);
          
          if (error) {
            console.error("Error fetching questions:", error);
            setQuestions(MOCK_QUESTIONS);
          } else if (data && data.length > 0) {
            const formattedQuestions: Question[] = data.map(q => ({
              id: q.id,
              type: q.type as 'text' | 'choice' | 'color' | 'textarea',
              question_text: q.question_text,
              options: q.options as string[] | undefined,
              is_active: q.is_active === true,
              usage_count: q.usage_count || 0
            }));
            
            setQuestions(formattedQuestions);
          } else {
            setQuestions(MOCK_QUESTIONS);
          }
        } catch (err) {
          console.error("Failed to fetch questions:", err);
          setQuestions(MOCK_QUESTIONS);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchQuestions();
  }, [initialQuestions]);
  
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

  // Added by lovable: Handle color picker change
  const handleColorChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };
  
  const updateQuestionUsageCount = async (questionId: string) => {
    try {
      // First get the current question to get its usage count
      const { data: questionData, error: fetchError } = await supabase
        .from('questions')
        .select('usage_count')
        .eq('id', questionId)
        .single();
        
      if (fetchError) {
        console.error(`Error fetching question ${questionId}:`, fetchError);
        return;
      }
      
      const currentCount = questionData?.usage_count || 0;
      
      // Update the usage count
      const { error: updateError } = await supabase
        .from('questions')
        .update({ usage_count: currentCount + 1 })
        .eq('id', questionId);
        
      if (updateError) {
        console.error(`Error updating usage count for question ${questionId}:`, updateError);
      } else {
        console.log(`Updated usage count for question ${questionId} to ${currentCount + 1}`);
      }
    } catch (err) {
      console.error(`Failed to update usage count for question ${questionId}:`, err);
    }
  };

  const handleNext = () => {
    if (!responses[currentQuestion.id]) {
      return;
    }
    
    // Log current question completion
    console.log(`Completed question ${currentStep + 1}/${activeQuestions.length}:`, {
      questionId: currentQuestion.id,
      question: currentQuestion.question_text,
      response: responses[currentQuestion.id],
      questionType: activeQuestions.find(q => q.id === currentQuestion.id)?.type
    });
    
    // Update the usage count for the current question
    updateQuestionUsageCount(currentQuestion.id);
    
    if (currentStep < activeQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Log all responses before submitting
      console.log("Form completed! All responses:", responses);
      console.log("Questions answered:", activeQuestions.length);
      console.log("Response summary:", Object.entries(responses).map(([id, value]) => ({
        questionId: id,
        question: activeQuestions.find(q => q.id === id)?.question_text,
        response: value,
        questionType: activeQuestions.find(q => q.id === id)?.type
      })));
      
      onComplete(responses);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
        <span className="ml-2 text-lg">Loading questions...</span>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="p-6 text-center">No questions available. Please try again later.</div>;
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
      
      {currentQuestion.type === "textarea" && (
        <div className="mb-6">
          <Label htmlFor={currentQuestion.id} className="sr-only">
            {currentQuestion.question_text}
          </Label>
          <Textarea
            id={currentQuestion.id}
            value={responses[currentQuestion.id] || ""}
            onChange={(e) => handleTextChange(currentQuestion.id, e.target.value)}
            placeholder="Type your detailed answer here..."
            className="w-full min-h-[100px]"
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
      
      {/* Added by lovable: Proper color input handling */}
      {currentQuestion.type === "color" && (
        <div className="mb-6">
          <div className="flex flex-col space-y-3">
            <Label htmlFor={`${currentQuestion.id}-color`}>
              Select a color or enter a color code:
            </Label>
            <div className="flex items-center space-x-3">
              <Input
                type="color"
                id={`${currentQuestion.id}-color`}
                value={responses[currentQuestion.id] || "#000000"}
                onChange={(e) => handleColorChange(currentQuestion.id, e.target.value)}
                className="w-12 h-10 p-1"
              />
              <Input
                type="text"
                value={responses[currentQuestion.id] || ""}
                onChange={(e) => handleColorChange(currentQuestion.id, e.target.value)}
                placeholder="e.g. #FF0000 or red"
                className="w-full"
              />
            </div>
            <div className="text-sm text-gray-500">
              You can select from the color picker or type colors like "red", "blue", "pastel", etc.
            </div>
          </div>
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
