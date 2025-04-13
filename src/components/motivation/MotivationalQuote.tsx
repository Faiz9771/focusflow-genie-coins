
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { QuoteIcon, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

// Sample quotes database - in a real app this would be much larger
const quotes = [
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    text: "It always seems impossible until it's done.",
    author: "Nelson Mandela"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Start where you are. Use what you have. Do what you can.",
    author: "Arthur Ashe"
  },
  {
    text: "Your focus determines your reality.",
    author: "George Lucas"
  },
  {
    text: "Tomorrow becomes never. No matter how small the task, take the first step now!",
    author: "Tim Ferriss"
  }
];

const MotivationalQuote = () => {
  const [currentQuote, setCurrentQuote] = useState<number>(0);
  const [animation, setAnimation] = useState<boolean>(true);
  
  useEffect(() => {
    // Initialize with a random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(randomIndex);
  }, []);
  
  const getNewQuote = () => {
    setAnimation(false);
    setTimeout(() => {
      let newIndex = Math.floor(Math.random() * quotes.length);
      // Ensure we don't get the same quote twice in a row
      while (newIndex === currentQuote) {
        newIndex = Math.floor(Math.random() * quotes.length);
      }
      setCurrentQuote(newIndex);
      setAnimation(true);
    }, 300);
  };
  
  return (
    <Card className="border-focusflow-blue/30 overflow-hidden">
      <CardContent className="p-5 relative">
        <div className="absolute top-1 right-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={getNewQuote}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-start gap-3 pt-2">
          <QuoteIcon className="h-8 w-8 text-focusflow-blue opacity-70 flex-shrink-0 mt-1" />
          <div className="space-y-2">
            <motion.p 
              className="text-sm font-medium leading-relaxed text-gray-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: animation ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {quotes[currentQuote].text}
            </motion.p>
            <motion.p 
              className="text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: animation ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              — {quotes[currentQuote].author}
            </motion.p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MotivationalQuote;
