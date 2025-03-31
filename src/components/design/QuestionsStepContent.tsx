
import QuestionForm from "@/components/design/QuestionForm";

interface QuestionsStepContentProps {
  onQuestionsComplete: (responses: Record<string, any>) => void;
}

const QuestionsStepContent = ({ onQuestionsComplete }: QuestionsStepContentProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Tell us about your vision</h2>
        <p className="text-gray-600 mb-6">
          Answer a few questions to help us understand what kind of t-shirt design you're looking for.
        </p>
        
        <QuestionForm 
          questions={[]} // We'll fetch questions from the database
          onComplete={onQuestionsComplete} 
        />
      </div>
    </div>
  );
};

export default QuestionsStepContent;
