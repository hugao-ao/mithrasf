import { useState } from "react";
import { useLocation } from "wouter";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Lock, User, ShieldCheck } from "lucide-react";

// Supabase Configuration (Using the same credentials as Siteteste)
const SUPABASE_URL = "https://vbikskbfkhundhropykf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiaWtza2Jma2h1bmRocm9weWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MTk5NjEsImV4cCI6MjA2MTA5NTk2MX0.-n-Tj_5JnF1NL2ZImWlMeTcobWDl_VD6Vqp0lxRQFFU";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function Login() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState<"client" | "team">("client");
  
  const [formData, setFormData] = useState({
    login: "",
    password: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.login || !formData.password) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    setIsLoading(true);

    try {
      if (loginType === "team") {
        // Team Login Logic (Admin)
        // Assuming 'users' table or similar for team members
        // For now, using a simple check or supabase auth if configured
        // This is a placeholder for team login logic based on user request
        
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', formData.login)
          .eq('password', formData.password) // WARNING: Plain text password as requested
          .single();

        if (error || !data) {
          throw new Error("Credenciais de equipe inválidas.");
        }

        toast.success("Login de equipe realizado com sucesso!");
        
        // Redirect to Admin Panel (Siteteste)
        // In a real scenario, this would be a full URL redirect
        window.location.href = "https://siteteste-flame.vercel.app/admin-notificacoes-hvsf.html"; 

      } else {
        // Client Login Logic
        const { data, error } = await supabase
          .from('clientes')
          .select('*')
          .eq('login', formData.login)
          .eq('senha', formData.password) // WARNING: Plain text password as requested
          .eq('projeto', 'Planejamento')
          .single();

        if (error || !data) {
          throw new Error("Login ou senha incorretos.");
        }

        toast.success(`Bem-vindo(a), ${data.nome}!`);
        
        // Store session data (optional, depending on how the dashboard reads it)
        sessionStorage.setItem('client_id', data.id);
        sessionStorage.setItem('client_name', data.nome);
        
        // Redirect to Client Dashboard (Siteteste)
        // Using the placeholder URL as requested
        window.location.href = "https://siteteste-flame.vercel.app/cliente-dashboard-hvsf.html";
      }

    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Falha na autenticação.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[100px]" />
      </div>

      <Card className="w-full max-w-md border-border/40 bg-card/50 backdrop-blur-md shadow-2xl z-10">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2 border border-primary/20">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold gold-gradient-text tracking-wider">MITHRA</CardTitle>
          <CardDescription className="text-muted-foreground">
            Acesse sua área exclusiva
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="client" className="w-full" onValueChange={(val) => setLoginType(val as "client" | "team")}>
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50">
              <TabsTrigger value="client" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <User className="w-4 h-4 mr-2" />
                Sou Cliente
              </TabsTrigger>
              <TabsTrigger value="team" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <ShieldCheck className="w-4 h-4 mr-2" />
                Sou Equipe
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login">Login ou Email</Label>
                <Input 
                  id="login" 
                  name="login" 
                  placeholder={loginType === 'client' ? "Seu login de acesso" : "email@mithra.com"} 
                  value={formData.login}
                  onChange={handleInputChange}
                  className="bg-background/50 border-border/50 focus:border-primary/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-background/50 border-border/50 focus:border-primary/50"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 mt-4 transition-all duration-300 shadow-lg hover:shadow-primary/20" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  "ACESSAR SISTEMA"
                )}
              </Button>
            </form>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-center pb-6">
          <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Esqueceu sua senha?
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
