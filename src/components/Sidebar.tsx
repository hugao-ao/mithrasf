import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Hammer,
  Home,
  LayoutDashboard,
  LogIn,
  User
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

// Event to communicate sidebar state to Layout
export const SIDEBAR_EVENT = 'sidebar-toggle';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [location] = useLocation();

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    // Dispatch event for Layout to listen
    window.dispatchEvent(new CustomEvent(SIDEBAR_EVENT, { detail: { collapsed: newState } }));
  };

  const navItems = [
    { icon: Home, label: "Início", href: "/" },
    { icon: LayoutDashboard, label: "Planos", href: "/planos" },
    { icon: Hammer, label: "Ferramentas", href: "/ferramentas" },
    { icon: User, label: "Conheça-me", href: "/conheca-me" },
  ];

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen transition-all duration-300 ease-in-out flex flex-col bg-sidebar border-r border-sidebar-border shadow-xl shrink-0 z-40",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo Area */}
      <div className="flex h-24 items-center justify-center border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3 overflow-hidden w-full justify-center">
          <div className={cn(
            "relative flex shrink-0 items-center justify-center transition-all duration-300",
            collapsed ? "h-12 w-12" : "h-16 w-16"
          )}>
            <img 
              src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663028340323/sKmFvmKlsZHRnPBz.png" 
              alt="HV Logo" 
              className="h-full w-full object-contain drop-shadow-md" 
            />
          </div>
          <div
            className={cn(
              "flex flex-col transition-all duration-300 overflow-hidden",
              collapsed ? "opacity-0 w-0 hidden" : "opacity-100 w-auto ml-2"
            )}
          >
            <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap">HV</span>
            <span className="text-xs text-primary/90 whitespace-nowrap font-medium">Saúde Financeira</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/10 mt-4">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-200 cursor-pointer mb-1",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                  )}
                />
                <span
                  className={cn(
                    "whitespace-nowrap transition-all duration-300 font-medium",
                    collapsed ? "opacity-0 w-0 hidden" : "opacity-100 w-auto"
                  )}
                >
                  {item.label}
                </span>
                
                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-16 z-50 hidden rounded-md bg-sidebar border border-sidebar-border px-3 py-2 text-sm text-white shadow-xl group-hover:block whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="border-t border-sidebar-border p-4 space-y-4 bg-sidebar/50">
        <a 
          href="/login" 
          target="_blank" 
          rel="noopener noreferrer"
          className={cn(
            "flex items-center gap-3 rounded-lg bg-primary text-primary-foreground px-3 py-3 shadow-lg transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]",
            collapsed ? "justify-center" : ""
          )}
        >
          <LogIn className="h-5 w-5 shrink-0" />
          <span
            className={cn(
              "whitespace-nowrap font-bold transition-all duration-300",
              collapsed ? "opacity-0 w-0 hidden" : "opacity-100 w-auto"
            )}
          >
            Acessar Sistema
          </span>
        </a>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="w-full hover:bg-white/5 text-muted-foreground hover:text-white h-10"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>
    </aside>
  );
}
