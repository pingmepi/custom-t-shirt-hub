
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  errorMessage: string;
  onRetry: () => void;
}

const ErrorState = ({ errorMessage, onRetry }: ErrorStateProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
        <h3 className="text-xl font-semibold mb-2">Failed to Load Themes</h3>
        <p className="text-gray-600 mb-4">{errorMessage}</p>
        <Button 
          onClick={onRetry}
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default ErrorState;
