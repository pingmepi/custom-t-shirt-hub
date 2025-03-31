
import { useState, useEffect } from "react";
import QuestionForm from "@/components/design/QuestionForm";
import { Question } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

interface QuestionsStepContentProps {
  onQuestionsComplete: (responses: Record<string, any>) => void;
}

const QuestionsStepContent = ({ onQuestionsComplete }: QuestionsStepContentProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('is_active', true);
        
        if (!error && data) {
          setQuestions(data as Question[]);
        } else {
          console.error("Error fetching questions:", error);
        }
      } catch (err) {
        console.error("Failed to load questions:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestions();
  }, []);

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
