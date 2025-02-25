import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Question {
  id: string;
  content: string;
  marks: number;
  k_level: string;
  part: string;
  co_level: string;
  subject_code?: string;
  subject_name?: string;
}

interface QuestionListProps {
  questions: Question[] | undefined;
  isLoading: boolean;
  searchQuery: string;
  onEdit: (question: Question) => void;
  showSubjectColumns?: boolean;
}

export const QuestionList = ({ 
  questions, 
  isLoading, 
  searchQuery, 
  onEdit,
  showSubjectColumns = true 
}: QuestionListProps) => {
  const queryClient = useQueryClient();

  const deleteQuestion = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: (_, id) => {
      // Invalidate both general and specific queries
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      const deletedQuestion = questions?.find(q => q.id === id);
      if (deletedQuestion?.subject_code) {
        queryClient.invalidateQueries({ 
          queryKey: ['questions', deletedQuestion.subject_code] 
        });
      }
      toast.success("Question deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete question");
    },
  });

  // Filter questions based on search query
  const filteredQuestions = questions?.filter(q => {
    const searchLower = searchQuery.toLowerCase();
    return (
      q.content?.toLowerCase().includes(searchLower) ||
      q.subject_code?.toLowerCase().includes(searchLower) ||
      q.subject_name?.toLowerCase().includes(searchLower) ||
      q.k_level?.toLowerCase().includes(searchLower) ||
      q.part?.toLowerCase().includes(searchLower) ||
      q.co_level?.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <div className="bg-white shadow-sm rounded-lg border p-4">
        <p className="text-center">Loading questions...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {showSubjectColumns && (
              <>
                <TableHead>Subject Code</TableHead>
                <TableHead>Subject Name</TableHead>
              </>
            )}
            <TableHead>Question</TableHead>
            <TableHead className="w-[100px]">Marks</TableHead>
            <TableHead className="w-[100px]">Part</TableHead>
            <TableHead className="w-[100px]">K-Level</TableHead>
            <TableHead className="w-[100px]">CO-Level</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!filteredQuestions || filteredQuestions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showSubjectColumns ? 8 : 6} className="text-center py-4">
                No questions found
              </TableCell>
            </TableRow>
          ) : (
            filteredQuestions.map((question) => (
              <TableRow key={question.id}>
                {showSubjectColumns && (
                  <>
                    <TableCell>{question.subject_code}</TableCell>
                    <TableCell>{question.subject_name}</TableCell>
                  </>
                )}
                <TableCell className="font-medium">{question.content}</TableCell>
                <TableCell>{question.marks}</TableCell>
                <TableCell>{question.part}</TableCell>
                <TableCell>{question.k_level}</TableCell>
                <TableCell>{question.co_level}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onEdit(question)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this question?')) {
                          deleteQuestion.mutate(question.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};