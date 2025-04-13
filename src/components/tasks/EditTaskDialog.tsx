
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TaskForm from "./TaskForm";

interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: any;
  onTaskUpdated?: () => void;
}

export default function EditTaskDialog({ 
  open, 
  onOpenChange,
  task,
  onTaskUpdated 
}: EditTaskDialogProps) {
  const handleSuccess = () => {
    onOpenChange(false);
    if (onTaskUpdated) onTaskUpdated();
  };

  // Transform the task data to match the form fields
  const formData = task ? {
    ...task,
    dueDate: task.due_date ? new Date(task.due_date) : null,
    estimatedMinutes: task.estimated_minutes
  } : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <TaskForm 
          initialData={formData} 
          onSuccess={handleSuccess} 
          onCancel={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
}
