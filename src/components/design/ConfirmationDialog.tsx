
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
  onConfirm: () => void;
  onEdit: () => void;
}

const ConfirmationDialog = ({
  open,
  onOpenChange,
  questionResponses,
  onConfirm,
  onEdit,
}: ConfirmationDialogProps) => {
  const formatResponses = () => {
    return Object.entries(questionResponses).map(([questionId, answer]) => {
      let questionLabel = "";
      
      // Handle special case formatting based on answer content
      if (typeof answer === 'string' && answer.startsWith('#')) {
        questionLabel = 'Color choice';
      } else if (
        typeof answer === 'string' && 
        ['Minimal', 'Vintage', 'Bold', 'Artistic', 'Funny', 'Minimalist'].includes(answer)
      ) {
        questionLabel = 'Style preference';
      } else if (questionId === 'q1') {
        questionLabel = 'Main message';
      } else if (questionId === 'q5') {
        questionLabel = 'Additional details';
      } else if (questionId === 'q4') {
        questionLabel = 'Occasion';
      } else if (questionId === 'q3') {
        questionLabel = 'Color choice';
      } else if (questionId === 'q2') {
        questionLabel = 'Style preference';
      } else {
        // For database UUIDs, create a better human-readable label
        const shortId = questionId.substring(0, 6);
        questionLabel = `Question ${shortId}`;
      }
      
      return { 
        id: questionId,
        label: questionLabel,
        answer: answer 
      };
    });
  };

  const formattedResponses = formatResponses();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Your Answers</DialogTitle>
          <DialogDescription>
            Please review your responses before continuing to the design stage.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4 py-2">
            {formattedResponses.map(({ id, label, answer }) => (
              <div key={id} className="space-y-1">
                <h4 className="font-medium text-sm text-gray-700">{label}</h4>
                {typeof answer === 'string' && answer.startsWith('#') ? (
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-5 w-5 rounded-full border border-gray-300" 
                      style={{ backgroundColor: answer }}
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
