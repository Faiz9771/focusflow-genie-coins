
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function fetchTasks() {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    toast.error("Failed to load tasks");
    return [];
  }
}

export async function deleteTask(taskId: string) {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    toast.error("Failed to delete task");
    return false;
  }
}

export async function updateTaskStatus(taskId: string, status: string) {
  try {
    const { error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', taskId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating task status:', error);
    toast.error("Failed to update task status");
    return false;
  }
}

export async function logProductivity(taskId: string, startTime: Date) {
  try {
    // Get the current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error('User must be logged in to log productivity');
      return false;
    }
    
    const { error } = await supabase
      .from('productivity_logs')
      .insert([{ 
        task_id: taskId, 
        start_time: startTime.toISOString(),
        user_id: session.user.id
      }]);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error logging productivity:', error);
    return false;
  }
}

export async function endProductivitySession(
  logId: string, 
  endTime: Date, 
  focusScore?: number, 
  energyLevel?: number,
  notes?: string
) {
  try {
    const { error } = await supabase
      .from('productivity_logs')
      .update({ 
        end_time: endTime.toISOString(),
        focus_score: focusScore,
        energy_level: energyLevel,
        notes
      })
      .eq('id', logId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error ending productivity session:', error);
    return false;
  }
}

// Mock data for analytics - in a real app, this would fetch from the backend
export function getTaskAnalytics() {
  return {
    productivityScore: 78,
    focusTime: 12.5,
    taskCompletionRate: 85,
    energyLevel: 72,
    peakHours: "9AM - 11AM",
    mostProductiveCategory: "academic",
    procrastinationPatterns: [
      "You tend to delay academic tasks until late evening",
      "Large tasks often get postponed multiple times",
      "You're more likely to procrastinate on Sundays"
    ]
  };
}

// Utility functions for adaptive scheduling
export function suggestOptimalTimeForTask(taskCategory: string) {
  // In a real app, this would analyze user data and return personalized suggestions
  const suggestions = {
    academic: "Morning (9AM-11AM)",
    work: "Early afternoon (1PM-3PM)",
    personal: "Evening (6PM-8PM)"
  };
  
  return suggestions[taskCategory] || suggestions.personal;
}

export function breakTaskIntoSubtasks(taskTitle: string, taskDescription: string) {
  // In a real app, this would use AI to break down complex tasks
  // This is just a placeholder implementation
  return [
    `Research for ${taskTitle}`,
    `Create outline for ${taskTitle}`,
    `Draft ${taskTitle}`,
    `Review ${taskTitle}`,
    `Finalize ${taskTitle}`
  ];
}
