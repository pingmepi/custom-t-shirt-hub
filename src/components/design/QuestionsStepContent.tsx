
import { useState, useEffect } from "react";
import QuestionForm from "@/components/design/QuestionForm";
import { Question } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button"; // Added missing import

interface QuestionsStepContentProps {
  onQuestionsComplete: (responses: Record<string, any>) => void;
}

const QuestionsStepContent = ({ onQuestionsComplete }: QuestionsStepContentProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: true });
        
        if (error) {
          console.error("Error fetching questions:", error);
          setError("Failed to load questions. Please try again later.");
        } else if (data && data.length > 0) {
          setQuestions(data as Question[]);
        } else {
          setError("No active questions found. Please check back later.");
        }
      } catch (err) {
        console.error("Failed to load questions:", err);
        setError("An unexpected error occurred. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestions();
  }, []);

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-green mr-2" />
          <span className="text-lg">Loading questions...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Tell us about your vision</h2>
        <p className="text-gray-600 mb-6">
          Answer a few questions to help us understand what kind of t-shirt design you're looking for.
        </p>
        
        <QuestionForm 
          questions={questions}
          onComplete={onQuestionsComplete} 
        />
      </div>
    </div>
  );
};

export default QuestionsStepContent;

