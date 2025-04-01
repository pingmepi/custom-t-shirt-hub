
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Question } from "@/lib/types";
import { ChevronLeft, Loader2 } from "lucide-react";
import { fetchThemeBasedQuestions, incrementQuestionUsage } from "@/services/questionsService";
import { toast } from "@/hooks/use-toast";

interface QuestionFormProps {
  selectedThemes: string[];
  onQuestionsComplete: (answers: Record<string, any>) => void;
  onBackToThemes: () => void;
}

const QuestionForm = ({ 
  selectedThemes, 
  onQuestionsComplete, 
  onBackToThemes 
}: QuestionFormProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch questions based on selected themes
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching questions for themes:", selectedThemes);
        const fetchedQuestions = await fetchThemeBasedQuestions(selectedThemes);
        setQuestions(fetchedQuestions);
        
        // Initialize answers
        const initialAnswers: Record<string, any> = {};
        fetchedQuestions.forEach(q => {
          initialAnswers[q.id] = q.type === 'choice' && q.options?.length ? q.options[0] : '';
        });
        setAnswers(initialAnswers);
      } catch (error) {
        console.error("Error loading questions:", error);
        toast({
          title: "Error loading questions",
          description: "Failed to load questions. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadQuestions();
  }, [selectedThemes]);
  
  const handleChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all questions are answered
    const isValid = Object.values(answers).every(
      value => value !== undefined && value !== ''
    );
    
    if (!isValid) {
      toast({
        title: "Please answer all questions",
        description: "All questions require an answer before proceeding.",
        variant: "destructive"
      });
      return;
    }
    
    // Increment usage count for each question
    for (const questionId of Object.keys(answers)) {
      await incrementQuestionUsage(questionId);
    }
    
    onQuestionsComplete(answers);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
        <span className="ml-2 text-lg">Loading questions...</span>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {questions.map((question) => (
        <div key={question.id} className="space-y-3">
          <Label htmlFor={question.id} className="text-lg font-medium">
            {question.question_text}
          </Label>
          
          {question.type === 'text' && (
            <Input
              id={question.id}
              value={answers[question.id] || ''}
              onChange={(e) => handleChange(question.id, e.target.value)}
              className="w-full"
              placeholder="Type your answer here..."
            />
          )}
          
          {question.type === 'textarea' && (
            <Textarea
              id={question.id}
              value={answers[question.id] || ''}
              onChange={(e) => handleChange(question.id, e.target.value)}
              className="w-full min-h-[100px]"
              placeholder="Type your answer here..."
            />
          )}
          
          {question.type === 'choice' && question.options && (
            <RadioGroup
              value={answers[question.id] || ''}
              onValueChange={(value) => handleChange(question.id, value)}
              className="space-y-2"
            >
              {question.options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem id={`${question.id}-${option}`} value={option} />
                  <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}
          
          {question.type === 'color' && (
            <div className="flex items-center space-x-2">
              <Input
                id={`${question.id}-color`}
                type="color"
                value={answers[question.id] || '#000000'}
                onChange={(e) => handleChange(question.id, e.target.value)}
                className="w-16 h-10 cursor-pointer"
              />
              <span className="text-sm">{answers[question.id] || '#000000'}</span>
            </div>
          )}
        </div>
      ))}
      
      <div className="flex items-center justify-between pt-4">
        <Button 
          type="button" 
          variant="outline"
          onClick={onBackToThemes}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Themes
        </Button>
        
        <Button 
          type="submit"
          className="bg-brand-green hover:bg-brand-darkGreen"
        >
          Continue
        </Button>
      </div>
    </form>
  );
};

export default QuestionForm;
