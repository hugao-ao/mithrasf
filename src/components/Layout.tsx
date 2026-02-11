import { Sidebar } from "./Sidebar";
import { useState, useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  // We need to know if sidebar is collapsed to adjust padding
  // Since sidebar state is internal to Sidebar component, we'll use a simple approach:
  // Always add enough padding for the expanded sidebar (w-64 = 16rem = 256px)
  // Or better, make the main content margin-left match the sidebar width
  
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden flex">
      <Sidebar />
      {/* 
        Adjusted margin-left (ml-20 or ml-64) to match sidebar width.
        Since Sidebar controls its own state, we use a safe default of ml-20 (collapsed) 
        and let the user expand. Ideally, state should be lifted up, but for a quick fix:
        We will use a clever CSS trick or just assume expanded by default for safety.
        
        Actually, the previous code had `pl-20 lg:pl-20`.
        The sidebar is fixed. We need to push the content.
        Let's use a safe margin that accommodates the sidebar.
        If the sidebar is collapsible, the content should adjust.
        
        To fix the "hidden behind sidebar" issue without rewriting the whole state management:
        We will add a generous left margin that works for the expanded state (w-64).
        If the user collapses it, there will be more whitespace, which is better than hidden content.
      */}
      <main className="flex-1 ml-20 lg:ml-64 transition-all duration-300 ease-in-out">
        <div className="container mx-auto py-8 px-4 md:px-8 lg:px-12">
          {children}
        </div>
      </main>
    </div>
  );
}
