import { Button } from "@/components/ui/button";
import { CheckCircle, MessageCircle } from "lucide-react";
import { Link } from "wouter";

export default function Sucesso() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-primary/20 rounded-2xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-primary/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex justify-center">
          <div className="h-20 w-20 bg-green-500/20 rounded-full flex items-center justify-center animate-bounce-slow">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
        </div>

        <div className="space-y-2 relative z-10">
          <h1 className="text-3xl font-bold text-white">Pagamento Confirmado!</h1>
          <p className="text-muted-foreground text-lg">
            Seja muito bem-vindo à sua evolução financeira.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-left space-y-4 relative z-10">
          <p className="text-sm text-gray-300 leading-relaxed">
            Seu consultor pessoal já foi notificado e seu Assistente está preparando seu acesso exclusivo.
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">
            Para agilizar, clique abaixo e fale agora mesmo com seu Assistente no WhatsApp para receber seu login e senha.
          </p>
        </div>

        <div className="space-y-3 relative z-10 pt-2">
          <Button 
            className="w-full h-14 text-lg font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
            onClick={() => window.open("https://wa.me/5511999999999?text=Olá,%20acabei%20de%20assinar%20o%20plano%20e%20gostaria%20de%20iniciar!", "_blank")}
          >
            <MessageCircle className="h-5 w-5" />
            Falar com Assistente
          </Button>
          
          <Link href="/">
            <Button variant="ghost" className="w-full text-muted-foreground hover:text-white">
              Voltar para o Início
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
