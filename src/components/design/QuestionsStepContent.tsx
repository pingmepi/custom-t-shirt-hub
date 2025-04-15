
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

const QuestionsStepContent = ({ selectedThemes: initialThemes, onQuestionsComplete, onThemesSelected }: QuestionsStepContentProps) => {
  const [step, setStep] = useState<'themes' | 'questions'>('themes');
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedThemes, setSelectedThemes] = useState<string[]>(initialThemes || []);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Fetch questions based on selected themes
  useEffect(() => {
    console.log("[QuestionsStepContent] useEffect triggered, step:", step);
    console.log("[QuestionsStepContent] Current selectedThemes in useEffect:", selectedThemes);

    if (step === 'questions') {
      console.log("[QuestionsStepContent] Loading questions for themes:", selectedThemes);
      console.log("[QuestionsStepContent] Selected themes length:", selectedThemes.length);

      // Ensure we have at least one theme
      const themesToUse = selectedThemes.length > 0 ? selectedThemes : ['minimal'];
      console.log("[QuestionsStepContent] Using themes for questions:", themesToUse);

      const loadQuestions = async () => {
        try {
          setIsLoading(true);
          console.log("[QuestionsStepContent] Calling fetchThemeBasedQuestions with themes:", themesToUse);
          const fetchedQuestions = await fetchThemeBasedQuestions(themesToUse);
          console.log("[QuestionsStepContent] Fetched questions:", fetchedQuestions.length);

          if (fetchedQuestions.length === 0) {
            console.warn("[QuestionsStepContent] No questions fetched, using default questions");
            // Use default questions if none were fetched
            const defaultQuestions: Question[] = [
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
              }
            ];
            setQuestions(defaultQuestions);

            // Initialize answers for default questions
            const initialAnswers: Record<string, string> = {};
            defaultQuestions.forEach(q => {
              initialAnswers[q.id] = q.type === 'choice' && q.options?.length ? q.options[0] : '';
            });
            setAnswers(initialAnswers);
          } else {
            console.log("[QuestionsStepContent] Successfully fetched questions:", fetchedQuestions);
            setQuestions(fetchedQuestions);

            // Initialize answers
            const initialAnswers: Record<string, string> = {};
            fetchedQuestions.forEach(q => {
              initialAnswers[q.id] = q.type === 'choice' && q.options?.length ? q.options[0] : '';
            });
            setAnswers(initialAnswers);

            // Add theme_selection to answers
            initialAnswers['theme_selection'] = themesToUse.join(',');
            console.log("[QuestionsStepContent] Added theme_selection to answers:", initialAnswers);
          }
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

  // This function is now replaced by direct handling in the ThemeSelector callback
  // Keeping it as a reference for future use
  /*
  const handleThemesSelected = (themes?: string[]) => {
    console.log("[QuestionsStepContent] handleThemesSelected called, changing step to 'questions'");
    console.log("[QuestionsStepContent] Selected themes before step change:", themes || selectedThemes);

    // If themes are provided, update the state
    if (themes && themes.length > 0) {
      console.log("[QuestionsStepContent] Updating selectedThemes with:", themes);
      setSelectedThemes(themes);
    } else {
      console.log("[QuestionsStepContent] Using existing selectedThemes:", selectedThemes);
    }

    // Change the step to questions
    console.log("[QuestionsStepContent] Setting step to 'questions'");
    setStep('questions');

    // Force immediate loading of questions
    const themesToUse = (themes && themes.length > 0) ? themes : selectedThemes.length > 0 ? selectedThemes : ['minimal'];
    console.log("[QuestionsStepContent] Immediately loading questions for themes:", themesToUse);

    // Force a re-render by setting a timeout
    setTimeout(() => {
      console.log("[QuestionsStepContent] Current step after timeout:", step);
      console.log("[QuestionsStepContent] Selected themes after timeout:", selectedThemes);

      // Double-check that we're in the questions step
      if (step !== 'questions') {
        console.log("[QuestionsStepContent] Step is still not 'questions', forcing change");
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

    // Add theme_selection to answers if not already present
    const finalAnswers = { ...answers };
    if (!finalAnswers['theme_selection'] && selectedThemes.length > 0) {
      finalAnswers['theme_selection'] = selectedThemes.join(',');
      console.log("[QuestionsStepContent] Added theme_selection to answers:", finalAnswers);
    }

    // If not authenticated, store answers and redirect to login
    if (!isAuthenticated) {
      // Store current question responses in session storage
      console.log("[QuestionsStepContent] User not authenticated, storing answers in session storage");
      sessionStorage.setItem('designAnswers', JSON.stringify(finalAnswers));
      sessionStorage.setItem('selectedThemes', JSON.stringify(selectedThemes));
      navigate("/login", { state: { from: "/design" } });
      return;
    }

    // If authenticated, proceed with the flow
    console.log("[QuestionsStepContent] Calling onQuestionsComplete with final answers:", finalAnswers);
    onQuestionsComplete(finalAnswers);
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
        setSelectedThemes(parsedThemes); // Make sure to update the selected themes
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

  return (
    <div className="space-y-6">
      {step === 'themes' ? (
        <ThemeSelector onThemesSelected={(themes) => {
          console.log("[QuestionsStepContent] Themes selected from ThemeSelector:", themes);

          // Call the parent callback if provided
          if (onThemesSelected) {
            console.log("[QuestionsStepContent] Calling parent onThemesSelected callback");
            onThemesSelected(themes);
          }

          // Update selected themes
          setSelectedThemes(themes);

          // Change to questions step to show the questions
          console.log("[QuestionsStepContent] Setting step to 'questions' to load theme-based questions");
          setStep('questions');
        }} />
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
