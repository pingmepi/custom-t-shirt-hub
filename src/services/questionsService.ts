
import { supabase } from "@/integrations/supabase/client";
import { Question } from "@/lib/types";

/**
 * Fetches relevant questions based on selected themes
 * @param themes Array of theme IDs to base questions on
 * @returns Array of questions
 */
export const fetchThemeBasedQuestions = async (themes: string[]): Promise<Question[]> => {
  try {
    // For now, this is a simplified implementation
    // In a real app, we would query the backend based on themes
    console.log("Fetching questions for themes:", themes);
    
    // Get active questions from Supabase
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('is_active', true)
      .order('usage_count', { ascending: false })
      .limit(5);
    
    if (error) {
      console.error("Error fetching questions:", error);
      throw new Error("Failed to fetch questions");
    }
    
    if (!data || data.length === 0) {
      console.warn("No questions found, using default questions");
      return DEFAULT_QUESTIONS;
    }
    
    const questions: Question[] = data.map(q => ({
      id: q.id,
      type: q.type as 'text' | 'choice' | 'color' | 'textarea',
      question_text: q.question_text,
      options: q.options as string[] | undefined,
      is_active: q.is_active === true,
      usage_count: q.usage_count || 0
    }));
    
    return questions;
  } catch (err) {
    console.error("Error in fetchThemeBasedQuestions:", err);
    return DEFAULT_QUESTIONS;
  }
};

/**
 * Updates the usage count for a question
 * @param questionId ID of the question that was used
 */
export const incrementQuestionUsage = async (questionId: string): Promise<void> => {
  try {
    const { data: questionData, error: fetchError } = await supabase
      .from('questions')
      .select('usage_count')
      .eq('id', questionId)
      .single();
      
    if (fetchError) {
      console.error(`Error fetching question ${questionId}:`, fetchError);
      return;
    }
    
    const currentCount = questionData?.usage_count || 0;
    
    const { error: updateError } = await supabase
      .from('questions')
      .update({ usage_count: currentCount + 1 })
      .eq('id', questionId);
      
    if (updateError) {
      console.error(`Error updating usage count for question ${questionId}:`, updateError);
    } else {
      console.log(`Updated usage count for question ${questionId} to ${currentCount + 1}`);
    }
  } catch (err) {
    console.error(`Failed to update usage count for question ${questionId}:`, err);
  }
};

// Default questions to use as fallback if API fails
const DEFAULT_QUESTIONS: Question[] = [
  {
    id: "q1",
    type: "text",
    question_text: "What's the main message you want on your t-shirt?",
    is_active: true,
  },
  {
    id: "q2",
    type: "choice",
    question_text: "What style are you looking for?",
    options: ["Minimal", "Vintage", "Bold", "Artistic", "Funny"],
    is_active: true,
  },
  {
    id: "q3",
    type: "color", 
    question_text: "What's your preferred color palette?",
    is_active: true,
  },
  {
    id: "q4",
    type: "choice",
    question_text: "What's the occasion for this t-shirt?",
    options: ["Casual wear", "Special event", "Gift", "Team/Group", "Other"],
    is_active: true,
  },
  {
    id: "q5",
    type: "textarea",
    question_text: "Any additional details you'd like to include in your design?",
    is_active: true,
  },
];
