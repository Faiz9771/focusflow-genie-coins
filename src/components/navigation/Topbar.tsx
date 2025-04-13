
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Search,
  Menu,
  Sparkles,
  Coins,
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

interface TopbarProps {
  toggleSidebar: () => void;
}

const Topbar = ({ toggleSidebar }: TopbarProps) => {
  const isMobile = useIsMobile();

  return (
    <header className="h-16 border-b bg-card flex items-center px-4 md:px-6">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile menu toggle */}
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        )}
        
        {/* Search */}
        <div className="relative hidden md:flex items-center flex-1 max-w-md">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for tasks, notes, events..."
            className="pl-9 bg-secondary border-none"
          />
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Genie assistance button */}
        <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-1 text-focusflow-purple hover:text-focusflow-purple/80 hover:bg-focusflow-purple/5">
          <Sparkles className="h-4 w-4" />
          <span>Ask Genie</span>
          <Badge variant="outline" className="ml-1 bg-focusflow-purple/10 hover:bg-focusflow-purple/20 text-focusflow-purple border-none">
            5 coins
          </Badge>
        </Button>
        
        {/* Coin balance */}
        <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1.5">
          <Coins className="h-4 w-4 text-yellow-500" />
          <span>120</span>
        </Button>
        
        {/* Notifications */}
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
