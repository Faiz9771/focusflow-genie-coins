
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Gift } from "lucide-react";

const CoinRewardCard = () => {
  return (
    <Card className="border-dashed">
      <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-3">
        <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
          <Coins className="h-5 w-5 text-yellow-600" />
        </div>
        
        <div>
          <h3 className="font-medium">Complete Daily Goals</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Finish 3 more tasks today to earn 15 coins
          </p>
        </div>
        
        <Button variant="outline" size="sm" className="w-full text-xs gap-1.5">
          <Gift className="h-3.5 w-3.5" />
          View All Rewards
        </Button>
      </CardContent>
    </Card>
  );
};

export default CoinRewardCard;
