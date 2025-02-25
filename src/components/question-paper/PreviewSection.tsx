import { Button } from "@/components/ui/button";
import { TopicQuestion, MappedQuestion } from "@/types/question";
import { FormData } from "@/types/form";
import { useNavigate } from "react-router-dom";

interface PreviewSectionProps {
  formData: FormData;
  selectedQuestions: MappedQuestion[];
  setPreviewMode: (mode: boolean) => void;
  handleGeneratePaper: () => void;
}

export const PreviewSection = ({ 
  formData, 
  selectedQuestions, 
  setPreviewMode, 
  handleGeneratePaper 
}: PreviewSectionProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4 border-b pb-6">
        <h2 className="text-xl font-bold">{formData.department.join(", ")}</h2>
        <p>{formData.subject_code} - {formData.subject_name}</p>
        <p>Year: {formData.year.join(", ")}</p>
        <p>Semester: {formData.semester.join(", ")}</p>
        <p>Date: {formData.date.join(", ")}</p>
      </div>
      
      <div className="space-y-6">
        {selectedQuestions.map((q, idx) => (
          <div key={q.id} className="space-y-4">
            {/* Main Question */}
            <div className="border-b pb-4">
              <p className="font-medium">
                {idx + 1}a. Part {q.part} - {q.marks} marks (K{q.kLevel})
              </p>
              <p className="mt-2">{q.content}</p>
            </div>
            
            {/* OR Question */}
            {q.hasOr === "true" && q.orContent && (
              <div className="border-b pb-4 mt-2">
                <p className="font-medium text-gray-700">OR</p>
                <p className="font-medium">
                  {idx + 1}b. Part {q.orPart || q.part} - {q.orMarks || q.marks} marks (K{q.orKLevel || q.kLevel})
                </p>
                <p className="mt-2">{q.orContent}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/question-paper/generate')}
        >
          Cancel
        </Button>
        <Button variant="outline" onClick={() => setPreviewMode(false)}>
          Edit
        </Button>
        <Button onClick={handleGeneratePaper}>
          Generate Paper
        </Button>
      </div>
    </div>
  );
};