
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Plus,
  Tag,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  Lightbulb
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { earnCoins } from '@/lib/coinSystem';
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { fetchTasks, deleteTask, updateTaskStatus, suggestOptimalTimeForTask } from "@/services/taskService";
import { supabase } from "@/integrations/supabase/client";
import CreateTaskDialog from './CreateTaskDialog';
import EditTaskDialog from './EditTaskDialog';

// Task types for our app
type TaskPriority = "high" | "medium" | "low";
type TaskCategory = "academic" | "personal" | "work";
type TaskStatus = "pending" | "in_progress" | "completed";

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  due_date: string | null;
  priority: TaskPriority;
  category: TaskCategory;
  estimated_minutes: number | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  completed_at: string | null;
  reminder_time: string | null;
}

const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case "high":
      return "text-red-500 border-red-200 bg-red-50";
    case "medium":
      return "text-amber-500 border-amber-200 bg-amber-50";
    case "low":
      return "text-green-500 border-green-200 bg-green-50";
  }
};

const getCategoryColor = (category: TaskCategory) => {
  switch (category) {
    case "academic":
      return "bg-blue-100 text-blue-600";
    case "personal":
      return "bg-purple-100 text-purple-600";
    case "work":
      return "bg-emerald-100 text-emerald-600";
  }
};

const formatDueDate = (date: string | null) => {
  if (!date) return "";
  
  const taskDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const taskDay = new Date(taskDate);
  taskDay.setHours(0, 0, 0, 0);
  
  if (taskDay.getTime() === today.getTime()) return "Today";
  if (taskDay.getTime() === tomorrow.getTime()) return "Tomorrow";
  
  return taskDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const isTaskOverdue = (dueDate: string | null) => {
  if (!dueDate) return false;
  
  const now = new Date();
  const taskDate = new Date(dueDate);
  return taskDate < now;
};

const TaskItem = ({ 
  task, 
  onToggleComplete, 
  onDelete,
  onEditRequest 
}: { 
  task: Task, 
  onToggleComplete: (task: Task) => void,
  onDelete: (taskId: string) => void,
  onEditRequest: (task: Task) => void
}) => {
  const [showOptimalTime, setShowOptimalTime] = useState(false);
  const optimalTime = suggestOptimalTimeForTask(task.category);
  
  const completed = task.status === "completed";
  const overdue = !completed && isTaskOverdue(task.due_date);
  
  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-lg border",
      "hover:bg-secondary/50 transition-colors",
      completed && "opacity-60",
      overdue && !completed && "border-red-200 bg-red-50"
    )}>
      <Checkbox 
        checked={completed}
        onCheckedChange={() => onToggleComplete(task)}
        className={cn("rounded-full h-5 w-5", 
          completed ? "bg-focusflow-purple border-focusflow-purple text-primary-foreground" : "border-2"
        )}
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={cn(
            "text-sm font-medium truncate",
            completed && "line-through text-muted-foreground"
          )}>
            {task.title}
          </p>
          
          {overdue && !completed && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>This task is overdue!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-5 w-5 rounded-full"
                  onClick={() => setShowOptimalTime(!showOptimalTime)}
                >
                  <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Best time to work on this: {optimalTime}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {task.description && (
          <p className="text-xs text-muted-foreground truncate mt-0.5 max-w-md">
            {task.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2 mt-1">
          {task.due_date && (
            <div className={cn(
              "flex items-center gap-1 text-xs",
              overdue && !completed ? "text-red-500" : "text-muted-foreground"
            )}>
              <Calendar className="h-3 w-3" />
              <span>{formatDueDate(task.due_date)}</span>
            </div>
          )}
          
          {task.estimated_minutes && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{task.estimated_minutes} min</span>
            </div>
          )}
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Tag className="h-3 w-3" />
            <Badge variant="outline" className={getCategoryColor(task.category)}>
              {task.category}
            </Badge>
          </div>
        </div>
      </div>
      
      <Badge variant="outline" className={cn("text-xs", getPriorityColor(task.priority))}>
        {task.priority}
      </Badge>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEditRequest(task)}>Edit</DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => {
              navigator.clipboard.writeText(task.title);
              toast.success("Copied to clipboard!");
            }}
          >
            Copy title
          </DropdownMenuItem>
          <DropdownMenuItem>Set reminder</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-red-500"
            onClick={() => onDelete(task.id)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const loadTasks = async () => {
    setLoading(true);
    const fetchedTasks = await fetchTasks();
    // Ensure the fetched tasks match our Task interface
    setTasks(fetchedTasks as Task[]);
    setLoading(false);
  };
  
  useEffect(() => {
    loadTasks();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('public:tasks')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks'
      }, () => {
        loadTasks();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const handleToggleComplete = async (task: Task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    const success = await updateTaskStatus(task.id, newStatus);
    
    if (success && newStatus === "completed") {
      let coinsEarned = 0;
      switch (task.priority) {
        case "high": 
          coinsEarned = 10;
          break;
        case "medium":
          coinsEarned = 5;
          break;
        case "low":
          coinsEarned = 3;
          break;
      }
      
      earnCoins(coinsEarned, `Completing "${task.title}"`);
      toast.success(`Task completed! +${coinsEarned} coins`);
    }
    
    loadTasks();
  };
  
  const handleDeleteTask = async (taskId: string) => {
    const success = await deleteTask(taskId);
    if (success) {
      toast.success("Task deleted successfully");
      loadTasks();
    }
  };
  
  const pendingTasks = tasks.filter(task => task.status !== "completed");
  const completedTasks = tasks.filter(task => task.status === "completed");
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">My Tasks</CardTitle>
        <CreateTaskDialog onTaskCreated={loadTasks} />
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-secondary animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {pendingTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No pending tasks. Create one to get started!</p>
                </div>
              ) : (
                pendingTasks.map(task => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDeleteTask}
                    onEditRequest={setEditingTask}
                  />
                ))
              )}
            </div>
            
            {completedTasks.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium text-muted-foreground">Completed</h3>
                </div>
                <div className="space-y-2">
                  {completedTasks.map(task => (
                    <TaskItem 
                      key={task.id} 
                      task={task}
                      onToggleComplete={handleToggleComplete}
                      onDelete={handleDeleteTask}
                      onEditRequest={setEditingTask}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
      
      {/* Edit Task Dialog */}
      {editingTask && (
        <EditTaskDialog 
          open={!!editingTask} 
          onOpenChange={(open) => {
            if (!open) setEditingTask(null);
          }}
          task={editingTask}
          onTaskUpdated={loadTasks}
        />
      )}
    </Card>
  );
};

export default TaskList;
