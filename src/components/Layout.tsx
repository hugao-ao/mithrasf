import { Sidebar, SIDEBAR_EVENT } from "./Sidebar";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleSidebarToggle = (e: CustomEvent) => {
      setSidebarCollapsed(e.detail.collapsed);
    };

    window.addEventListener(SIDEBAR_EVENT as any, handleSidebarToggle);
    return () => {
      window.removeEventListener(SIDEBAR_EVENT as any, handleSidebarToggle);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden flex relative w-full">
      <Sidebar />
      
      {/* 
        Main content wrapper
        Dynamically adjusts margin-left based on sidebar state
        w-20 = 5rem (80px)
        w-64 = 16rem (256px)
      */}
      <main 
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out min-h-screen flex flex-col w-full",
          sidebarCollapsed ? "ml-20" : "ml-20 lg:ml-64"
        )}
      >
        {/* 
           Removed 'container' class constraint to allow full width usage 
           Added max-w-full to ensure it takes available space
        */}
        <div className="w-full max-w-full py-8 px-4 md:px-8 lg:px-12 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
