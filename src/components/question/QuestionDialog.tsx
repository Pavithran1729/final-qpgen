import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuestionForm } from "./QuestionForm";

interface Subject {
  id: string;
  code: string;
  name: string;
}

interface QuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedQuestion: any;
  selectedSubject: Subject | null;
  onSuccess: () => void;
}

export const QuestionDialog = ({ 
  open, 
  onOpenChange, 
  selectedQuestion,
  selectedSubject,
  onSuccess 
}: QuestionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {selectedQuestion ? "Edit Question" : "Add New Question"}
          </DialogTitle>
        </DialogHeader>
        <QuestionForm
          initialData={selectedQuestion || undefined}
          selectedSubject={selectedSubject}
          onSuccess={onSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};