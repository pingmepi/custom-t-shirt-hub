import React, { useEffect, useState } from "react";
import QuestionStats from "../../components/design/QuestionStats";
import { Button } from "../../components/ui/button";
import { supabase } from "../../integrations/supabase/client";
import { Loader2 } from "lucide-react";

const QuestionStatisticsPage = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        // For now, let's assume the admin check is done client-side
        // You should implement proper admin validation based on your system
        // This is a placeholder - in production, use secure server-side validation
        const adminEmails = ['admin@example.com']; // Replace with your admin email
        setIsAdmin(adminEmails.includes(user.email || ''));
        
      } catch (err) {
        console.error("Failed to verify admin access:", err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-brand-green" />
        <span className="ml-3 text-xl">Verifying access...</span>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6 text-center">
          You don't have permission to view this page. This area is restricted to administrators only.
        </p>
        <Button onClick={() => window.location.href = '/'}>
          Go to Homepage
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Question Statistics</h1>
        <p className="text-gray-600">
          View usage data for all questions in the t-shirt design process.
        </p>
      </div>
      
      <QuestionStats />
      
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">About Question Usage Tracking</h2>
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <p className="mb-4">
            This feature tracks how many times each question has been answered by users in the t-shirt design process.
            The counter is incremented each time a user completes a question and moves to the next step.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Questions with higher usage counts are being seen and answered more frequently</li>
            <li>Low usage counts might indicate that users are abandoning the form at earlier questions</li>
            <li>Usage data can help optimize the question flow and identify potential issues</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QuestionStatisticsPage;