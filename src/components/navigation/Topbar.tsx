import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Bell,
  Search,
  Menu,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from '@/hooks/use-mobile';
import { getCoinBalance, getCoinBalanceSync } from '@/lib/coinSystem';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

interface TopbarProps {
  toggleSidebar: () => void;
}

const Topbar = ({ toggleSidebar }: TopbarProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [coins, setCoins] = useState(getCoinBalanceSync());
  const [genieCredits, setGenieCredits] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('genie_credits')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;
        setGenieCredits(profile.genie_credits);
      } catch (error) {
        console.error("Error fetching genie credits:", error);
      }
    };

    fetchUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchUserData();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleGenieClick = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      toast.error("Please sign in to use Genie");
      return;
    }

    if (genieCredits && genieCredits <= 0) {
      toast.error("No Genie credits remaining!", {
        description: "Visit the shop to purchase more Genie credits.",
        action: {
          label: "Visit Shop",
          onClick: () => navigate('/shop')
        }
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ genie_credits: (genieCredits || 0) - 1 })
        .eq('id', session.user.id);

      if (error) throw error;
      setGenieCredits(prev => (prev !== null ? prev - 1 : null));
      
      // Continue with Genie functionality
    } catch (error) {
      console.error("Error updating genie credits:", error);
      toast.error("Failed to use Genie credit");
    }
  };

  return (
    <header className="h-16 border-b bg-card flex items-center px-4 md:px-6">
      <div className="flex items-center gap-4 flex-1">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        )}
        
        <div className="relative hidden md:flex items-center flex-1 max-w-md">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for tasks, notes, events..."
            className="pl-9 bg-secondary border-none"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          className="hidden md:flex items-center gap-1 text-focusflow-purple hover:text-focusflow-purple/80 hover:bg-focusflow-purple/5"
          onClick={handleGenieClick}
          disabled={!genieCredits || genieCredits <= 0}
        >
          <Sparkles className="h-4 w-4" />
          <span>Ask Genie</span>
          <Badge 
            variant="outline" 
            className={cn(
              "ml-1 border-none",
              (genieCredits && genieCredits > 0)
                ? "bg-focusflow-purple/10 hover:bg-focusflow-purple/20 text-focusflow-purple" 
                : "bg-destructive/10 text-destructive"
            )}
          >
            {genieCredits ?? '...'} credits left
          </Badge>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer py-2 flex flex-col items-start gap-0.5">
              <p className="text-sm font-medium">New task assigned</p>
              <p className="text-xs text-muted-foreground">Alex assigned you "Research project materials"</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer py-2 flex flex-col items-start gap-0.5">
              <p className="text-sm font-medium">You earned 15 coins!</p>
              <p className="text-xs text-muted-foreground">Completed 3 tasks in a row</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer py-2 flex flex-col items-start gap-0.5">
              <p className="text-sm font-medium">Calendar reminder</p>
              <p className="text-xs text-muted-foreground">Team meeting in 15 minutes</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Topbar;
