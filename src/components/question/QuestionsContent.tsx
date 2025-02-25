import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, Upload } from "lucide-react";
import { QuestionSearch } from "./QuestionSearch";
import { QuestionList } from "./QuestionList";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { ExcelUploadDialog } from "./ExcelUploadDialog";

interface Subject {
  id: string;
  code: string;
  name: string;
}

interface QuestionsContentProps {
  selectedSubject: Subject;
  onBack: () => void;
  onAdd: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  questions: any[];
  isLoading: boolean;
  onEdit: (question: any) => void;
}

export const QuestionsContent = ({
  selectedSubject,
  onBack,
  onAdd,
  searchQuery,
  setSearchQuery,
  questions,
  isLoading,
  onEdit,
}: QuestionsContentProps) => {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ 
        queryKey: ['questions', selectedSubject.id] 
      });
      toast.success("Question bank refreshed");
    } catch (error) {
      toast.error("Failed to refresh question bank");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <>
      <div className="space-y-2">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-2"
        >
          ← Back to Question Banks
        </Button>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {selectedSubject.code} - {selectedSubject.name}
          </h1>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsUploadDialogOpen(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Excel
            </Button>
            <Button onClick={onAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>
        </div>
      </div>

      <QuestionSearch 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      <QuestionList 
        questions={questions}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onEdit={onEdit}
        showSubjectColumns={false}
      />

      <ExcelUploadDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onSuccess={() => {
          setIsUploadDialogOpen(false);
          handleRefresh();
        }}
        selectedSubject={selectedSubject}
      />
    </>
  );
};
