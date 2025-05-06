
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProjectForm from './ProjectForm';

interface CreateProjectDialogProps {
  trigger?: React.ReactNode;
  onProjectCreated?: () => void;
}

export default function CreateProjectDialog({ 
  trigger, 
  onProjectCreated 
}: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false);
  
  const handleSuccess = () => {
    setOpen(false);
    if (onProjectCreated) onProjectCreated();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm">
            <Plus className="mr-1 h-4 w-4" />
            New Project
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Add a project to track your progress and goals.
          </DialogDescription>
        </DialogHeader>
        <ProjectForm onSuccess={handleSuccess} onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
