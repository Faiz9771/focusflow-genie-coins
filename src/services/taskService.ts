
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
      toast.error("You need to be logged in to log productivity");
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
    toast.error("Failed to log productivity");
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
    toast.error("Failed to end productivity session");
    return false;
  }
}

// Fetch task analytics data from the database
export async function fetchTaskAnalytics() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("You need to be logged in to view analytics");
      return null;
    }

    // Fetch analytics data
    const { data: analyticsData, error: analyticsError } = await supabase
      .from('task_analytics')
      .select(`
        *,
        tasks (
          title,
          category,
          priority,
          due_date,
          estimated_minutes
        )
      `)
      .eq('user_id', session.user.id);

    if (analyticsError) throw analyticsError;

    // Fetch completed tasks count by category
    const { data: categoryData, error: categoryError } = await supabase
      .from('tasks')
      .select('category, count')
      .eq('user_id', session.user.id)
      .eq('status', 'completed')
      .group('category');

    if (categoryError) throw categoryError;

    // Fetch completion rate statistics
    const { data: completionStats, error: completionError } = await supabase
      .from('tasks')
      .select('status, count')
      .eq('user_id', session.user.id)
      .group('status');

    if (completionError) throw completionError;

    return {
      analytics: analyticsData || [],
      categoryCompletion: categoryData || [],
      completionStats: completionStats || []
    };
  } catch (error) {
    console.error('Error fetching task analytics:', error);
    toast.error("Failed to load analytics data");
    return null;
  }
}

// Fetch tasks for calendar view
export async function fetchTasksForCalendar() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("You need to be logged in to view calendar");
      return [];
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', session.user.id)
      .not('due_date', 'is', null);
      
    if (error) throw error;
    
    // Transform data for calendar view
    return (data || []).map(task => ({
      id: task.id,
      title: task.title,
      date: task.due_date,
      status: task.status,
      priority: task.priority,
      category: task.category
    }));
  } catch (error) {
    console.error('Error fetching tasks for calendar:', error);
    toast.error("Failed to load calendar data");
    return [];
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
