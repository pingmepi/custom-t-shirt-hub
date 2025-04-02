import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

interface LoginRequiredProps {
  redirectToLogin: () => void;
}

const LoginRequired = ({ redirectToLogin }: LoginRequiredProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 text-center">
      <h2 className="text-xl font-semibold mb-4">Login Required</h2>
      <p className="text-gray-600 mb-6">
        Please login or create an account to customize your design.
      </p>
      <Button onClick={redirectToLogin} className="bg-brand-green hover:bg-brand-darkGreen">
        <LogIn className="mr-2 h-4 w-4" />
        Login / Sign Up
      </Button>
    </div>
  );
};

export default LoginRequired;
