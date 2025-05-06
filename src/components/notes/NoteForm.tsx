
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { BookOpen, Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

const noteFormSchema = z.object({
  title: z.string().min(2, {
    message: "Note title must be at least 2 characters.",
  }),
  content: z.string().optional(),
  category: z.enum(["general", "study", "work", "personal", "idea"], {
    required_error: "Please select a category.",
  }),
  tags: z.string().optional(),
});

interface NoteFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function NoteForm({ onSuccess, onCancel }: NoteFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof noteFormSchema>>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "general",
      tags: "",
    },
  });

  async function onSubmit(values: z.infer<typeof noteFormSchema>) {
    try {
      setIsSubmitting(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error("You must be logged in to add a note");
        return;
      }

      // Process tags if provided
      const tags = values.tags ? 
        values.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : 
        null;

      const noteData = {
        user_id: session.user.id,
        title: values.title,
        content: values.content || null,
        category: values.category,
        tags: tags,
      };

      const { error } = await supabase
        .from('notes')
        .insert([noteData]);

      if (error) throw error;

      toast.success("Note added successfully!");
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring">
                  <BookOpen className="ml-2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Note title" 
                    className="border-0 focus-visible:ring-0" 
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Write your note here..."
                  className="min-h-[150px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="study">Study</SelectItem>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="idea">Idea</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags (comma-separated)</FormLabel>
                <FormControl>
                  <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring">
                    <Tag className="ml-2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="e.g., important, todo, meeting" 
                      className="border-0 focus-visible:ring-0" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Add Note"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
