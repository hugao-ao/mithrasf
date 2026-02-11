import { Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function UnderConstruction() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in duration-500">
      <div className="relative">
        <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse" />
        <div className="relative bg-card border border-border p-6 rounded-full shadow-2xl">
          <Hammer className="h-16 w-16 text-primary animate-bounce" />
        </div>
      </div>
      
      <div className="space-y-2 max-w-md">
        <h1 className="text-3xl font-bold tracking-tight">Em Desenvolvimento</h1>
        <p className="text-muted-foreground">
          Esta página está sendo construída com cuidado para oferecer a melhor experiência.
          Volte em breve para novidades!
        </p>
      </div>

      <Link href="/">
        <Button size="lg" className="gap-2 shadow-lg hover:shadow-primary/25 transition-all">
          Voltar ao Início
        </Button>
      </Link>
    </div>
  );
}
