import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Users } from "lucide-react";

export default function Login() {
  // URLs do Siteteste (Substitua pelos links reais do seu deploy no Vercel)
  const CLIENT_LOGIN_URL = "https://app.hvsaudefinanceira.com.br/login-cliente.html";
  const TEAM_LOGIN_URL = "https://app.hvsaudefinanceira.com.br/";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-primary/20 shadow-lg shadow-primary/5">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <User className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">Portal de Acesso</CardTitle>
          <CardDescription>
            Selecione como deseja acessar o sistema HVSF
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <Button 
            className="w-full h-16 text-lg font-medium transition-all hover:scale-[1.02]" 
            variant="outline"
            onClick={() => window.location.href = CLIENT_LOGIN_URL}
          >
            <User className="mr-3 h-6 w-6" />
            Sou Cliente
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou
              </span>
            </div>
          </div>

          <Button 
            className="w-full h-16 text-lg font-medium transition-all hover:scale-[1.02]" 
            onClick={() => window.location.href = TEAM_LOGIN_URL}
          >
            <Users className="mr-3 h-6 w-6" />
            Sou da Equipe
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
