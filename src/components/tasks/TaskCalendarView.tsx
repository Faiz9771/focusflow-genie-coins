
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { fetchTasksForCalendar } from '@/services/taskService';
import { format, isSameDay } from 'date-fns';
import { Loader2, CalendarIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type CalendarTask = {
  id: string;
  title: string;
  date: string;
  status: string;
  priority: string;
  category: string;
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "text-red-500 border-red-200 bg-red-50";
    case "medium":
      return "text-amber-500 border-amber-200 bg-amber-50";
    case "low":
      return "text-green-500 border-green-200 bg-green-50";
    default:
      return "text-gray-500 border-gray-200 bg-gray-50";
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "academic":
      return "bg-blue-100 text-blue-600";
    case "personal":
      return "bg-purple-100 text-purple-600";
    case "work":
      return "bg-emerald-100 text-emerald-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const TaskCalendarView: React.FC = () => {
  const [tasks, setTasks] = useState<CalendarTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasksForDay, setTasksForDay] = useState<CalendarTask[]>([]);
  
  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      const calendarTasks = await fetchTasksForCalendar();
      setTasks(calendarTasks);
      setLoading(false);
    };
    
    loadTasks();
  }, []);
  
  useEffect(() => {
    // Filter tasks for the selected date
    if (selectedDate) {
      const filteredTasks = tasks.filter(task => 
        isSameDay(new Date(task.date), selectedDate)
      );
      setTasksForDay(filteredTasks);
    }
  }, [selectedDate, tasks]);
  
  // Function to determine if a date has tasks
  const hasTasksOnDate = (date: Date) => {
    return tasks.some(task => isSameDay(new Date(task.date), date));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardContent className="p-4">
              {loading ? (
                <div className="flex items-center justify-center h-96">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="w-full pointer-events-auto"
                  modifiers={{
                    hasTasks: (date) => hasTasksOnDate(date),
                  }}
                  modifiersStyles={{
                    hasTasks: { 
                      fontWeight: 'bold', 
                      textDecoration: 'underline', 
                      textDecorationColor: 'rgb(147, 51, 234)'
                    },
                  }}
                  components={{
                    DayContent: ({ date, ...props }) => (
                      <div className="relative">
                        <div {...props}>{date.getDate()}</div>
                        {hasTasksOnDate(date) && (
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-1 bg-purple-500 rounded-full" />
                        )}
                      </div>
                    ),
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          <Card className="h-full">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="h-5 w-5 text-primary" />
                <h3 className="font-medium">
                  Tasks for {format(selectedDate, 'MMMM d, yyyy')}
                </h3>
              </div>
              
              {tasksForDay.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No tasks scheduled for this day
                </div>
              ) : (
                <div className="space-y-3">
                  {tasksForDay.map(task => (
                    <div 
                      key={task.id} 
                      className={cn(
                        "p-3 rounded-md border",
                        task.status === "completed" ? "opacity-60" : ""
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className={cn(
                          "font-medium",
                          task.status === "completed" ? "line-through text-muted-foreground" : ""
                        )}>
                          {task.title}
                        </h4>
                        <Badge variant="outline" className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className={getCategoryColor(task.category)}>
                          {task.category}
                        </Badge>
                        <Badge variant="outline" className={
                          task.status === "completed" 
                            ? "bg-green-100 text-green-600" 
                            : "bg-amber-100 text-amber-600"
                        }>
                          {task.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaskCalendarView;
