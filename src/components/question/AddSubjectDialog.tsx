import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface AddSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const AddSubjectDialog = ({ open, onOpenChange, onSuccess }: AddSubjectDialogProps) => {
  const [subjectCode, setSubjectCode] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectCode || !subjectName) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to add subjects");
        return;
      }

      console.log('Attempting to add subject:', {
        subject_code: subjectCode,
        subject_name: subjectName,
        user_id: user.id
      });

      // Insert the new subject
      const { data, error } = await supabase
        .from('subjects')
        .insert({
          subject_code: subjectCode,
          subject_name: subjectName,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        if (error.code === '23505') { // Unique constraint violation
          toast.error("A subject with this code already exists");
        } else {
          toast.error(`Failed to add subject: ${error.message}`);
        }
        return;
      }

      if (!data) {
        console.error('No data returned after insert');
        toast.error("Failed to add subject: No data returned");
        return;
      }

      console.log('Subject added successfully:', data);

      // Invalidate and refetch queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['subjects'] }),
        queryClient.refetchQueries({ queryKey: ['subjects'] })
      ]);

      toast.success("Subject added successfully");
      onSuccess();
      onOpenChange(false);
      setSubjectCode("");
      setSubjectName("");
    } catch (error: any) {
      console.error('Error adding subject:', error);
      toast.error(error.message || "Failed to add subject");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
          <DialogDescription>
            Add a new subject to your question bank. Subject code must be unique.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Subject Code</label>
            <Input
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              placeholder="Enter subject code"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Subject Name</label>
            <Input
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="Enter subject name"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Subject"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};