
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import QuestionForm from "@/components/design/QuestionForm";
import ThemeSelector from "@/components/design/ThemeSelector";
import { fetchThemeBasedQuestions } from "@/services/questionsService";

interface QuestionsStepContentProps {
  selectedThemes: string[];
  onQuestionsComplete: (answers: Record<string, any>) => void;
}

const QuestionsStepContent = ({ selectedThemes, onQuestionsComplete }: QuestionsStepContentProps) => {
  const [step, setStep] = useState<'themes' | 'questions'>('themes');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleThemesSelected = (themeIds: string[]) => {
    setStep('questions');
  };
  
  const handleBackToThemes = () => {
    setStep('themes');
  };

  return (
    <div className="space-y-6">
      {step === 'themes' ? (
        <ThemeSelector onThemesSelected={handleThemesSelected} />
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Create Your T-Shirt Design</h2>
            <p className="text-gray-600 mb-6">
              Answer these questions to help us understand what you're looking for.
              We'll use your responses to create a customized design experience.
            </p>
            
            <QuestionForm 
              selectedThemes={selectedThemes}
              onQuestionsComplete={onQuestionsComplete} 
              onBackToThemes={handleBackToThemes}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionsStepContent;
