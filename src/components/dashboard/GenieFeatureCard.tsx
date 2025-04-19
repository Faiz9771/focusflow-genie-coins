
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { spendCoins } from '@/lib/coinSystem';
import { toast } from 'sonner';
import GenieRecommendationsModal from '@/components/pomodoro/GenieRecommendationsModal';
import PomodoroTimer from '@/components/pomodoro/PomodoroTimer';

const GenieFeatureCard = () => {
  const [showGenie, setShowGenie] = useState(false);
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [pomodoroSettings, setPomodoroSettings] = useState({
    workDuration: 25,
    breakDuration: 5
  });
  
  const coinCost = 5;
  
  const handleAskGenie = () => {
    if (spendCoins(coinCost, "Ask Genie")) {
      setShowGenie(true);
      toast.success("Genie is analyzing your tasks...", {
        description: "Your personalized schedule will be ready in a moment."
      });
    }
  };

  const handleApplyPomodoroSettings = (workDuration: number, breakDuration: number) => {
    setPomodoroSettings({ workDuration, breakDuration });
    setShowGenie(false);
    setShowPomodoro(true);
  };
  
  return (
    <>
      <Card className="overflow-hidden border-focusflow-purple/30 bg-gradient-to-br from-white to-focusflow-purple/5">
        <CardContent className="p-0">
          <div className="p-5 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-focusflow-purple/10 rounded-full -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-focusflow-blue/5 rounded-full -ml-10 -mb-10"></div>
            
            <div className="relative z-10">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-8 w-8 rounded-full gradient-bg flex items-center justify-center shadow-sm">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold gradient-text">Genie Assistant</h3>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                Let our AI Genie organize your tasks, suggest optimal study times, and help you balance your workload.
              </p>
              
              <div className="flex items-center gap-3">
                <Button 
                  className="bg-focusflow-purple hover:bg-focusflow-purple-dark"
                  onClick={handleAskGenie}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Ask Genie
                </Button>
                <span className="text-xs text-muted-foreground">{coinCost} coins per use</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Genie Modal */}
      {showGenie && (
        <GenieRecommendationsModal 
          isOpen={showGenie} 
          onClose={() => setShowGenie(false)}
          onApplyPomodoroSettings={handleApplyPomodoroSettings}
        />
      )}

      {/* Pomodoro Timer with Custom Settings */}
      {showPomodoro && (
        <PomodoroTimer 
          isOpen={showPomodoro} 
          onClose={() => setShowPomodoro(false)}
          initialWorkDuration={pomodoroSettings.workDuration}
          initialBreakDuration={pomodoroSettings.breakDuration}
        />
      )}
    </>
  );
};

export default GenieFeatureCard;
