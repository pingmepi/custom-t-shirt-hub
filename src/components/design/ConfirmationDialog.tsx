
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questionResponses: Record<string, any>;
  questions: Array<{ id: string, question_text: string, type: string }>;
  onConfirm: () => void;
  onEdit: () => void;
}

const ConfirmationDialog = ({
  open,
  onOpenChange,
  questionResponses,
  questions,
  onConfirm,
  onEdit,
}: ConfirmationDialogProps) => {
  const formatResponses = () => {
    return Object.entries(questionResponses).map(([questionId, answer]) => {
      // Find the actual question text based on question ID
      const questionObj = questions.find(q => q.id === questionId);
      let questionLabel = questionObj?.question_text || 'Question';

      // Special case formatting for certain answer types
      if (typeof answer === 'string' && answer.startsWith('#')) {
        return {
          id: questionId,
          label: 'Color choice',
          question: questionLabel,
          answer: answer
        };
      } else if (
        typeof answer === 'string' &&
        ['Minimal', 'Vintage', 'Bold', 'Artistic', 'Funny', 'Minimalist'].includes(answer)
      ) {
        return {
          id: questionId,
          label: 'Style preference',
          question: questionLabel,
          answer: answer
        };
      }

      return {
        id: questionId,
        label: questionLabel,
        question: questionLabel,
        answer: answer
      };
    });
  };

  const formattedResponses = formatResponses();

  const dialogTitleId = "confirmation-dialog-title";
  const dialogDescriptionId = "confirmation-dialog-description";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        aria-labelledby={dialogTitleId}
        aria-describedby={dialogDescriptionId}
      >
        <DialogHeader>
          <DialogTitle id={dialogTitleId}>Confirm Your Answers</DialogTitle>
          <DialogDescription id={dialogDescriptionId}>
            Please review your responses before continuing to the design stage.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 py-2">
            {formattedResponses.map(({ id, question, answer }) => (
              <div key={id} className="space-y-1">
                <h4 className="font-medium text-sm text-gray-700">{question}</h4>
                {typeof answer === 'string' && answer.startsWith('#') ? (
                  <div className="flex items-center gap-2">
                    <div
                      className="h-5 w-5 rounded-full border border-gray-300"
                      style={{ backgroundColor: answer }}
                      aria-label={`Color: ${answer}`}
                    ></div>
                    <span>{answer}</span>
                  </div>
                ) : (
                  <p className="text-sm">{answer}</p>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="flex sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onEdit}
          >
            Edit Answers
          </Button>
          <Button
            type="button"
            className="bg-brand-green hover:bg-brand-darkGreen"
            onClick={onConfirm}
          >
            Confirm & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
