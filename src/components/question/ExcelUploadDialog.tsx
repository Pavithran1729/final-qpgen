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

      const { error: insertError } = await supabase
        .from('questions')
        .insert(
          questions.map(q => {
            const { content, hasFormula } = detectFormula(q.Question);
            const validatedPart = validatePart(q.Part);
            console.log('Converted question:', { 
              original: q.Question, 
              converted: content, 
              hasFormula,
              part: validatedPart
            });
            
            return {
              content,
              marks: q.Mark,
              k_level: q['K-Level'],
              part: validatedPart,
              co_level: q.CO,
              user_id: user.id,
              subject_id: selectedSubject.id,
              spreadsheet_url: filePath,
              has_formula: hasFormula
            };
          })
        );

      if (insertError) {
        console.error('Insert Error:', insertError);
        throw insertError;
      }

      await queryClient.invalidateQueries({ queryKey: ['questions'] });
      if (selectedSubject.id) {
        await queryClient.invalidateQueries({ 
          queryKey: ['questions', selectedSubject.id] 
        });
      }
      toast.success("Questions imported successfully");
      onSuccess();
      onOpenChange(false);
      setFile(null);
    } catch (error) {
      console.error('Error importing questions:', error);
      toast.error("Failed to import questions. Please check the console for details.");
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
