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

export async function fetchTaskAnalytics() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("You need to be logged in to view analytics");
      return null;
    }

    const { data: analyticsData, error: analyticsError } = await supabase
      .rpc('get_user_task_analytics', { 
        user_id_param: session.user.id 
      });

    if (analyticsError) {
      console.error('Error fetching analytics:', analyticsError);
      throw analyticsError;
    }

    const { data: categoryData, error: categoryError } = await supabase
      .from('tasks')
      .select('category')
      .eq('user_id', session.user.id)
      .eq('status', 'completed');

    if (categoryError) throw categoryError;

    const categoryCounts = (categoryData || []).reduce((acc, task) => {
      const category = task.category || 'uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const processedCategoryData = Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count
    }));

    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select('status')
      .eq('user_id', session.user.id);

    if (tasksError) throw tasksError;

    const statusCounts = (tasksData || []).reduce((acc, task) => {
      const status = task.status || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const processedStatusData = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count
    }));

    return {
      analytics: analyticsData || [],
      categoryCompletion: processedCategoryData,
      completionStats: processedStatusData
    };
  } catch (error) {
    console.error('Error fetching task analytics:', error);
    toast.error("Failed to load analytics data");
    return null;
  }
}

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

export function suggestOptimalTimeForTask(taskCategory: string) {
  const suggestions = {
    academic: "Morning (9AM-11AM)",
    work: "Early afternoon (1PM-3PM)",
    personal: "Evening (6PM-8PM)"
  };
  
  return suggestions[taskCategory] || suggestions.personal;
}

export function breakTaskIntoSubtasks(taskTitle: string, taskDescription: string) {
  return [
    `Research for ${taskTitle}`,
    `Create outline for ${taskTitle}`,
    `Draft ${taskTitle}`,
    `Review ${taskTitle}`,
    `Finalize ${taskTitle}`
  ];
}
