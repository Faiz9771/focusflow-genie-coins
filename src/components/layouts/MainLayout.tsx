
import { useState } from "react";
import Sidebar from "../navigation/Sidebar";
import Topbar from "../navigation/Topbar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  
  // On mobile devices, sidebar is closed by default
  const isOpen = isMobile ? false : sidebarOpen;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={isOpen} setOpen={setSidebarOpen} />
      
      <div className={cn(
        "flex flex-col flex-1 w-full overflow-hidden transition-all duration-300",
        isOpen && !isMobile && "ml-64"
      )}>
        <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
