import { toast } from "sonner";
import { DesignData, QuestionResponse } from "@/lib/types";

/**
 * Validates that question responses are not empty
 */
export const validateResponses = (responses: Record<string, QuestionResponse | string>): boolean => {
  if (!responses || Object.keys(responses).length === 0) {
    toast.error("Please answer all questions before proceeding");
    return false;
  }
  
  // Check if any response is empty
  for (const [_, value] of Object.entries(responses)) {
    if (!value || 
        (typeof value === 'string' && value.trim() === '') ||
        (typeof value === 'object' && 'answer' in value && (!value.answer || (typeof value.answer === 'string' && value.answer.trim() === '')))) {
      toast.error("Please provide answers to all questions");
      return false;
    }
  }
  
  return true;
};

/**
 * Validates design data
 */
export const validateDesignData = (data: DesignData | null): boolean => {
  if (!data) {
    toast.error("Design data is missing");
    return false;
  }
  
  // Add more specific validations based on the design data structure
  if (!data.canvas_json && (!data.elements || data.elements.length === 0)) {
    toast.error("Your design appears to be empty");
    return false;
  }
  
  return true;
};

/**
 * Validates that a user is authenticated before proceeding with an action
 */
export const validateAuthentication = (isAuthenticated: boolean): boolean => {
  if (!isAuthenticated) {
    toast.error("Please login or sign up to continue");
    return false;
  }
  
  return true;
};
