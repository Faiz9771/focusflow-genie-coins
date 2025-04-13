
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Coins, TrendingUp, Gift } from "lucide-react";
import { Link } from 'react-router-dom';
import { getCoinBalance } from '@/lib/coinSystem';

const CoinsCard = () => {
  // In a real app, this would use state to update when coins change
  const currentCoins = getCoinBalance();
  const todayEarned = 15;
  const weekProgress = 75; // percentage of weekly earning goal
  
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Genie Coins</h3>
          <div className="flex items-center gap-1.5">
            <Coins className="h-4 w-4 text-yellow-500" />
            <span className="font-semibold text-lg">{currentCoins}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1 text-green-600">
            <TrendingUp className="h-3 w-3" />
            <span>+{todayEarned} today</span>
          </div>
          
          <div className="h-3 w-[1px] bg-border"></div>
          
          <div className="flex items-center gap-1 text-muted-foreground">
            <Gift className="h-3 w-3" />
            <span>Weekly goal</span>
          </div>
        </div>
        
        <Progress value={weekProgress} className="h-2" />
        
        <Button variant="outline" size="sm" className="w-full text-xs" asChild>
          <Link to="/shop">Visit Coin Shop</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default CoinsCard;
