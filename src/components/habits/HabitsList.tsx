
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart,
  Calendar,
  CheckCircle,
  FileEdit,
  Trash2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type HabitFrequency = "daily" | "weekly" | "weekdays" | "weekends";
type HabitCategory = "health" | "learning" | "productivity" | "other";

type Habit = {
  id: string;
  name: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  target_per_period: number;
  streak: number;
  total_completions: number;
  created_at: string;
};

const categoryColors = {
  health: "bg-green-100 text-green-800 border-green-200",
  learning: "bg-blue-100 text-blue-800 border-blue-200",
  productivity: "bg-purple-100 text-purple-800 border-purple-200",
  other: "bg-gray-100 text-gray-800 border-gray-200",
};

const categoryLabels = {
  health: "Health & Fitness",
  learning: "Learning",
  productivity: "Productivity",
  other: "Other",
};

const frequencyLabels = {
  daily: "Daily",
  weekly: "Weekly",
  weekdays: "Weekdays",
  weekends: "Weekends",
};

export default function HabitsList() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHabits();
  }, []);

  async function fetchHabits() {
    try {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) throw error;
      
      // Type casting the habit data to ensure it matches our Habit type
      const typedData = data?.map(item => ({
        ...item,
        category: item.category as HabitCategory,
        frequency: item.frequency as HabitFrequency
      })) || [];
      
      setHabits(typedData);
    } catch (error) {
      console.error('Error fetching habits:', error);
      toast.error('Failed to load habits');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setHabits(habits.filter(item => item.id !== id));
      toast.success('Habit removed successfully');
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast.error('Failed to delete habit');
    }
  }

  async function handleCompleteHabit(habit: Habit) {
    try {
      // Log this habit completion
      const { error: logError } = await supabase
        .from('habit_logs')
        .insert([{
          habit_id: habit.id,
          user_id: (await supabase.auth.getSession()).data.session?.user?.id,
          completed_at: new Date().toISOString()
        }]);

      if (logError) throw logError;

      // Update the habit streak and total completions
      const { error: updateError } = await supabase
        .from('habits')
        .update({
          streak: habit.streak + 1,
          total_completions: habit.total_completions + 1
        })
        .eq('id', habit.id);

      if (updateError) throw updateError;

      // Fetch updated habits
      fetchHabits();
      
      toast.success('Habit completed!');
    } catch (error) {
      console.error('Error completing habit:', error);
      toast.error('Failed to mark habit as completed');
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="text-center py-10">
        <Heart className="mx-auto h-12 w-12 text-muted-foreground opacity-30 mb-3" />
        <h3 className="text-lg font-medium">No habits yet</h3>
        <p className="text-muted-foreground mb-4">Start building positive habits by adding your first one</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {habits.map(habit => (
        <Card key={habit.id} className="overflow-hidden">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="h-4 w-4 text-red-500" />
                  <h3 className="font-semibold text-lg">{habit.name}</h3>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className={`${categoryColors[habit.category]}`}>
                    {categoryLabels[habit.category]}
                  </Badge>
                  <Badge variant="outline">
                    {frequencyLabels[habit.frequency]}
                  </Badge>
                </div>
              </div>
              <div className="mt-2 sm:mt-0 flex flex-col sm:items-end">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">Streak:</span>
                  <span className="text-amber-500 font-bold">{habit.streak} days</span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Target: {habit.target_per_period} times per {habit.frequency}</span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  <span>Total completions: {habit.total_completions}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end gap-2">
              <Button 
                variant="default" 
                size="sm" 
                className="h-8"
                onClick={() => handleCompleteHabit(habit)}
              >
                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                Complete
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-red-500 hover:text-red-600" 
                onClick={() => handleDelete(habit.id)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Remove
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
