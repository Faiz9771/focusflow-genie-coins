
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame } from "lucide-react";

const StreakCard = () => {
  // In a real app, these would be fetched from state/API
  const currentStreak = 7;
  const bestStreak = 14;
  const streakProgress = 70; // percentage complete to next streak milestone
  
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Productivity Streak</h3>
          <div className="flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-orange-500 animate-pulse-gentle" />
            <span className="font-semibold text-lg">{currentStreak}</span>
            <span className="text-muted-foreground text-xs">days</span>
          </div>
        </div>
        
        <Progress value={streakProgress} className="h-2" />
        
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>{streakProgress}% to next reward</span>
          <span>Best: {bestStreak} days</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakCard;
