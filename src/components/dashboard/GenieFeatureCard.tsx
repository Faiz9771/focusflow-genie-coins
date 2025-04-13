
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { motion } from 'framer-motion';
import { spendCoins } from '@/lib/coinSystem';
import { toast } from 'sonner';

const GenieFeatureCard = () => {
  const coinCost = 5;
  
  const handleAskGenie = () => {
    if (spendCoins(coinCost, "Ask Genie")) {
      // In a real app, this would open the Genie AI assistant
      toast.success("Genie is analyzing your tasks...", {
        description: "Your personalized schedule will be ready in a moment."
      });
    }
  };
  
  return (
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
  );
};

export default GenieFeatureCard;
