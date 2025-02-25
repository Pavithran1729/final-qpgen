
import { Button } from "@/components/ui/button";
import { FormFields } from "@/components/question/FormFields";
import { CheckedState } from "@radix-ui/react-checkbox";
import { TopicQuestion } from "@/types/question";
import { useState } from "react";

interface QuestionFormProps {
  question: TopicQuestion;
  updateQuestion: (id: string, field: string, value: string) => void;
  onDelete: (id: string) => void;
  questionNumber: number;
}

export const QuestionForm = ({
  question,
  updateQuestion,
  onDelete,
  questionNumber,
}: QuestionFormProps) => {
  const [content, setContent] = useState(question.content || "");
  const [orContent, setOrContent] = useState(question.orContent || "");
  const [hasFormula, setHasFormula] = useState(question.hasFormula || false);
  const [orHasFormula, setOrHasFormula] = useState(question.orHasFormula || false);

  const handleOrChange = (checked: CheckedState) => {
    updateQuestion(question.id, "hasOr", checked ? "true" : "false");
    if (!checked) {
      // Clear OR fields when disabled
      updateQuestion(question.id, "orMarks", "");
      updateQuestion(question.id, "orKLevel", "");
      updateQuestion(question.id, "orPart", "");
      updateQuestion(question.id, "orCoLevel", "");
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Question {questionNumber}</h3>
        <Button variant="ghost" onClick={() => onDelete(question.id)}>
          Remove
        </Button>
      </div>

      <div className="space-y-6">
        <FormFields
          content={content}
          setContent={setContent}
          mark={question.marks || ""}
          setMark={(value) => updateQuestion(question.id, "marks", value)}
          kLevel={question.kLevel || ""}
          setKLevel={(value) => updateQuestion(question.id, "kLevel", value)}
          part={question.part || ""}
          setPart={(value) => updateQuestion(question.id, "part", value)}
          coLevel={question.coLevel || ""}
          setCoLevel={(value) => updateQuestion(question.id, "coLevel", value)}
          hasOr={question.hasOr === "true"}
          setHasOr={handleOrChange}
          orContent={orContent}
          setOrContent={setOrContent}
          orMark={question.orMarks || ""}
          setOrMark={(value) => updateQuestion(question.id, "orMarks", value)}
          orKLevel={question.orKLevel || ""}
          setOrKLevel={(value) => updateQuestion(question.id, "orKLevel", value)}
          orPart={question.orPart || ""}
          setOrPart={(value) => updateQuestion(question.id, "orPart", value)}
          orCoLevel={question.orCoLevel || ""}
          setOrCoLevel={(value) => updateQuestion(question.id, "orCoLevel", value)}
          hasFormula={hasFormula}
          setHasFormula={setHasFormula}
          orHasFormula={orHasFormula}
          setOrHasFormula={setOrHasFormula}
        />
      </div>
    </div>
  );
};
