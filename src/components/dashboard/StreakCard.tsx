
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from 'framer-motion';

const StreakCard = () => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const bestStreak = 14; // This could be stored in the database in a real app
  const streakProgress = 70; // percentage complete to next streak milestone
  
  useEffect(() => {
    const fetchStreak = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('streak_days')
            .eq('id', session.user.id)
            .single();
            
          if (error) throw error;
          
          setCurrentStreak(data?.streak_days || 0);
        }
      } catch (error) {
        console.error("Error fetching streak:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStreak();
  }, []);
  
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Productivity Streak</h3>
          <div className="flex items-center gap-1.5">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              <Flame className="h-4 w-4 text-orange-500" />
            </motion.div>
            <motion.span 
              className="font-semibold text-lg"
              initial={{ scale: 1 }}
              animate={isLoading ? { opacity: 0.5 } : { scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5 }}
            >
              {isLoading ? "..." : currentStreak}
            </motion.span>
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
