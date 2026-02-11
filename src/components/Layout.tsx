import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Sidebar />
      <main className="pl-20 transition-all duration-300 ease-in-out lg:pl-20">
        <div className="container mx-auto py-8 px-4 md:px-8 lg:px-12">
          {children}
        </div>
      </main>
    </div>
  );
}
