import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex w-full">
      {/* Sidebar is now a flex item, sticky positioned within itself */}
      <Sidebar />
      
      {/* 
        Main content wrapper
        flex-1: Takes up all remaining space automatically
        w-0: Prevents flex item from overflowing if content is too wide (crucial for responsiveness)
        min-w-0: Same purpose, ensures flexbox shrinking works correctly
      */}
      <main className="flex-1 flex flex-col min-w-0 w-0 transition-all duration-300 ease-in-out">
        <div className="w-full h-full py-8 px-4 md:px-8 lg:px-12 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
