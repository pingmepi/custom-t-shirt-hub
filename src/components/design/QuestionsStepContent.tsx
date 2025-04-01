
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import QuestionForm from "@/components/design/QuestionForm";
import ThemeSelector from "@/components/design/ThemeSelector";
import { fetchThemeBasedQuestions } from "@/services/questionsService";
import { Question } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";

interface QuestionsStepContentProps {
  onQuestionsComplete: (responses: Record<string, any>) => void;
}

const QuestionsStepContent = ({ onQuestionsComplete }: QuestionsStepContentProps) => {
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [themeSelectionComplete, setThemeSelectionComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // When themes are selected, fetch relevant questions
    const loadQuestions = async () => {
      if (selectedThemes.length > 0) {
        setLoading(true);
        try {
          const fetchedQuestions = await fetchThemeBasedQuestions(selectedThemes);
          setQuestions(fetchedQuestions);
          setError(null);
          
          toast({
            title: "Questions loaded",
            description: `${fetchedQuestions.length} personalized questions based on your themes.`,
          });
        } catch (err) {
          console.error("Failed to fetch questions:", err);
          setError("We couldn't load questions based on your themes. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    if (selectedThemes.length > 0) {
      loadQuestions();
    }
  }, [selectedThemes, toast]);

  const handleThemesSelected = (themes: string[]) => {
    console.log("Selected themes:", themes);
    setSelectedThemes(themes);
    setThemeSelectionComplete(true);
  };

  // If we encounter an error, we let the user go back to theme selection
  const handleRetryThemes = () => {
    setThemeSelectionComplete(false);
    setSelectedThemes([]);
    setError(null);
  };

  return (
    <>
      {!themeSelectionComplete ? (
        <ThemeSelector onThemesSelected={handleThemesSelected} />
      ) : loading ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-brand-green" />
            <span className="ml-3 text-lg">Loading your personalized questions...</span>
          </div>
        </div>
      ) : error ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-4">Oops! Something went wrong</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              className="bg-brand-green hover:bg-brand-darkGreen text-white px-4 py-2 rounded"
              onClick={handleRetryThemes}
            >
              Go Back to Theme Selection
            </button>
          </div>
        </div>
      ) : (
        <QuestionForm 
          questions={questions}
          onComplete={onQuestionsComplete}
        />
      )}
    </>
  );
};

export default QuestionsStepContent;
