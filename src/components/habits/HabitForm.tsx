
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Calendar, Heart, Timer } from "lucide-react";

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
import { supabase } from "@/integrations/supabase/client";

const habitFormSchema = z.object({
  name: z.string().min(2, {
    message: "Habit name must be at least 2 characters.",
  }),
  category: z.enum(["health", "learning", "productivity", "other"], {
    required_error: "Please select a category.",
  }),
  frequency: z.enum(["daily", "weekly", "weekdays", "weekends"], {
    required_error: "Please select a frequency.",
  }),
  target_per_period: z.coerce.number().int().min(1, {
    message: "Target must be at least 1.",
  }),
});

interface HabitFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function HabitForm({ onSuccess, onCancel }: HabitFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof habitFormSchema>>({
    resolver: zodResolver(habitFormSchema),
    defaultValues: {
      name: "",
      category: "health",
      frequency: "daily",
      target_per_period: 1,
    },
  });

  async function onSubmit(values: z.infer<typeof habitFormSchema>) {
    try {
      setIsSubmitting(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error("You must be logged in to add a habit");
        return;
      }

      const habitData = {
        user_id: session.user.id,
        name: values.name,
        category: values.category,
        frequency: values.frequency,
        target_per_period: values.target_per_period,
        created_at: new Date().toISOString(),
        streak: 0,
        total_completions: 0,
      };

      const { error } = await supabase
        .from('habits')
        .insert([habitData]);

      if (error) throw error;

      toast.success("Habit added successfully!");
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving habit:", error);
      toast.error("Failed to save habit");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Habit Name</FormLabel>
              <FormControl>
                <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring">
                  <Heart className="ml-2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="E.g., Morning Workout, Reading, Meditation" 
                    className="border-0 focus-visible:ring-0" 
                    {...field} 
                  />
                </div>
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
                    <SelectItem value="health">Health & Fitness</SelectItem>
                    <SelectItem value="learning">Learning</SelectItem>
                    <SelectItem value="productivity">Productivity</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequency</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="weekdays">Weekdays</SelectItem>
                    <SelectItem value="weekends">Weekends</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="target_per_period"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target (Times per period)</FormLabel>
              <FormControl>
                <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring">
                  <Timer className="ml-2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="number"
                    min="1"
                    className="border-0 focus-visible:ring-0" 
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Add Habit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
