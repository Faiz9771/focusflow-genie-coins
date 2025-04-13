
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";

const TaskSummaryCard = () => {
  // In a real app, these would be fetched from state/API
  const taskSummary = {
    completed: 4,
    pending: 3,
    upcoming: 5
  };
  
  const productivityScore = 85; // 0-100
  
  const getProductivityColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  };
  
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Today's Progress</h3>
          <div className={cn(
            "flex items-center gap-1.5",
            getProductivityColor(productivityScore)
          )}>
            <BarChart className="h-4 w-4" />
            <span className="font-semibold">{productivityScore}%</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-2">
          <div className="flex flex-col items-center py-2 bg-secondary rounded-md">
            <div className="flex items-center gap-1 text-green-500 mb-1">
              <CheckCircle2 className="h-4 w-4" />
              <span className="font-semibold">{taskSummary.completed}</span>
            </div>
            <span className="text-xs text-muted-foreground">Completed</span>
          </div>
          
          <div className="flex flex-col items-center py-2 bg-secondary rounded-md">
            <div className="flex items-center gap-1 text-amber-500 mb-1">
              <Clock className="h-4 w-4" />
              <span className="font-semibold">{taskSummary.pending}</span>
            </div>
            <span className="text-xs text-muted-foreground">In Progress</span>
          </div>
          
          <div className="flex flex-col items-center py-2 bg-secondary rounded-md">
            <div className="flex items-center gap-1 text-blue-500 mb-1">
              <Clock className="h-4 w-4" />
              <span className="font-semibold">{taskSummary.upcoming}</span>
            </div>
            <span className="text-xs text-muted-foreground">Upcoming</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskSummaryCard;
