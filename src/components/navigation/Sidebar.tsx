
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Home, 
  LayoutTemplate, 
  CalendarDays, 
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
              <div className="text-xs text-muted-foreground">200 Coins</div>
            </>
          )}
        </div>
        
        <Separator className="mx-3" />
        
        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <SidebarItem to="/" icon={<Home />} label="Dashboard" active={true} collapsed={!open} />
          <SidebarItem to="/tasks" icon={<CheckSquare />} label="Tasks" collapsed={!open} />
          <SidebarItem to="/calendar" icon={<CalendarDays />} label="Calendar" collapsed={!open} />
          <SidebarItem to="/templates" icon={<LayoutTemplate />} label="Templates" collapsed={!open} />
          <SidebarItem to="/social" icon={<Users />} label="Friends" collapsed={!open} />
          <SidebarItem to="/coins" icon={<Coins />} label="Coin Shop" collapsed={!open} />
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
