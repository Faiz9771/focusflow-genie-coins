
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { earnCoins } from '@/lib/coinSystem';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { CustomProgress } from '@/components/ui/custom-progress';

const StreakChallengeCard = () => {
  // In a real app, these would be fetched from state/API
  const currentStreak = 7;
  const streakGoal = 10;
  const streakProgress = (currentStreak / streakGoal) * 100;
  const challengeReward = 50;
  
  const handleClaimReward = () => {
    if (currentStreak >= streakGoal) {
      earnCoins(challengeReward, "10-Day Streak Challenge");
      toast.success("Challenge completed!", {
        description: `Your consistency earned you ${challengeReward} coins!`
      });
    } else {
      toast("Keep going!", {
        description: `You need ${streakGoal - currentStreak} more days to complete this challenge.`
      });
    }
  };
  
  return (
    <Card className="border-amber-200 bg-gradient-to-br from-white to-amber-50">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Flame className="h-5 w-5 text-amber-500" />
            Streak Challenge
          </CardTitle>
          <Badge variant="outline" className="bg-amber-100 text-amber-700 gap-1">
            <Trophy className="h-3.5 w-3.5" />
            Level 1
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2 space-y-4">
        <p className="text-sm text-muted-foreground">
          Complete tasks for {streakGoal} days in a row to earn {challengeReward} coins!
        </p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Current streak</span>
            <div className="flex items-center gap-1 font-medium">
              <Flame className="h-4 w-4 text-amber-500" />
              {currentStreak} days
            </div>
          </div>
          
          <CustomProgress 
            value={streakProgress} 
            className="h-2.5 bg-amber-100" 
            indicatorClassName="bg-amber-500"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0 days</span>
            <span>Goal: {streakGoal} days</span>
          </div>
        </div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Button 
            variant="outline" 
            className={`w-full gap-1.5 ${currentStreak >= streakGoal ? 'bg-amber-500 text-white hover:bg-amber-600' : ''}`}
            onClick={handleClaimReward}
          >
            <Gift className="h-4 w-4" />
            {currentStreak >= streakGoal ? 'Claim Reward' : `${streakGoal - currentStreak} days to go`}
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default StreakChallengeCard;
