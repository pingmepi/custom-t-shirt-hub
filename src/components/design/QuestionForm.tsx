import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Question } from "@/lib/types";
import { ChevronLeft, ArrowLeft, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { fetchThemeBasedQuestions, incrementQuestionUsage } from "@/services/questionsService";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [attemptedSubmit, setAttemptedSubmit] = useState<Record<string, boolean>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        const fetchedQuestions = await fetchThemeBasedQuestions(selectedThemes);
        setQuestions(fetchedQuestions);

        const initialAnswers: Record<string, any> = {};
        fetchedQuestions.forEach(q => {
          switch (q.type) {
            case 'choice':
              initialAnswers[q.id] = q.options?.[0] || '';
              break;
            case 'color':
              initialAnswers[q.id] = '#ffffff';
              break;
            default:
              initialAnswers[q.id] = '';
          }
        });
        setAnswers(initialAnswers);

        const initialAttemptedSubmit: Record<string, boolean> = {};
        fetchedQuestions.forEach(q => {
          initialAttemptedSubmit[q.id] = false;
        });
        setAttemptedSubmit(initialAttemptedSubmit);
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

  const validateCurrentQuestion = (questionId: string): boolean => {
    const currentAnswer = answers[questionId];
    if (!currentAnswer) {
      toast({
        title: "Validation Error",
        description: "Please provide an answer before proceeding.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    setAttemptedSubmit(prev => ({
      ...prev,
      [currentQuestion.id]: true
    }));

    if (!validateCurrentQuestion(currentQuestion.id)) {
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowConfirmation(true);
    }
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
  };

  const handleFinalSubmit = async () => {
    try {
      for (const questionId of Object.keys(answers)) {
        await incrementQuestionUsage(questionId);
      }
      onQuestionsComplete(answers);
    } catch (error) {
      console.error("Error submitting questions:", error);
      toast({
        title: "Submission Error",
        description: "Failed to submit your answers. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
        <span className="ml-2 text-lg">Loading questions...</span>
      </div>
    );
  }

  if (showConfirmation) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6 bg-white rounded-lg shadow-sm">
        <div className="space-y-6">
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-brand-green mb-4" />
            <h3 className="text-xl font-semibold mb-2">Review Your Answers</h3>
            <p className="text-gray-600">
              Please review your answers before submitting. Once submitted, you'll move to the design step.
            </p>
          </div>

          <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
            {Object.entries(answers).map(([questionId, answer]) => {
              const question = questions.find(q => q.id === questionId);
              if (!question) return null;

              return (
                <div key={questionId} className="mb-3 pb-3 border-b border-gray-100 last:border-0">
                  <p className="font-medium">{question.question_text}</p>
                  <p className="text-gray-700 mt-1">{
                    typeof answer === 'string' && answer.startsWith('#') 
                      ? <span className="flex items-center">
                          <span className="h-4 w-4 rounded-full mr-2" style={{ backgroundColor: answer }}></span>
                          {answer}
                        </span>
                      : answer
                  }</p>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button 
              type="button"
              variant="outline"
              onClick={() => setShowConfirmation(false)}
            >
              Back to Questions
            </Button>
            
            <Button 
              type="button"
              className="bg-brand-green hover:bg-brand-darkGreen"
              onClick={handleFinalSubmit}
            >
              Confirm & Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 bg-white rounded-lg shadow-sm">
      <form className="space-y-8">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="space-y-4 min-h-[200px] px-2">
          <Label htmlFor={currentQuestion.id} className="text-lg font-medium block mb-4">
            {currentQuestion.question_text}
          </Label>

          {currentQuestion.type === 'text' && (
            <Input
              id={currentQuestion.id}
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleChange(currentQuestion.id, e.target.value)}
              className="w-full"
              placeholder="Type your answer here..."
            />
          )}

          {currentQuestion.type === 'textarea' && (
            <Textarea
              id={currentQuestion.id}
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleChange(currentQuestion.id, e.target.value)}
              className="w-full min-h-[100px]"
              placeholder="Type your answer here..."
            />
          )}

          {currentQuestion.type === 'choice' && currentQuestion.options && (
            <RadioGroup
              value={answers[currentQuestion.id] || ''}
              onValueChange={(value) => handleChange(currentQuestion.id, value)}
              className="space-y-3 py-2"
            >
              {currentQuestion.options.map((option) => (
                <div 
                  key={option} 
                  className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                >
                  <RadioGroupItem id={`${currentQuestion.id}-${option}`} value={option} />
                  <Label 
                    htmlFor={`${currentQuestion.id}-${option}`}
                    className="cursor-pointer flex-grow"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentQuestion.type === 'color' && (
            <div className="flex items-center space-x-2 py-2">
              <Input
                id={`${currentQuestion.id}-color`}
                type="color"
                value={answers[currentQuestion.id] || '#000000'}
                onChange={(e) => handleChange(currentQuestion.id, e.target.value)}
                className="w-16 h-10 cursor-pointer"
              />
              <span className="text-sm">{answers[currentQuestion.id] || '#000000'}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-6 px-2 border-t border-gray-100">
          <div>
            {currentQuestionIndex === 0 ? (
              <Button 
                type="button" 
                variant="outline"
                onClick={onBackToThemes}
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to Themes
              </Button>
            ) : (
              <Button 
                type="button" 
                variant="outline"
                onClick={handlePreviousQuestion}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
            )}
          </div>

          <div>
            {currentQuestionIndex === questions.length - 1 ? (
              <Button 
                type="button"
                className="bg-brand-green hover:bg-brand-darkGreen"
                onClick={handleNextQuestion}
              >
                Review Answers
              </Button>
            ) : (
              <Button 
                type="button"
                className="bg-brand-green hover:bg-brand-darkGreen"
                onClick={handleNextQuestion}
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
