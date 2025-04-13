
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Coins, TrendingUp, Gift } from "lucide-react";
import { Link } from 'react-router-dom';
import { getCoinBalance } from '@/lib/coinSystem';
import { motion } from 'framer-motion';

const CoinsCard = () => {
  const [currentCoins, setCurrentCoins] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const todayEarned = 15; // This could be fetched from an API in a real app
  const weekProgress = 75; // percentage of weekly earning goal
  
  useEffect(() => {
    const fetchCoins = async () => {
      setIsLoading(true);
      try {
        const coins = await getCoinBalance();
        setCurrentCoins(coins);
      } catch (error) {
        console.error("Error fetching coins:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCoins();
  }, []);
  
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Genie Coins</h3>
          <div className="flex items-center gap-1.5">
            <motion.div
              animate={{ 
                rotateZ: [0, 10, -10, 10, 0],
              }}
              transition={{ 
                duration: 0.5,
                ease: "easeInOut",
                repeat: 1,
                repeatType: "reverse"
              }}
            >
              <Coins className="h-4 w-4 text-yellow-500" />
            </motion.div>
            <motion.span 
              className="font-semibold text-lg"
              initial={{ scale: 1 }}
              animate={isLoading ? { opacity: 0.5 } : { scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              {isLoading ? "..." : currentCoins}
            </motion.span>
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
