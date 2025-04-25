
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Home, 
  LayoutTemplate, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  Coins, 
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getCoinBalance } from '@/lib/coinSystem';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
  collapsed?: boolean;
}

const SidebarItem = ({ icon, label, to, active = false, collapsed = false }: SidebarItemProps) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center py-2.5 px-3 rounded-lg gap-3 text-muted-foreground font-medium transition-colors",
        "hover:bg-focusflow-purple/10 hover:text-focusflow-purple",
        active && "bg-focusflow-purple/10 text-focusflow-purple"
      )}
    >
      <div className="text-lg">{icon}</div>
      {!collapsed && <span className="text-sm">{label}</span>}
    </Link>
  );
};

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  // Get current location
  const location = useLocation();
  const currentPath = location.pathname;
  
  // State for coin balance
  const [coinBalance, setCoinBalance] = useState(0);
  
  // Fetch coin balance
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const coins = await getCoinBalance();
        setCoinBalance(coins);
      } catch (error) {
        console.error("Error fetching coin balance:", error);
      }
    };
    
    fetchCoins();
  }, []);
  
  // Toggle sidebar
  const toggleSidebar = () => setOpen(!open);

  return (
    <aside className={cn(
      "fixed top-0 left-0 h-full bg-card border-r z-40 transition-all duration-300 ease-in-out",
      open ? "w-64" : "w-[70px]",
    )}>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Logo and collapse button */}
        <div className={cn(
          "flex items-center justify-between h-16 px-4 border-b",
          !open && "justify-center"
        )}>
          {open ? (
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-gradient-to-br from-focusflow-purple to-focusflow-blue flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold">FocusFlow</span>
            </div>
          ) : (
            <div className="h-7 w-7 rounded-md bg-gradient-to-br from-focusflow-purple to-focusflow-blue flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className={cn(!open && "hidden")}
          >
            <ChevronLeft size={18} />
          </Button>
        </div>

        {/* User profile card */}
        <div className={cn(
          "flex flex-col gap-1.5 px-3 py-4",
          !open && "items-center"
        )}>
          <Avatar className="h-10 w-10 border">
            <AvatarImage src="" alt="User" />
            <AvatarFallback className="bg-focusflow-purple text-white">US</AvatarFallback>
          </Avatar>
          
          {open && (
            <>
              <div className="text-sm font-medium">User Name</div>
              <div className="text-xs text-muted-foreground">{coinBalance} Coins</div>
            </>
          )}
        </div>
        
        <Separator className="mx-3" />
        
        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <SidebarItem 
            to="/" 
            icon={<Home />} 
            label="Dashboard" 
            active={currentPath === "/"} 
            collapsed={!open} 
          />
          <SidebarItem 
            to="/tasks" 
            icon={<CheckSquare />} 
            label="Tasks" 
            active={currentPath === "/tasks"} 
            collapsed={!open} 
          />
          <SidebarItem 
            to="/planner" 
            icon={<FolderKanban />} 
            label="Planner" 
            active={currentPath === "/planner" || currentPath === "/calendar"} 
            collapsed={!open} 
          />
          <SidebarItem 
            to="/templates" 
            icon={<LayoutTemplate />} 
            label="Templates" 
            active={currentPath === "/templates"} 
            collapsed={!open} 
          />
          <SidebarItem 
            to="/friends" 
            icon={<Users />} 
            label="Friends" 
            active={currentPath === "/friends"} 
            collapsed={!open} 
          />
          <SidebarItem 
            to="/shop" 
            icon={<Coins />} 
            label="Coin Shop" 
            active={currentPath === "/shop"} 
            collapsed={!open} 
          />
        </div>
        
        {/* Settings */}
        <div className="px-3 py-4 border-t">
          <SidebarItem to="/settings" icon={<Settings />} label="Settings" collapsed={!open} />
        </div>
        
        {/* Expand button (visible when collapsed) */}
        {!open && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="mx-auto mb-4"
          >
            <ChevronRight size={18} />
          </Button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
