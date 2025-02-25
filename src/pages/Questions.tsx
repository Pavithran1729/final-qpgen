import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { QuestionDialog } from "@/components/question/QuestionDialog";
import { AddSubjectDialog } from "@/components/question/AddSubjectDialog";
import { QuestionsHeader } from "@/components/question/QuestionsHeader";
import { QuestionsContent } from "@/components/question/QuestionsContent";

interface Subject {
  id: string;
  code: string;
  name: string;
}

const Questions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const { data: questions, isLoading } = useQuery({
    queryKey: ['questions', selectedSubject?.id],
    queryFn: async () => {
      let query = supabase.from('questions').select(`
        *,
        subject:subjects(
          id,
          subject_code,
          subject_name
        )
      `);
      
      if (selectedSubject) {
        query = query.eq('subject_id', selectedSubject.id);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    staleTime: 0,
  });

  const handleEdit = (question: any) => {
    setSelectedQuestion(question);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedQuestion(null);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!selectedSubject ? (
            <QuestionsHeader
              onAddSubject={() => setIsSubjectDialogOpen(true)}
              onSelectSubject={setSelectedSubject}
            />
          ) : (
            <QuestionsContent
              selectedSubject={selectedSubject}
              onBack={() => setSelectedSubject(null)}
              onAdd={handleAdd}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              questions={questions}
              isLoading={isLoading}
              onEdit={handleEdit}
            />
          )}
        </div>
      </main>

      <QuestionDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        selectedQuestion={selectedQuestion}
        selectedSubject={selectedSubject}
        onSuccess={() => {
          setIsFormOpen(false);
        }}
      />

      <AddSubjectDialog
        open={isSubjectDialogOpen}
        onOpenChange={setIsSubjectDialogOpen}
        onSuccess={() => {
          setIsSubjectDialogOpen(false);
        }}
      />
    </div>
  );
};

export default Questions;