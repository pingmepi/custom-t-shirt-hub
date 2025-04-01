
import React, { useState, useEffect } from "react";
import { Question } from "../../lib/types";
import { supabase } from "../../integrations/supabase/client";

import { Loader2, ArrowUpDown, Info } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,

} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";



const QuestionStats = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"usage_count" | "question_text">("usage_count");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*');

      if (error) {
        console.error("Error fetching questions:", error);
      } else if (data) {

        const formattedQuestions: Question[] = data.map(q => {
          // Use a type assertion to tell TypeScript that the database row can have additional fields
          const dbRow = q as any;
          
          return {
            id: dbRow.id,
            type: dbRow.type as 'text' | 'choice' | 'color' | 'textarea',
            question_text: dbRow.question_text,
            options: dbRow.options as string[] | undefined,
            is_active: dbRow.is_active === true,
            usage_count: typeof dbRow.usage_count === 'number' ? dbRow.usage_count : 0
          };
        });

        setQuestions(formattedQuestions);
      }
    } catch (err) {
      console.error("Failed to fetch questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column: "usage_count" | "question_text") => {
    if (sortBy === column) {

      // Toggle order if clicking on the same column
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Default to descending for usage count, ascending for text

      setSortBy(column);
      setSortOrder(column === "usage_count" ? "desc" : "asc");
    }
  };

  const sortedQuestions = [...questions].sort((a, b) => {
    if (sortBy === "usage_count") {
      const countA = a.usage_count || 0;
      const countB = b.usage_count || 0;
      return sortOrder === "asc" ? countA - countB : countB - countA;
    } else {
      const textA = a.question_text.toLowerCase();
      const textB = b.question_text.toLowerCase();
      return sortOrder === "asc" 
        ? textA.localeCompare(textB) 
        : textB.localeCompare(textA);
    }
  });

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case "text": return "Text Input";
      case "textarea": return "Long Text";
      case "choice": return "Multiple Choice";
      case "color": return "Color Input";
      default: return type;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Question Usage Statistics</h2>
        <Button
          variant="outline"
          onClick={fetchQuestions}
          className="flex items-center gap-2"
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
          <span className="ml-2 text-lg">Loading statistics...</span>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort("question_text")}
                  className="flex items-center gap-1 font-medium"
                >
                  Question
                  <ArrowUpDown size={16} />
                </Button>
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort("usage_count")}
                  className="flex items-center gap-1 font-medium"
                >
                  Usage Count
                  <ArrowUpDown size={16} />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedQuestions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                  No questions found
                </TableCell>
              </TableRow>
            ) : (
              sortedQuestions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell className="font-medium">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1">
                            <div className="truncate max-w-[280px]">{question.question_text}</div>
                            <Info size={16} className="text-gray-400" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="max-w-md">
                            <p className="font-semibold">ID: {question.id}</p>
                            <p>{question.question_text}</p>
                            {question.options && (
                              <div className="mt-1">
                                <p className="font-medium">Options:</p>
                                <ul className="list-disc pl-4">
                                  {question.options.map(opt => (
                                    <li key={opt}>{opt}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>{getQuestionTypeLabel(question.type)}</TableCell>
                  <TableCell>
                    <span 
                      className={`px-2 py-1 rounded text-xs ${
                        question.is_active 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {question.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div 
                        className={`mr-2 h-2 ${
                          ((question.usage_count || 0) > 0) 
                            ? "bg-brand-green" 
                            : "bg-gray-200"
                        }`}
                        style={{ 
                          width: `${Math.min(100, ((question.usage_count || 0) * 5))}px`,
                          minWidth: "10px" 
                        }}
                      />
                      {question.usage_count || 0}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};


export default QuestionStats;

