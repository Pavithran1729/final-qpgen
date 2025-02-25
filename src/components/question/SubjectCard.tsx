import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Pencil, RefreshCw, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface SubjectCardProps {
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  questionCount: number;
  onClick: () => void;
}

export const SubjectCard = ({ 
  subjectId,
  subjectCode, 
  subjectName, 
  questionCount, 
  onClick 
}: SubjectCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newCode, setNewCode] = useState(subjectCode);
  const [newName, setNewName] = useState(subjectName);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const handleEdit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEditing) {
      try {
        const { error } = await supabase
          .from('subjects')
          .update({
            subject_code: newCode,
            subject_name: newName
          })
          .eq('id', subjectId);

        if (error) {
          console.error('Error updating subject:', error);
          if (error.code === '23505') {
            toast.error("A subject with this code already exists");
          } else {
            toast.error(`Failed to update subject: ${error.message}`);
          }
          return;
        }
        
        toast.success("Subject updated successfully");
        queryClient.invalidateQueries({ queryKey: ['subjects'] });
        setIsEditing(false);
      } catch (error: any) {
        console.error('Error updating subject:', error);
        toast.error(error.message || "Failed to update subject");
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast.success("Question bank refreshed");
    } catch (error) {
      toast.error("Failed to refresh question bank");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // First, delete all questions associated with this subject
      const { error: questionsError } = await supabase
        .from('questions')
        .delete()
        .eq('subject_id', subjectId);

      if (questionsError) {
        console.error('Error deleting questions:', questionsError);
        throw questionsError;
      }

      // Then delete the subject
      const { error: subjectError } = await supabase
        .from('subjects')
        .delete()
        .eq('id', subjectId);

      if (subjectError) {
        console.error('Error deleting subject:', subjectError);
        throw subjectError;
      }

      toast.success("Subject and associated questions deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      setShowDeleteDialog(false);
    } catch (error: any) {
      console.error('Error in delete operation:', error);
      toast.error(error.message || "Failed to delete subject");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (!isEditing) {
      onClick();
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleCardClick}>
        <CardHeader>
          <CardTitle className="text-lg flex justify-between items-center">
            {isEditing ? (
              <Input
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-32"
              />
            ) : (
              <span>{subjectCode}</span>
            )}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEdit}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteDialog(true);
                }}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="mb-2"
            />
          ) : (
            <p className="text-gray-600 mb-2">{subjectName}</p>
          )}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{questionCount} questions</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="ml-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="ml-2">Refresh</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the subject "{subjectCode} - {subjectName}" and all its questions.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
