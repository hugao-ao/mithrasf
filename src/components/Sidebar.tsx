import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Home,
  LayoutDashboard,
  LogIn,
  PieChart,
  Settings,
  ShieldCheck,
  Wallet
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [location] = useLocation();

  const toggleSidebar = () => setCollapsed(!collapsed);

  const navItems = [
    { icon: Home, label: "Início", href: "/" },
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Wallet, label: "Fluxo de Caixa", href: "/fluxo-caixa" },
    { icon: PieChart, label: "Investimentos", href: "/investimentos" },
    { icon: BarChart3, label: "Relatórios", href: "/relatorios" },
    { icon: Settings, label: "Configurações", href: "/configuracoes" },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out flex flex-col bg-sidebar border-r border-sidebar-border",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo Area */}
      <div className="flex h-20 items-center justify-center border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 shadow-lg">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <div
            className={cn(
              "flex flex-col transition-opacity duration-300",
              collapsed ? "opacity-0 w-0 hidden" : "opacity-100 w-auto"
            )}
          >
            <span className="text-lg font-bold tracking-tight text-white">MithraSF</span>
            <span className="text-xs text-primary/80">Saúde Financeira</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/10">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-200 cursor-pointer",
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
                    "whitespace-nowrap transition-all duration-300",
                    collapsed ? "opacity-0 w-0 hidden" : "opacity-100 w-auto"
                  )}
                >
                  {item.label}
                </span>
                
                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-16 z-50 hidden rounded-md bg-sidebar border border-sidebar-border px-2 py-1 text-xs text-white shadow-xl group-hover:block">
                    {item.label}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="border-t border-sidebar-border p-4 space-y-4">
        <a 
          href="https://siteteste-flame.vercel.app/" 
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
              "whitespace-nowrap font-medium transition-all duration-300",
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
          className="w-full hover:bg-white/5 text-muted-foreground hover:text-white"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>
    </aside>
  );
}
