
import { Loader2 } from "lucide-react";

const LoadingState = () => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-brand-green h-8 w-8 mr-2" />
        <span className="text-lg text-gray-600">Loading themes...</span>
      </div>
    </div>
  );
};

export default LoadingState;
