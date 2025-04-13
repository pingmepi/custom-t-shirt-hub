import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the URL hash (without the #)
        const hashParams = window.location.hash.substring(1);
        
        if (!hashParams) {
          console.log("No hash parameters found");
          return;
        }
        
        // Process the auth callback
        console.log("Processing auth callback");
        
        // Exchange the code for a session
        const { data, error } = await supabase.auth.exchangeCodeForSession(hashParams);
        
        if (error) {
          console.error("Error exchanging code for session:", error);
          setError(error.message);
          return;
        }
        
        if (data?.session) {
          console.log("Session established successfully");
          
          // Clear the URL without the sensitive parameters
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // Check for stored design data
          const savedAnswers = sessionStorage.getItem('designAnswers');
          if (savedAnswers) {
            console.log("Found saved design answers, redirecting to design page");
            navigate('/design');
          } else {
            console.log("No saved design answers, redirecting to dashboard");
            navigate('/dashboard');
          }
        }
      } catch (err) {
        console.error("Error in auth callback:", err);
        setError("An unexpected error occurred during authentication");
      }
    };
    
    handleAuthCallback();
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {error ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-brand-blue text-white rounded hover:bg-brand-darkBlue"
          >
            Return to Login
          </button>
        </div>
      ) : (
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-blue mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Completing Sign In</h2>
          <p className="text-gray-600">Please wait while we authenticate you...</p>
        </div>
      )}
    </div>
  );
};

export default AuthCallback;
