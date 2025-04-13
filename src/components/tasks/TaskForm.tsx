
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Clock, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const taskFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"], {
    required_error: "Please select a priority.",
  }),
  category: z.enum(["academic", "personal", "work"], {
    required_error: "Please select a category.",
  }),
  dueDate: z.date().optional().nullable(),
  estimatedMinutes: z.coerce.number().int().min(1).optional().nullable(),
})

interface TaskFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: any;
}

export default function TaskForm({ onSuccess, onCancel, initialData }: TaskFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!initialData;

  const form = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      priority: "medium",
      category: "personal",
      dueDate: null,
      estimatedMinutes: null,
    }
  });

  const onSubmit = async (values: z.infer<typeof taskFormSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Prepare task data with proper field formatting for Supabase
      const taskData = {
        title: values.title,
        description: values.description || null,
        priority: values.priority,
        category: values.category,
        due_date: values.dueDate ? values.dueDate.toISOString() : null,
        estimated_minutes: values.estimatedMinutes
      };
      
      // Handle editing vs. creating
      if (isEditing) {
        const { error } = await supabase
          .from('tasks')
          .update(taskData)
          .eq('id', initialData.id);
          
        if (error) throw error;
        toast.success("Task updated successfully!");
      } else {
        // For new tasks, we need to include user_id
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          toast.error("You need to be logged in to create tasks");
          return;
        }
        
        const { error } = await supabase
          .from('tasks')
          .insert([{
            ...taskData,
            user_id: session.user.id
          }]);
          
        if (error) throw error;
        toast.success("Task created successfully!");
      }
      
      if (onSuccess) onSuccess();
      form.reset();
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("Failed to save task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter task title..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add details about your task..." 
                  className="resize-none" 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low" className="text-green-500">Low</SelectItem>
                    <SelectItem value="medium" className="text-amber-500">Medium</SelectItem>
                    <SelectItem value="high" className="text-red-500">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
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
                    <SelectItem value="academic" className="text-blue-500">Academic</SelectItem>
                    <SelectItem value="personal" className="text-purple-500">Personal</SelectItem>
                    <SelectItem value="work" className="text-emerald-500">Work</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ?? undefined}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                    {field.value && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 ml-auto mr-2 mb-2"
                        onClick={() => field.onChange(null)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear
                      </Button>
                    )}
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estimatedMinutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Time (minutes)</FormLabel>
                <FormControl>
                  <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring">
                    <Clock className="ml-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      className="border-0 focus-visible:ring-0"
                      placeholder="Estimated minutes"
                      {...field}
                      onChange={event => {
                        const value = event.target.value === '' ? null : parseInt(event.target.value);
                        field.onChange(value);
                      }}
                      value={field.value === null ? '' : field.value}
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
            {isSubmitting ? "Saving..." : isEditing ? "Update Task" : "Create Task"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
