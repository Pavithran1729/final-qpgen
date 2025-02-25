import { supabase } from "@/integrations/supabase/client";

export const findQuestionsBySubject = async (subjectCode: string) => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('subject_code', subjectCode);
  
  if (error) throw error;
  return data;
};

export const insertQuestion = async (question: any) => {
  const { data, error } = await supabase
    .from('questions')
    .insert(question)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateQuestion = async (id: string, question: any) => {
  const { data, error } = await supabase
    .from('questions')
    .update(question)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteQuestion = async (id: string) => {
  const { error } = await supabase
    .from('questions')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return { success: true };
};

export const insertQuestions = async (questions: any[]) => {
  const { data, error } = await supabase
    .from('questions')
    .insert(questions)
    .select();
  
  if (error) throw error;
  return data;
};