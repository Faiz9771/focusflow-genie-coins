
import React from 'react';
import { Cat, Sparkle, Heart } from 'lucide-react';

interface StudyBuddyProps {
  isBreak: boolean;
  isRunning: boolean;
}

const StudyBuddy = ({ isBreak, isRunning }: StudyBuddyProps) => {
  const getMessage = () => {
    if (isBreak) return "Take a breather! You're doing great! 💕";
    if (isRunning) return "You can do it! I believe in you! ✨";
    return "Ready to focus together? 💪";
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <Cat className="w-16 h-16 text-focusflow-purple" />
        {isRunning && (
          <>
            <Sparkle className="absolute -top-2 -right-2 w-5 h-5 text-focusflow-purple animate-bounce" />
            <Heart className="absolute -bottom-1 right-0 w-4 h-4 text-pink-400 animate-pulse" />
          </>
        )}
      </div>
      <p className="text-sm font-medium text-muted-foreground">{getMessage()}</p>
    </div>
  );
};

export default StudyBuddy;
