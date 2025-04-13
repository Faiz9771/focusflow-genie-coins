
import React from 'react';
import { Button } from "@/components/ui/button";
import { CalendarClock, ArrowRight } from "lucide-react";

const DashboardGreeting = () => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  const getTimeBasedMessage = () => {
    const hour = new Date().getHours();
    if (hour < 10) return "Start your day with focus and energy!";
    if (hour < 14) return "Stay productive and tackle your priorities!";
    if (hour < 18) return "Keep the momentum going this afternoon!";
    return "Wrap up your day with a sense of accomplishment!";
  };
  
  const userName = "User"; // This would come from user state/context in a real app
  
  return (
    <div className="relative overflow-hidden rounded-xl border bg-card p-6 mb-6">
      {/* Background decoration */}
      <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-focusflow-purple/10"></div>
      <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-focusflow-blue/5"></div>
      
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {getGreeting()}, {userName}!
          </h1>
          <p className="text-muted-foreground mt-1">
            {getTimeBasedMessage()}
          </p>
          
          <div className="flex items-center gap-1.5 mt-3 text-sm text-muted-foreground">
            <CalendarClock className="h-4 w-4" />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
        
        <Button className="bg-focusflow-purple hover:bg-focusflow-purple-dark">
          <span>Start Focus Session</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DashboardGreeting;
