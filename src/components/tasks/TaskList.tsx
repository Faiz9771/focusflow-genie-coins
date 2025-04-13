import React, { useState } from 'react';
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
  CheckCircle2
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

// Task types for our app
type TaskPriority = "high" | "medium" | "low";
type TaskCategory = "academic" | "personal" | "work";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: Date | null;
  priority: TaskPriority;
  category: TaskCategory;
  estimatedMinutes: number | null;
}

// Demo tasks data
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Complete research paper outline",
    completed: false,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    priority: "high",
    category: "academic",
    estimatedMinutes: 60,
  },
  {
    id: "2",
    title: "Study for midterm exam",
    completed: false,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    priority: "high",
    category: "academic",
    estimatedMinutes: 120,
  },
  {
    id: "3",
    title: "Gym session",
    completed: false,
    dueDate: new Date(), // Today
    priority: "medium",
    category: "personal",
    estimatedMinutes: 45,
  },
  {
    id: "4", 
    title: "Update resume",
    completed: true,
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
    priority: "medium",
    category: "work",
    estimatedMinutes: 30,
  },
  {
    id: "5",
    title: "Team project meeting",
    completed: false,
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
    priority: "medium",
    category: "work",
    estimatedMinutes: 60,
  }
];

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

const formatDueDate = (date: Date | null) => {
  if (!date) return "";
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const taskDate = new Date(date);
  taskDate.setHours(0, 0, 0, 0);
  
  if (taskDate.getTime() === today.getTime()) return "Today";
  if (taskDate.getTime() === tomorrow.getTime()) return "Tomorrow";
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const TaskItem = ({ task, onToggleComplete }: { task: Task, onToggleComplete: (task: Task) => void }) => {
  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-lg border",
      "hover:bg-secondary/50 transition-colors",
      task.completed && "opacity-60"
    )}>
      <Checkbox 
        checked={task.completed}
        onCheckedChange={() => onToggleComplete(task)}
        className={cn("rounded-full h-5 w-5", 
          task.completed ? "bg-focusflow-purple border-focusflow-purple text-primary-foreground" : "border-2"
        )}
      />
      
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-medium truncate",
          task.completed && "line-through text-muted-foreground"
        )}>
          {task.title}
        </p>
        
        <div className="flex flex-wrap gap-2 mt-1">
          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formatDueDate(task.dueDate)}</span>
            </div>
          )}
          
          {task.estimatedMinutes && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{task.estimatedMinutes} min</span>
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
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Set reminder</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  
  const handleToggleComplete = (task: Task) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === task.id) {
        const newCompletedState = !t.completed;
        
        if (newCompletedState) {
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
        }
        
        return { ...t, completed: newCompletedState };
      }
      return t;
    });
    
    setTasks(updatedTasks);
  };
  
  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">My Tasks</CardTitle>
        <Button size="sm" variant="outline" className="gap-1">
          <Plus className="h-4 w-4" />
          <span>Add Task</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {incompleteTasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onToggleComplete={handleToggleComplete}
            />
          ))}
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
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskList;
