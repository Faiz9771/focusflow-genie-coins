
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.23.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing userId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://fqjyfsawplidqouxbhpn.supabase.co';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey!);

    // Fetch user's tasks
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId);

    if (tasksError) {
      throw new Error(`Error fetching tasks: ${tasksError.message}`);
    }

    // Fetch user's productivity logs
    const { data: prodLogs, error: prodLogsError } = await supabase
      .from('productivity_logs')
      .select('*')
      .eq('user_id', userId);

    if (prodLogsError) {
      throw new Error(`Error fetching productivity logs: ${prodLogsError.message}`);
    }

    // Process tasks and logs to generate insights
    const pendingTasks = tasks.filter(task => task.status !== 'completed');
    const completedTasks = tasks.filter(task => task.status === 'completed');

    // Extract insights based on user data
    // 1. Identify high priority tasks
    const highPriorityTasks = pendingTasks.filter(task => task.priority === 'high');
    
    // 2. Find tasks with approaching deadlines
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const urgentTasks = pendingTasks.filter(task => {
      if (!task.due_date) return false;
      const dueDate = new Date(task.due_date);
      return dueDate <= tomorrow;
    });
    
    // 3. Calculate optimal work schedule based on estimated time
    const workSchedule = generateOptimalSchedule(pendingTasks, prodLogs);
    
    // 4. Identify procrastination patterns
    const procrastinationPatterns = identifyProcrastinationPatterns(tasks, prodLogs);
    
    // 5. Generate productivity tips
    const productivityTips = generateProductivityTips(procrastinationPatterns);

    // Return the genie recommendations
    const recommendations = {
      highPriorityRecommendations: processHighPriorityTasks(highPriorityTasks, urgentTasks),
      timeManagement: workSchedule,
      procrastinationPatterns,
      productivityTips,
      suggestedPomodoro: suggestPomodoroSettings(prodLogs)
    };

    return new Response(
      JSON.stringify(recommendations),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("Error in genie-recommendations function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function to generate optimal schedule based on tasks and productivity logs
function generateOptimalSchedule(tasks, prodLogs) {
  // Default time blocks if not enough data is available
  const defaultTimeBlocks = [
    { startTime: '09:00', endTime: '11:00', activityType: 'Deep Work', recommendation: 'Schedule high priority and complex tasks' },
    { startTime: '11:00', endTime: '12:00', activityType: 'Admin Tasks', recommendation: 'Handle emails and small administrative tasks' },
    { startTime: '13:30', endTime: '15:30', activityType: 'Collaborative Work', recommendation: 'Schedule meetings and collaborative tasks' },
    { startTime: '15:30', endTime: '17:00', activityType: 'Learning & Growth', recommendation: 'Work on personal development tasks' }
  ];

  // If there's not enough data, return default recommendations
  if (!prodLogs || prodLogs.length < 5) {
    return {
      message: "Based on general productivity patterns, here's a recommended schedule:",
      timeBlocks: defaultTimeBlocks
    };
  }

  // Analyze productivity logs to find optimal work times
  // This is a simplified ML algorithm that would typically analyze patterns
  // In a real implementation, this would be more sophisticated
  const completedSessions = prodLogs.filter(log => log.end_time && log.focus_score);
  
  // Sort by focus score to identify high-productivity times
  completedSessions.sort((a, b) => (b.focus_score || 0) - (a.focus_score || 0));
  
  // Extract time patterns from high-performing sessions
  const topSessions = completedSessions.slice(0, Math.min(3, completedSessions.length));
  
  const optimalTimeBlocks = topSessions.map(session => {
    const startTime = new Date(session.start_time);
    const endTime = new Date(session.end_time || startTime);
    
    return {
      startTime: `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}`,
      endTime: `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`,
      activityType: 'Deep Work',
      recommendation: 'This is your peak productivity time based on past performance',
      focusScore: session.focus_score
    };
  });
  
  return {
    message: "Based on your productivity patterns, here are your optimal work times:",
    timeBlocks: optimalTimeBlocks.length > 0 ? optimalTimeBlocks : defaultTimeBlocks
  };
}

// Helper function to identify procrastination patterns
function identifyProcrastinationPatterns(tasks, prodLogs) {
  const patterns = [];
  
  // Check for overdue tasks
  const overdueTasks = tasks.filter(task => {
    if (!task.due_date || task.status === 'completed') return false;
    return new Date(task.due_date) < new Date();
  });
  
  if (overdueTasks.length > 2) {
    patterns.push({
      type: 'deadline_missing',
      message: 'You have multiple overdue tasks. Consider setting more realistic deadlines or breaking tasks into smaller pieces.'
    });
  }
  
  // Check for last-minute completion pattern
  const lastMinuteCompletions = tasks.filter(task => {
    if (!task.due_date || !task.completed_at) return false;
    const dueDate = new Date(task.due_date);
    const completionDate = new Date(task.completed_at);
    const hoursDifference = (dueDate.getTime() - completionDate.getTime()) / (1000 * 60 * 60);
    return hoursDifference <= 3; // Completed within 3 hours of deadline
  });
  
  if (lastMinuteCompletions.length > 2) {
    patterns.push({
      type: 'last_minute_rush',
      message: 'You tend to complete tasks just before deadlines. Try breaking work into smaller milestones with earlier completion dates.'
    });
  }
  
  // Analysis of task duration vs. estimated time
  if (prodLogs && prodLogs.length > 0) {
    let timeEstimationIssues = 0;
    
    prodLogs.forEach(log => {
      if (!log.task_id || !log.start_time || !log.end_time) return;
      
      const task = tasks.find(t => t.id === log.task_id);
      if (!task || !task.estimated_minutes) return;
      
      const startTime = new Date(log.start_time);
      const endTime = new Date(log.end_time);
      const actualMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
      
      // If actual time is significantly longer than estimated
      if (actualMinutes > task.estimated_minutes * 1.5) {
        timeEstimationIssues++;
      }
    });
    
    if (timeEstimationIssues >= 3) {
      patterns.push({
        type: 'poor_time_estimation',
        message: 'You consistently underestimate how long tasks will take. Try multiplying your time estimates by 1.5 for more realistic planning.'
      });
    }
  }
  
  // Add default pattern if none detected
  if (patterns.length === 0) {
    patterns.push({
      type: 'insufficient_data',
      message: 'Not enough data to identify clear procrastination patterns yet. Continue logging your work to receive personalized insights.'
    });
  }
  
  return patterns;
}

// Helper function to generate productivity tips based on procrastination patterns
function generateProductivityTips(procrastinationPatterns) {
  const tips = [
    "Use the Pomodoro technique: 25 minutes of focus followed by a 5-minute break.",
    "Break large tasks into smaller, manageable sub-tasks.",
    "Start your day with your most important task (MIT).",
    "Set specific and realistic goals for each work session.",
    "Remove distractions from your workspace before starting focused work."
  ];
  
  // Add personalized tips based on procrastination patterns
  procrastinationPatterns.forEach(pattern => {
    switch(pattern.type) {
      case 'deadline_missing':
        tips.push("Try the '2-minute rule': If a task takes less than 2 minutes, do it immediately.");
        tips.push("Schedule buffer time between tasks to account for unexpected delays.");
        break;
      case 'last_minute_rush':
        tips.push("Set personal deadlines 2-3 days before the actual deadline.");
        tips.push("Use a visual progress tracker to motivate consistent work.");
        break;
      case 'poor_time_estimation':
        tips.push("Log how long tasks actually take to improve future estimates.");
        tips.push("Use the 'triple time' rule: estimate your time, then multiply by three.");
        break;
    }
  });
  
  // Return random selection of 3 tips
  return tips
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
}

// Helper function to suggest optimal Pomodoro settings
function suggestPomodoroSettings(prodLogs) {
  // Default recommendations
  let workDuration = 25;
  let breakDuration = 5;
  
  // If enough data, customize based on user's focus patterns
  if (prodLogs && prodLogs.length >= 5) {
    const completedLogs = prodLogs.filter(log => log.end_time && log.start_time);
    
    if (completedLogs.length >= 3) {
      // Calculate average work session duration
      const avgSessionMinutes = completedLogs.reduce((sum, log) => {
        const start = new Date(log.start_time);
        const end = new Date(log.end_time || start);
        return sum + ((end.getTime() - start.getTime()) / (1000 * 60));
      }, 0) / completedLogs.length;
      
      // Round to nearest 5 minutes and constrain between 15-45 minutes
      workDuration = Math.min(45, Math.max(15, Math.round(avgSessionMinutes / 5) * 5));
      
      // Calculate break based on work duration (roughly 1/5 of work time)
      breakDuration = Math.min(15, Math.max(3, Math.round(workDuration / 5)));
    }
  }
  
  return {
    workDuration,
    breakDuration,
    explanation: `Based on your productivity patterns, a ${workDuration}-minute work session followed by a ${breakDuration}-minute break should be optimal for your focus rhythm.`
  };
}

// Helper function to process high priority tasks
function processHighPriorityTasks(highPriorityTasks, urgentTasks) {
  let recommendations = [];
  
  // Combine high priority and urgent tasks, removing duplicates
  const priorityTaskIds = new Set(highPriorityTasks.map(task => task.id));
  const combinedTasks = [
    ...highPriorityTasks,
    ...urgentTasks.filter(task => !priorityTaskIds.has(task.id))
  ];
  
  // Sort by due date (if available) then by priority
  combinedTasks.sort((a, b) => {
    // First sort by due date if available
    if (a.due_date && b.due_date) {
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    } else if (a.due_date) {
      return -1; // a has due date, b doesn't
    } else if (b.due_date) {
      return 1; // b has due date, a doesn't
    }
    
    // If dates are equal or not available, sort by priority
    const priorityValues = { high: 0, medium: 1, low: 2 };
    return priorityValues[a.priority] - priorityValues[b.priority];
  });
  
  // Generate specific recommendations for up to 3 tasks
  const topTasks = combinedTasks.slice(0, 3);
  
  recommendations = topTasks.map(task => {
    let recommendation = {
      taskId: task.id,
      title: task.title,
      priority: task.priority
    };
    
    if (task.due_date) {
      const dueDate = new Date(task.due_date);
      const today = new Date();
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 0) {
        recommendation.message = `This task is overdue! Make it your top priority.`;
      } else if (diffDays === 1) {
        recommendation.message = `Due tomorrow! Complete today to avoid last-minute stress.`;
      } else {
        recommendation.message = `Due in ${diffDays} days. Start now to avoid procrastination.`;
      }
    } else if (task.priority === 'high') {
      recommendation.message = `High priority task with no deadline. Schedule it this week.`;
    }
    
    // Add time estimate if available
    if (task.estimated_minutes) {
      recommendation.timeEstimate = `${task.estimated_minutes} minutes`;
    }
    
    return recommendation;
  });
  
  // If no tasks, add a general recommendation
  if (recommendations.length === 0) {
    recommendations.push({
      message: "You have no high priority or urgent tasks. Great job staying on top of things!"
    });
  }
  
  return recommendations;
}
