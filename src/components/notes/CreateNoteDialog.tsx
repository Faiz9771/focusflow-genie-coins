
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
import NoteForm from './NoteForm';

interface CreateNoteDialogProps {
  trigger?: React.ReactNode;
  onNoteCreated?: () => void;
}

export default function CreateNoteDialog({ 
  trigger, 
  onNoteCreated 
}: CreateNoteDialogProps) {
  const [open, setOpen] = useState(false);
  
  const handleSuccess = () => {
    setOpen(false);
    if (onNoteCreated) onNoteCreated();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm">
            <Plus className="mr-1 h-4 w-4" />
            Add Note
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
          <DialogDescription>
            Add a note to capture your thoughts, ideas, and important information.
          </DialogDescription>
        </DialogHeader>
        <NoteForm onSuccess={handleSuccess} onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
