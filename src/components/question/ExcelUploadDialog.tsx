import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from 'xlsx';
import { useQueryClient } from "@tanstack/react-query";

interface Subject {
  id: string;
  code: string;
  name: string;
}

interface ExcelUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  selectedSubject: Subject | null;
}

interface ExcelQuestion {
  'S.No': number;
  'Question': string;
  'Mark': number;
  'K-Level': string;
  'CO': string;
  'Part'?: string;
}

export const ExcelUploadDialog = ({ 
  open, 
  onOpenChange, 
  onSuccess,
  selectedSubject 
}: ExcelUploadDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const processExcelFile = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json<ExcelQuestion>(worksheet);
    console.log('Raw Excel data:', jsonData);
    return jsonData;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const convertToLatex = (formula: string): string => {
    let latexFormula = formula;
    
    // Handle superscripts (e.g., x^2)
    latexFormula = latexFormula.replace(/(\w+)\^(\d+)/g, "$1^{$2}");
    
    // Handle vectors (e.g., ax, ay, az)
    latexFormula = latexFormula.replace(/\b([a])[xyz]\b/g, "\\vec{$1}_$2");
    
    // Handle minus signs with proper spacing
    latexFormula = latexFormula.replace(/\s*-\s*/g, " - ");
    
    // Handle multiplications
    latexFormula = latexFormula.replace(/(\d+)([a-zA-Z])/g, "$1\\,$2");
    
    return `\\(${latexFormula}\\)`;
  };

  const detectFormula = (question: string): { content: string; hasFormula: boolean } => {
    const formulaRegex = /`([^`]+)`/g;
    let hasFormula = false;
    let content = question;
    
    // Replace all formulas in the content with LaTeX
    content = content.replace(formulaRegex, (match, formula) => {
      hasFormula = true;
      const latexFormula = convertToLatex(formula);
      console.log('Converting formula:', { original: formula, latex: latexFormula });
      return latexFormula;
    });
    
    return {
      content,
      hasFormula
    };
  };

  const validatePart = (part?: string): string => {
    const validParts = ['A', 'B', 'C'];
    const normalizedPart = (part || 'A').trim().toUpperCase();
    return validParts.includes(normalizedPart) ? normalizedPart : 'A';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    if (!selectedSubject) {
      toast.error("Please select a subject first");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to upload questions");
        return;
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('excel_files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const questions = await processExcelFile(file);
      console.log('Processed questions:', questions);

      // Validate and transform questions
      const allErrors: string[] = [];
      const validatedQuestions = questions.map((q, index) => {
        const rowNum = index + 1;
        const rowErrors: string[] = [];

        // Validation logic...
        const questionContent = q.Question?.toString().trim() || '';
        if (!questionContent) {
          rowErrors.push(`Row ${rowNum}: Question content cannot be empty`);
        }

        const kLevel = (q['K-Level'] || '').toString().toUpperCase().trim();
        if (!kLevel || !/^K[1-6]$/.test(kLevel)) {
          rowErrors.push(`Row ${rowNum}: K-Level "${kLevel}" must be K1 to K6`);
        }

        const coLevel = (q.CO || '').toString().toUpperCase().trim();
        if (!coLevel || !/^CO[1-5]$/.test(coLevel)) {
          rowErrors.push(`Row ${rowNum}: CO "${coLevel}" must be CO1 to CO5`);
        }

        const marks = Number(q.Mark);
        if (isNaN(marks) || marks <= 0) {
          rowErrors.push(`Row ${rowNum}: Mark "${q.Mark}" must be a positive number`);
        }

        if (rowErrors.length > 0) {
          allErrors.push(...rowErrors);
        }

        const { content, hasFormula } = detectFormula(questionContent);
        const validatedPart = validatePart(q.Part);

        return {
          content: content.trim(),
          marks,
          k_level: kLevel,
          part: validatedPart,
          co_level: coLevel,
          user_id: user.id,
          subject_id: selectedSubject.id,
          spreadsheet_url: filePath,
          has_formula: hasFormula
        };
      });

      if (allErrors.length > 0) {
        throw new Error('Validation failed:\n' + allErrors.map(err => `- ${err}`).join('\n'));
      }

      const { error: insertError } = await supabase
        .from('questions')
        .insert(validatedQuestions);

      if (insertError) {
        console.error('Database Error:', insertError);
        if (insertError.code === '23514') {
          throw new Error(`Database validation failed:\n- K-Level must be K1 to K6\n- CO must be CO1 to CO5`);
        }
        throw insertError;
      }

      await queryClient.invalidateQueries({ queryKey: ['questions'] });
      if (selectedSubject.id) {
        await queryClient.invalidateQueries({ queryKey: ['questions', selectedSubject.id] });
      }

      toast.success("Questions imported successfully");
      onSuccess();
      onOpenChange(false);
      setFile(null);

    } catch (error: any) {
      console.error('Error importing questions:', error);

      if (error instanceof Error && error.message.includes('\n')) {
        // Multiple validation errors
        const errors = error.message.split('\n');
        toast.error(
          <div>
            <p className="font-medium mb-2">Please fix the following errors:</p>
            <ul className="list-disc pl-4 space-y-1 text-sm">
              {errors.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          </div>,
          { duration: 10000 } // Show longer for multiple errors
        );
      } else if (error?.code === '23514') {
        toast.error(
          "Database validation failed. Please ensure:\n" +
          "- K-Levels are K1 to K6\n" +
          "- CO values are CO1 to CO5"
        );
      } else {
        toast.error(error?.message || "Failed to import questions");
      }
      
      // Reset file and form state
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
        setFile(null);
      }
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Questions from Excel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Excel File</label>
            <Input
              type="file"
              onChange={handleFileChange}
              accept=".xlsx,.xls"
              required
            />
            <p className="text-sm text-gray-500">
              File should contain columns: S.No, Question, Mark, K-Level, CO, Part (optional)
            </p>
            <p className="text-sm text-gray-500">
              To mark a formula, wrap it in backticks (`). Mathematical symbols and vectors will be automatically formatted.
            </p>
            <p className="text-sm text-gray-500">
              Part must be either A, B, or C. If not specified, A will be used.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Importing..." : "Import Questions"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
