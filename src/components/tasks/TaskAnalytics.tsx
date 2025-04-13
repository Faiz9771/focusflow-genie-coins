
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { BarChart, Clock, Brain, Zap } from "lucide-react";

interface TaskAnalyticsProps {
  stats: {
    productivityScore: number;
    focusTime: number;
    taskCompletionRate: number;
    energyLevel: number;
    peakHours: string;
    mostProductiveCategory: string;
    procrastinationPatterns: string[];
  }
}

export default function TaskAnalytics({ stats }: TaskAnalyticsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart className="h-5 w-5 text-purple-500" />
          Productivity Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-1 text-sm">
            <span>Productivity Score</span>
            <span className="font-semibold">{stats.productivityScore}%</span>
          </div>
          <Progress value={stats.productivityScore} className="h-2" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              Focus Time
            </h4>
            <p className="text-2xl font-bold">{stats.focusTime} hrs</p>
            <p className="text-xs text-muted-foreground">Tracked this week</p>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Brain className="h-4 w-4 text-emerald-500" />
              Task Completion
            </h4>
            <p className="text-2xl font-bold">{stats.taskCompletionRate}%</p>
            <p className="text-xs text-muted-foreground">Of tasks completed on time</p>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Productivity Insights</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-secondary rounded-md p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <Clock className="h-4 w-4 text-purple-500" />
                <h5 className="text-xs font-medium">Peak Hours</h5>
              </div>
              <p className="text-sm font-semibold">{stats.peakHours}</p>
            </div>
            
            <div className="bg-secondary rounded-md p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <Zap className="h-4 w-4 text-amber-500" />
                <h5 className="text-xs font-medium">Best Category</h5>
              </div>
              <p className="text-sm font-semibold capitalize">{stats.mostProductiveCategory}</p>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Procrastination Patterns</h4>
          <ul className="text-sm space-y-1">
            {stats.procrastinationPatterns.map((pattern, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0"></span>
                <span>{pattern}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
