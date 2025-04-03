import { QuestionResponse } from "@/lib/types";

/**
 * Extracts user preferences from question responses
 */
export const extractPreferences = (responses: Record<string, QuestionResponse | string>): Record<string, string> => {
  // Map responses to user preferences - can be extended based on specific questions
  const preferences: Record<string, string> = {};
  
  // Extract color preferences
  const colorKeywords = [
    'red', 'blue', 'green', 'black', 'white', 'yellow', 'purple', 'orange', 'pink', 
    'pastel', 'bright', 'dark', 'light', 'muted'
  ];
  
  // Helper function to extract answer value regardless of type
  const getAnswerValue = (value: QuestionResponse | string): string => {
    if (typeof value === 'string') {
      return value;
    } else if ('answer' in value) {
      return String(value.answer);
    }
    return '';
  };
  
  // Find color preferences
  for (const [key, value] of Object.entries(responses)) {
    const answerValue = getAnswerValue(value);
    
    // Check if it's a color value
    if (answerValue.startsWith('#') || colorKeywords.some(color => answerValue.toLowerCase().includes(color))) {
      preferences.color = answerValue;
      break;
    }
  }
  
  // Extract style preferences
  const styleKeywords = [
    'minimal', 'vintage', 'bold', 'artistic', 'funny', 'modern', 'retro', 
    'classic', 'elegant', 'simple', 'complex'
  ];
  
  // Find style preferences
  for (const [key, value] of Object.entries(responses)) {
    const answerValue = getAnswerValue(value);
    
    // Check if it contains style keywords
    if (styleKeywords.some(style => answerValue.toLowerCase().includes(style))) {
      preferences.style = answerValue;
      break;
    }
  }
  
  return preferences;
};
