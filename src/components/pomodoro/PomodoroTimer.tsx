
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CustomProgress } from "@/components/ui/custom-progress";
import { PlayCircle, PauseCircle, StopCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PomodoroTimerProps {
  isOpen: boolean;
  onClose: () => void;
}

const PomodoroTimer = ({ isOpen, onClose }: PomodoroTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let interval: number;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000) as unknown as number;
    } else if (timeLeft === 0) {
      if (!isBreak) {
        // Work session completed, start break
        toast({
          title: "Work Session Complete!",
          description: "Time for a 5-minute break.",
        });
        setTimeLeft(5 * 60); // 5 minute break
        setIsBreak(true);
      } else {
        // Break completed, reset for next work session
        toast({
          title: "Break Complete!",
          description: "Ready to start another session?",
        });
        setTimeLeft(25 * 60);
        setIsBreak(false);
        setIsRunning(false);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak, toast]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
    setIsBreak(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = isBreak
    ? ((5 * 60 - timeLeft) / (5 * 60)) * 100
    : ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isBreak ? "Break Time" : "Focus Session"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="text-4xl font-bold tracking-tighter">
            {formatTime(timeLeft)}
          </div>
          
          <CustomProgress 
            value={progress} 
            className="w-full h-3"
            indicatorClassName={isBreak ? "bg-green-500" : "bg-focusflow-purple"}
          />
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTimer}
              className="h-12 w-12"
            >
              {isRunning ? (
                <PauseCircle className="h-6 w-6" />
              ) : (
                <PlayCircle className="h-6 w-6" />
              )}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={resetTimer}
              className="h-12 w-12"
            >
              <StopCircle className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PomodoroTimer;
