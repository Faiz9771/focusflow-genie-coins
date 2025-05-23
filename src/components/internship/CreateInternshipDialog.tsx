
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
import InternshipForm from './InternshipForm';

interface CreateInternshipDialogProps {
  trigger?: React.ReactNode;
  onInternshipCreated?: () => void;
}

export default function CreateInternshipDialog({ 
  trigger, 
  onInternshipCreated 
}: CreateInternshipDialogProps) {
  const [open, setOpen] = useState(false);
  
  const handleSuccess = () => {
    setOpen(false);
    if (onInternshipCreated) onInternshipCreated();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm">
            <Plus className="mr-1 h-4 w-4" />
            Add Application
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add Internship Application</DialogTitle>
          <DialogDescription>
            Track your internship applications and their status
          </DialogDescription>
        </DialogHeader>
        <InternshipForm onSuccess={handleSuccess} onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
