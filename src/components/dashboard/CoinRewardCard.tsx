
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Gift } from "lucide-react";
import { Link } from 'react-router-dom';
import { earnCoins } from '@/lib/coinSystem';

const CoinRewardCard = () => {
  // In a real app, these would be fetched from state/API
  const tasksCompleted = 2;
  const tasksGoal = 5;
  const coinsReward = 15;
  
  const handleClaimDaily = () => {
    // Simulating daily rewards - in a real app this would check if already claimed today
    if (tasksCompleted >= tasksGoal) {
      earnCoins(coinsReward, "Completing daily goal");
    }
  };
  
  return (
    <Card className="border-dashed">
      <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-3">
        <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
          <Coins className="h-5 w-5 text-yellow-600" />
        </div>
        
        <div>
          <h3 className="font-medium">Complete Daily Goals</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {tasksCompleted >= tasksGoal 
              ? `Claim your ${coinsReward} coins reward!` 
              : `Finish ${tasksGoal - tasksCompleted} more tasks today to earn ${coinsReward} coins`}
          </p>
        </div>
        
        <div className="flex flex-col gap-2 w-full">
          {tasksCompleted >= tasksGoal && (
            <Button 
              variant="default" 
              size="sm" 
              className="w-full text-xs gap-1.5 bg-yellow-500 hover:bg-yellow-600"
              onClick={handleClaimDaily}
            >
              <Gift className="h-3.5 w-3.5" />
              Claim Reward
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs gap-1.5"
            asChild
          >
            <Link to="/shop">
              <Coins className="h-3.5 w-3.5" />
              Visit Coin Shop
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoinRewardCard;
