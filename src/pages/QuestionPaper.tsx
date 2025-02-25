import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BasicInfoForm } from "@/components/question-paper/BasicInfoForm";
import { QuestionForm } from "@/components/question-paper/QuestionForm";
import { supabase } from "@/integrations/supabase/client";
import { generateQuestionPaperDoc } from "@/utils/docGenerator";
import { PreviewSection } from "@/components/question-paper/PreviewSection";
import { selectRandomQuestions } from "@/utils/questionSelection";
import { FormData } from "@/types/form";
import { TopicQuestion, QuestionFromDB, MappedQuestion, mapDBQuestionToTopicQuestion } from "@/types/question";

const QuestionPaper = () => {
  const [formData, setFormData] = useState<FormData>({
    department: [],
    year: [],
    semester: [],
    subject_id: "",
    subject_code: "",
    subject_name: "",
    tests: [],
    duration: "",
    date: [],
  });

  const [topicQuestions, setTopicQuestions] = useState<TopicQuestion[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<MappedQuestion[]>([]);

  const addNewQuestion = () => {
    const newQuestion: TopicQuestion = {
      id: String(Date.now()),
      part: "",
      marks: "",
      kLevel: "",
      coLevel: "",
      hasOr: "false",
      orContent: "",
      orMarks: "",
      orKLevel: "",
      orPart: "",
      orCoLevel: "",
    };
    setTopicQuestions([...topicQuestions, newQuestion]);
  };

  const updateQuestion = (id: string, field: keyof TopicQuestion, value: string) => {
    setTopicQuestions(questions =>
      questions.map(q =>
        q.id === id ? { ...q, [field]: value } : q
      )
    );
  };

  const deleteQuestion = (id: string) => {
    setTopicQuestions(questions => questions.filter(q => q.id !== id));
  };

  const validateForm = () => {
    if (!formData.department || !formData.year || !formData.subject_id) {
      toast.error("Please fill in all basic information fields");
      return false;
    }
    if (topicQuestions.length === 0) {
      toast.error("Please add at least one question");
      return false;
    }
    for (const q of topicQuestions) {
      if (!q.part || !q.marks || !q.kLevel || !q.coLevel) {
        toast.error("Please fill in all question fields");
        return false;
      }
    }
    return true;
  };

  const handlePreview = async () => {
    if (!validateForm()) return;

    try {
      console.log('Form data:', formData);
      console.log('Topic questions:', topicQuestions);

      const { data: questions, error } = await supabase
        .from('questions')
        .select(`
          *,
          subject:subjects(
            id,
            subject_code,
            subject_name
          )
        `)
        .eq('subject_id', formData.subject_id);

      if (error) {
        console.error('Database error:', error);
        toast.error(`Failed to fetch questions: ${error.message}`);
        return;
      }

      if (!questions || questions.length === 0) {
        toast.error("No questions found for this subject");
        return;
      }

      console.log('Available questions from DB:', questions);

      const selected = selectRandomQuestions(questions as QuestionFromDB[], topicQuestions);
      console.log('Selected questions:', selected);
      
      if (!selected || selected.length === 0) {
        console.error('No matching questions found. Requirements:', topicQuestions);
        console.error('Available questions:', questions);
        toast.error("No matching questions found for your requirements");
        return;
      }

      if (selected.length !== topicQuestions.length) {
        const missing = topicQuestions.length - selected.length;
        console.error('Missing questions. Found:', selected.length, 'Required:', topicQuestions.length);
        toast.error(`Could not find enough matching questions. Missing ${missing} question(s).`);
        return;
      }

      const mappedQuestions = selected.map((q, index) => {
        console.log(`Mapping question ${index}:`, q);
        const mapped = mapDBQuestionToTopicQuestion(q);
        console.log(`Mapped question ${index}:`, mapped);
        return mapped;
      });

      setSelectedQuestions(mappedQuestions);
      setPreviewMode(true);
      toast.success("Preview generated successfully!");
      
    } catch (error) {
      console.error('Error generating preview:', error);
      toast.error("Failed to generate preview. Please check console for details.");
    }
  };

  const handleGeneratePaper = async () => {
    if (!validateForm()) return;
    
    try {
      const blob = await generateQuestionPaperDoc(formData, selectedQuestions);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formData.subject_code}_question_paper.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Question paper generated successfully!");
    } catch (error) {
      console.error('Error generating paper:', error);
      toast.error("Failed to generate question paper");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {previewMode ? "Preview Question Paper" : "Generate Question Paper"}
          </h1>
          
          <div className="bg-white shadow-sm rounded-lg p-6 border">
            {previewMode ? (
              <PreviewSection
                formData={formData}
                selectedQuestions={selectedQuestions}
                setPreviewMode={setPreviewMode}
                handleGeneratePaper={handleGeneratePaper}
              />
            ) : (
              <form className="space-y-6">
                <BasicInfoForm formData={formData} setFormData={setFormData} />

                <div className="col-span-2">
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">Questions</h2>
                      <Button type="button" variant="outline" onClick={addNewQuestion}>
                        Add Question
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {topicQuestions.map((question, index) => (
                        <QuestionForm
                          key={question.id}
                          question={question}
                          updateQuestion={updateQuestion}
                          onDelete={deleteQuestion}
                          questionNumber={index + 1}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" onClick={handlePreview}>
                    Preview
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuestionPaper;
