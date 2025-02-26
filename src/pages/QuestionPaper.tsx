import { useState, useEffect } from "react";
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
    regulations: [],
  });

  const [topicQuestions, setTopicQuestions] = useState<TopicQuestion[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<MappedQuestion[]>([]);
  const [availableKLevels, setAvailableKLevels] = useState<string[]>(["K1", "K2", "K3", "K4", "K5", "K6"]);
  const [availableCOLevels, setAvailableCOLevels] = useState<string[]>(["CO1", "CO2", "CO3", "CO4", "CO5"]);

  // Fetch available levels when subject changes
  useEffect(() => {
    const fetchLevels = async () => {
      if (!formData.subject_id || !formData.tests || formData.tests.length === 0) return;

      try {
        const selectedTest = formData.tests[0];
        if (!selectedTest) return;
        const testToCO: { [key: string]: string } = {
          'Unit Test 1': 'CO1',
          'Unit Test 2': 'CO2',
          'Unit Test 3': 'CO3',
          'Unit Test 4': 'CO4',
          'Unit Test 5': 'CO5'
        };

        // Map any variation of unit test names to standardized format
        const normalizedTest = selectedTest.replace(/UNIT TEST -/, 'Unit Test');
        const requiredCO = testToCO[normalizedTest];

        if (!requiredCO) {
          console.error('Could not map test to CO level:', selectedTest);
          return;
        }

        console.log(`Successfully mapped "${selectedTest}" to ${requiredCO}`);

        // Fetch available levels from questions table for the selected subject and CO level
        const { data: questions, error } = await supabase
          .from('questions')
          .select('k_level, co_level')
          .eq('subject_id', formData.subject_id)
          .eq('co_level', requiredCO);

        if (error) {
          console.error('Error fetching levels:', error);
          return;
        }

        if (questions && questions.length > 0) {
          // Extract unique k-levels and co-levels
          const kLevels = [...new Set(questions.map(q => q.k_level))].filter(Boolean);
          const coLevels = [...new Set(questions.map(q => q.co_level))].filter(Boolean);

          // Update state only if we found levels
          if (kLevels.length > 0) setAvailableKLevels(kLevels);
          if (coLevels.length > 0) setAvailableCOLevels(coLevels);
        }
      } catch (error) {
        console.error('Error in fetchLevels:', error);
      }
    };

    // Reset levels when subject or test changes
    setAvailableKLevels(["K1", "K2", "K3", "K4", "K5", "K6"]);
    setAvailableCOLevels(["CO1", "CO2", "CO3", "CO4", "CO5"]);
    
    // Then fetch new levels
    fetchLevels();
  }, [formData.subject_id, formData.tests]);

  const handleAutoSelect = async () => {
    if (!formData.subject_id) {
      toast.error("Please select a subject first");
      return;
    }

    try {
      if (!formData.tests || formData.tests.length === 0) {
        toast.error("Please select a test type first");
        return;
      }
      
      const selectedTest = formData.tests[0]; // Use the first selected test
      if (!selectedTest) return;
      
      // Map test to CO level
      const testToCO: { [key: string]: string } = {
        'Unit Test 1': 'CO1',
        'Unit Test 2': 'CO2',
        'Unit Test 3': 'CO3',
        'Unit Test 4': 'CO4',
        'Unit Test 5': 'CO5'
      };
      
      const normalizedTest = selectedTest.replace(/UNIT TEST -/, 'Unit Test');
      const requiredCO = testToCO[normalizedTest];
      
      if (!requiredCO) {
        console.error('Could not map test to CO level:', selectedTest);
        return;
      }

      console.log(`Fetching questions for ${selectedTest} mapped to ${requiredCO}`);

      // Fetch questions for the subject filtered by CO level
      const { data: questions, error } = await supabase
        .from('questions')
        .select('*')
        .eq('subject_id', formData.subject_id)
        .eq('co_level', requiredCO);

      if (error) {
        console.error('Error fetching questions:', error);
        toast.error("Failed to fetch questions");
        return;
      }

      if (!questions || questions.length === 0) {
        toast.error("No questions available for this subject");
        return;
      }

      // Group questions by part and marks
      const groupedQuestions = questions.reduce((acc: any, q) => {
        const key = `${q.part}_${q.marks}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(q);
        return acc;
      }, {});

      // Clear existing questions
      setTopicQuestions([]);

      const template: TopicQuestion[] = [];

      // Helper function to get random questions
      const getRandomQuestions = (part: string, marks: number, count: number, needsOr: boolean = false) => {
        const key = `${part}_${marks}`;
        const available = groupedQuestions[key] || [];
        
        if (available.length < (needsOr ? 2 : 1) * count) {
          throw new Error(`Not enough ${marks}-mark questions available for Part ${part}`);
        }

        for (let i = 0; i < count; i++) {
          const mainIndex = Math.floor(Math.random() * available.length);
          const mainQuestion = available.splice(mainIndex, 1)[0];

          const question: TopicQuestion = {
            id: String(Date.now() + template.length),
            content: mainQuestion.content,
            part: mainQuestion.part,
            marks: String(mainQuestion.marks),
            kLevel: mainQuestion.k_level,
            coLevel: mainQuestion.co_level,
            hasFormula: mainQuestion.has_formula || false,
            hasOr: needsOr ? "true" : "false",
          };

          if (needsOr) {
            const orIndex = Math.floor(Math.random() * available.length);
            const orQuestion = available.splice(orIndex, 1)[0];
            question.orContent = orQuestion.content;
            question.orMarks = String(orQuestion.marks);
            question.orKLevel = orQuestion.k_level;
            question.orPart = orQuestion.part;
            question.orCoLevel = orQuestion.co_level;
            question.orHasFormula = orQuestion.has_formula || false;
          }

          template.push(question);
        }
      };

      // Select questions according to template
      try {
        getRandomQuestions("A", 2, 5); // 5 2-mark questions for Part A
        getRandomQuestions("B", 12, 2, true); // 2 12-mark questions with OR for Part B
        getRandomQuestions("C", 16, 1, true); // 1 16-mark question with OR for Part C

        setTopicQuestions(template);
        toast.success("Questions auto-selected successfully!");
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to auto-select questions");
        }
      }
    } catch (error) {
      console.error('Error in handleAutoSelect:', error);
      toast.error("Failed to auto-select questions");
    }
  };

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
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={async () => {
                            if (topicQuestions.length > 0) {
                              if (window.confirm("This will clear all existing questions. Do you want to continue?")) {
                                await handleAutoSelect();
                              }
                            } else {
                              await handleAutoSelect();
                            }
                          }}
                          disabled={!formData.subject_id || !formData.tests || formData.tests.length === 0}
                          title={!formData.subject_id ? "Select a subject first" : !formData.tests || formData.tests.length === 0 ? "Select a test type first" : "Auto-select questions based on test's CO mapping"}
                        >
                          Auto Select Template
                        </Button>
                        <Button type="button" variant="outline" onClick={addNewQuestion}>
                          Add Question
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {topicQuestions.map((question, index) => (
                        <QuestionForm
                          key={question.id}
                          question={question}
                          updateQuestion={updateQuestion}
                          onDelete={deleteQuestion}
                          questionNumber={index + 1}
                          availableKLevels={availableKLevels}
                          availableCOLevels={availableCOLevels}
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
