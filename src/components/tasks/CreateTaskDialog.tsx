
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TaskForm from "./TaskForm";

interface CreateTaskDialogProps {
  trigger?: React.ReactNode;
  onTaskCreated?: () => void;
}

export default function CreateTaskDialog({ 
  trigger, 
  onTaskCreated 
}: CreateTaskDialogProps) {
  const [open, setOpen] = React.useState(false);
  
  const handleSuccess = () => {
    setOpen(false);
    if (onTaskCreated) onTaskCreated();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm">
            <Plus className="mr-1 h-4 w-4" />
            Create Task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <TaskForm onSuccess={handleSuccess} onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
