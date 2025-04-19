
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CustomProgress } from "@/components/ui/custom-progress";
import { PlayCircle, PauseCircle, StopCircle, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StudyBuddy from './StudyBuddy';
import TimerSettings from './TimerSettings';

interface PomodoroTimerProps {
  isOpen: boolean;
  onClose: () => void;
  initialWorkDuration?: number;
  initialBreakDuration?: number;
}

const PomodoroTimer = ({ 
  isOpen, 
  onClose, 
  initialWorkDuration = 25,
  initialBreakDuration = 5
}: PomodoroTimerProps) => {
  const [workDuration, setWorkDuration] = useState(initialWorkDuration);
  const [breakDuration, setBreakDuration] = useState(initialBreakDuration);
  const [timeLeft, setTimeLeft] = useState(initialWorkDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize timer with provided durations
    setWorkDuration(initialWorkDuration);
    setBreakDuration(initialBreakDuration);
    setTimeLeft(initialWorkDuration * 60);
  }, [initialWorkDuration, initialBreakDuration]);

  useEffect(() => {
    let interval: number;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000) as unknown as number;
    } else if (timeLeft === 0) {
      if (!isBreak) {
        toast({
          title: "Work Session Complete!",
          description: "Time for a break.",
        });
        setTimeLeft(breakDuration * 60);
        setIsBreak(true);
      } else {
        toast({
          title: "Break Complete!",
          description: "Ready to start another session?",
        });
        setTimeLeft(workDuration * 60);
        setIsBreak(false);
        setIsRunning(false);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak, toast, workDuration, breakDuration]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(workDuration * 60);
    setIsBreak(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSaveSettings = (newWorkDuration: number, newBreakDuration: number) => {
    setWorkDuration(newWorkDuration);
    setBreakDuration(newBreakDuration);
    setTimeLeft(newWorkDuration * 60);
    setShowSettings(false);
    resetTimer();
  };

  const progress = isBreak
    ? ((breakDuration * 60 - timeLeft) / (breakDuration * 60)) * 100
    : ((workDuration * 60 - timeLeft) / (workDuration * 60)) * 100;

  if (showSettings) {
    return (
      <TimerSettings
        workDuration={workDuration}
        breakDuration={breakDuration}
        onSave={handleSaveSettings}
        onCancel={() => setShowSettings(false)}
      />
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-white to-purple-50 dark:from-gray-950 dark:to-gray-900">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-focusflow-purple">
            {isBreak ? "Break Time! 🌟" : "Focus Session 🎯"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-6 py-4">
          <StudyBuddy isBreak={isBreak} isRunning={isRunning} />
          
          <div className="text-5xl font-bold tracking-tighter text-focusflow-purple">
            {formatTime(timeLeft)}
          </div>
          
          <div className="w-full space-y-2">
            <CustomProgress 
              value={progress} 
              className="w-full h-4 rounded-full"
              indicatorClassName={
                isBreak 
                  ? "bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500" 
                  : "bg-gradient-to-r from-focusflow-purple to-purple-500 transition-all duration-500"
              }
            />
            <p className="text-center text-sm text-muted-foreground">
              {isBreak 
                ? `${Math.floor((timeLeft / (breakDuration * 60)) * 100)}% of break left`
                : `${Math.floor((timeLeft / (workDuration * 60)) * 100)}% of focus time left`
              }
            </p>
          </div>
          
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTimer}
              className="h-14 w-14 rounded-full border-2 border-focusflow-purple hover:bg-focusflow-purple hover:text-white transition-all duration-300"
            >
              {isRunning ? (
                <PauseCircle className="h-7 w-7" />
              ) : (
                <PlayCircle className="h-7 w-7" />
              )}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={resetTimer}
              className="h-14 w-14 rounded-full border-2 border-focusflow-purple hover:bg-focusflow-purple hover:text-white transition-all duration-300"
            >
              <StopCircle className="h-7 w-7" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowSettings(true)}
              className="h-14 w-14 rounded-full border-2 border-focusflow-purple hover:bg-focusflow-purple hover:text-white transition-all duration-300"
            >
              <Settings className="h-7 w-7" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PomodoroTimer;
