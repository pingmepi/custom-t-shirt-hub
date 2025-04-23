
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ThemeSelector from "@/components/design/ThemeSelector";
import { fetchThemeBasedQuestions } from "@/services/questionsService";
import { Progress } from "@/components/ui/progress";
import { Question } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ConfirmationDialog from "./ConfirmationDialog";

interface QuestionsStepContentProps {
  selectedThemes: string[];
  onQuestionsComplete: (answers: Record<string, string>) => void;
  onThemesSelected?: (themes: string[]) => void;
}

const QuestionsStepContent = ({ selectedThemes, onQuestionsComplete, onThemesSelected }: QuestionsStepContentProps) => {
  const [step, setStep] = useState<'themes' | 'questions'>('themes');
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Fetch questions based on selected themes
  useEffect(() => {
    console.log("[QuestionsStepContent] useEffect triggered, step:", step);
    console.log("[QuestionsStepContent] Selected themes in useEffect:", selectedThemes);

    if (step === 'questions') {
      console.log("[QuestionsStepContent] Step is 'questions', loading questions for themes:", selectedThemes);
      console.log("[QuestionsStepContent] Selected themes length:", selectedThemes.length);

      // Verify we have themes to work with
      if (selectedThemes.length === 0) {
        console.warn("[QuestionsStepContent] No themes selected, using fallback theme");
        // If no themes are selected, use a fallback theme
        const fallbackTheme = ["minimal"];
        if (onThemesSelected) {
          onThemesSelected(fallbackTheme);
        }
      }

      // Use the themes we have, or fallback to minimal
      const themesToUse = selectedThemes.length > 0 ? selectedThemes : ["minimal"];
      console.log("[QuestionsStepContent] Using themes for questions:", themesToUse);

      // Log that we're definitely in the questions step
      console.log("[QuestionsStepContent] Confirmed in questions step, proceeding to load questions");

      const loadQuestions = async () => {
        try {
          setIsLoading(true);
          const fetchedQuestions = await fetchThemeBasedQuestions(themesToUse);
          console.log("[QuestionsStepContent] Fetched questions:", fetchedQuestions.length);

          setQuestions(fetchedQuestions);

          // Initialize answers
          const initialAnswers: Record<string, string> = {};
          fetchedQuestions.forEach(q => {
            initialAnswers[q.id] = q.type === 'choice' && q.options?.length ? q.options[0] : '';
          });
          setAnswers(initialAnswers);
        } catch (error) {
          console.error("Error loading questions:", error);
          toast.error("Failed to load questions. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };

      loadQuestions();
    }
  }, [step, selectedThemes, toast]);

  // This function is now replaced by handleThemeSelectionComplete
  // Keeping it for reference but commented out
  /*
  const handleThemesSelected = () => {
    console.log("[QuestionsStepContent] handleThemesSelected called, changing step to 'questions'");
    console.log("[QuestionsStepContent] Current selected themes before step change:", selectedThemes);

    // Use a callback to ensure we're working with the latest state
    setStep(prevStep => {
      console.log(`[QuestionsStepContent] Updating step from '${prevStep}' to 'questions'`);
      return 'questions';
    });

    // Force a re-render by setting a timeout
    setTimeout(() => {
      // This will still show 'themes' because of closure, but that's expected
      console.log("[QuestionsStepContent] Current step after timeout:", step);
      // Add an additional check to verify the state has been updated in the component
      console.log("[QuestionsStepContent] Component re-render check");
      console.log("[QuestionsStepContent] Selected themes after timeout:", selectedThemes);

      // Double-check if we need to force another render
      if (step !== 'questions') {
        console.log("[QuestionsStepContent] Step still not updated, forcing update");
        setStep('questions');
      }
    }, 100);
  };
  */

  const handleBackToThemes = () => {
    setStep('themes');
  };

  const handleAnswerChange = (value: string) => {
    if (questions.length === 0) return;

    const currentQuestion = questions[currentQuestionIndex];
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // If final question, show confirmation dialog
      setShowConfirmation(true);
    }
  };

  const handleConfirmAnswers = () => {
    setShowConfirmation(false);

    // If not authenticated, store answers and redirect to login
    if (!isAuthenticated) {
      // Store current question responses in session storage
      sessionStorage.setItem('designAnswers', JSON.stringify(answers));
      sessionStorage.setItem('selectedThemes', JSON.stringify(selectedThemes));
      navigate("/login", { state: { from: "/design" } });
      return;
    }

    // If authenticated, proceed with the flow
    onQuestionsComplete(answers);
  };

  // Restore state after authentication
  useEffect(() => {
    if (isAuthenticated) {
      const savedAnswers = sessionStorage.getItem('designAnswers');
      const savedThemes = sessionStorage.getItem('selectedThemes');

      if (savedAnswers && savedThemes) {
        setAnswers(JSON.parse(savedAnswers));
        // Update selected themes if needed
        const parsedThemes = JSON.parse(savedThemes);
        console.log("Restored selected themes:", parsedThemes);
        onQuestionsComplete(JSON.parse(savedAnswers));

        // Clear the stored data
        sessionStorage.removeItem('designAnswers');
        sessionStorage.removeItem('selectedThemes');
      }
    }
  }, [isAuthenticated, onQuestionsComplete]);

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      // Only go back to themes if we're at the first question
      handleBackToThemes();
    }
  };

  // Calculate progress percentage
  const progress = questions.length > 0
    ? ((currentQuestionIndex + 1) / questions.length) * 100
    : 0;

  // Render current question
  const renderCurrentQuestion = () => {
    if (isLoading || questions.length === 0) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
          <span className="ml-2 text-lg">Loading questions...</span>
        </div>
      );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-medium">{currentQuestion.question_text}</h3>

        {currentQuestion.type === 'text' && (
          <Input
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="w-full"
            placeholder="Type your answer here..."
          />
        )}

        {currentQuestion.type === 'textarea' && (
          <Textarea
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="w-full min-h-[100px]"
            placeholder="Type your answer here..."
          />
        )}

        {currentQuestion.type === 'choice' && currentQuestion.options && (
          <RadioGroup
            value={answers[currentQuestion.id] || ''}
            onValueChange={handleAnswerChange}
            className="space-y-2"
          >
            {currentQuestion.options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem id={`${currentQuestion.id}-${option}`} value={option} />
                <Label htmlFor={`${currentQuestion.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {currentQuestion.type === 'color' && (
          <div className="flex items-center space-x-2">
            <Input
              type="color"
              value={answers[currentQuestion.id] || '#000000'}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="w-16 h-10 cursor-pointer"
            />
            <span className="text-sm">{answers[currentQuestion.id] || '#000000'}</span>
          </div>
        )}
      </div>
    );
  };

  // Direct function to handle theme selection and step change
  const handleThemeSelectionComplete = (themes: string[]) => {
    console.log("[QuestionsStepContent] Direct theme selection handler called with themes:", themes);

    // First update the parent component with selected themes
    if (onThemesSelected) {
      onThemesSelected(themes);
      console.log("[QuestionsStepContent] Parent component updated with themes");
    }

    // Force immediate step change
    console.log("[QuestionsStepContent] Forcing immediate step change to 'questions'");
    setStep('questions');

    // Double-check with a timeout
    setTimeout(() => {
      console.log("[QuestionsStepContent] Verifying step change, current step:", step);
      if (step !== 'questions') {
        console.log("[QuestionsStepContent] Step still not 'questions', forcing again");
        setStep('questions');
      }
    }, 50);
  };

  // Force transition function that can be passed to child components
  const forceTransition = () => {
    console.log("[QuestionsStepContent] Force transition called directly");
    setStep('questions');
  };

  // Listen for the custom events
  useEffect(() => {
    // This event is triggered when the continue button is clicked
    const handleContinueClicked = () => {
      console.log("[QuestionsStepContent] Received custom event 'theme-continue-clicked'");
      setStep('questions');
    };

    // This event is triggered when themes are selected, but doesn't cause transition
    const handleThemesSelected = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log("[QuestionsStepContent] Received custom event 'themes-selected'",
        customEvent.detail ? customEvent.detail.themes : 'no themes');
      // We don't transition here, just log the selected themes
    };

    // Add event listeners
    document.addEventListener('theme-continue-clicked', handleContinueClicked);
    document.addEventListener('themes-selected', handleThemesSelected);

    // Clean up
    return () => {
      document.removeEventListener('theme-continue-clicked', handleContinueClicked);
      document.removeEventListener('themes-selected', handleThemesSelected);
    };
  }, []);

  // We've removed the automatic timeout-based transition
  // Now the transition will only happen when the user explicitly clicks the continue button

  return (
    <div className="space-y-6">
      {step === 'themes' ? (
        <ThemeSelector
          onThemesSelected={handleThemeSelectionComplete}
          forceTransition={forceTransition}
        />
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Create Your T-Shirt Design</h2>
            <p className="text-gray-600 mb-6">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>

            <Progress value={progress} className="mb-6" />

            {renderCurrentQuestion()}

            <div className="flex items-center justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevQuestion}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                {currentQuestionIndex === 0 ? "Back to Themes" : "Previous Question"}
              </Button>

              <Button
                type="button"
                onClick={handleNextQuestion}
                className="bg-brand-green hover:bg-brand-darkGreen"
                disabled={
                  questions.length > 0 &&
                  answers[questions[currentQuestionIndex].id] === ''
                }
              >
                {currentQuestionIndex === questions.length - 1 ? "Submit" : "Next Question"}
                {currentQuestionIndex < questions.length - 1 && <ChevronRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        questionResponses={answers}
        questions={questions}
        onConfirm={handleConfirmAnswers}
        onEdit={() => setShowConfirmation(false)}
      />
    </div>
  );
};

export default QuestionsStepContent;
