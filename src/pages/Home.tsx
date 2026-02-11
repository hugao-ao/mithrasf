import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart2, CheckCircle2, Shield, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 lg:py-32 overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 text-primary text-sm font-medium bg-primary/5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Consultoria Financeira Premium
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-tight text-white">
              Sua Saúde Financeira <br />
              <span className="gold-gradient-text">Elevada ao Máximo</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              A HV Saúde Financeira combina tecnologia avançada e expertise humana para transformar seus números em estratégias de crescimento sólido e previsível.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-14 px-8 text-lg shadow-lg shadow-primary/10 font-semibold w-full sm:w-auto">
                Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 rounded-lg h-14 px-8 text-lg w-full sm:w-auto">
                Conhecer Serviços
              </Button>
            </div>
          </div>
          
          <div className="flex-1 relative w-full max-w-md lg:max-w-none mx-auto">
            <div className="relative z-10 emerald-card p-6 md:p-8 rotate-3 hover:rotate-0 transition-transform duration-500 bg-card/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-sm text-muted-foreground">Saldo Total</p>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">R$ 1.245.890,00</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-background/40 border border-border/10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BarChart2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Investimentos</p>
                      <p className="text-xs text-muted-foreground">+12.5% este mês</p>
                    </div>
                  </div>
                  <span className="font-bold text-primary">R$ 850k</span>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg bg-background/40 border border-border/10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Proteção Patrimonial</p>
                      <p className="text-xs text-muted-foreground">Ativa e Segura</p>
                    </div>
                  </div>
                  <span className="font-bold text-primary">R$ 395k</span>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Planejamento Estratégico",
              desc: "Mapeamento completo de cenários para garantir a longevidade do seu patrimônio.",
              icon: BarChart2
            },
            {
              title: "Gestão de Riscos",
              desc: "Identificação e mitigação de vulnerabilidades financeiras com precisão cirúrgica.",
              icon: Shield
            },
            {
              title: "Otimização de Fluxo",
              desc: "Maximização de receitas e controle inteligente de despesas operacionais.",
              icon: TrendingUp
            }
          ].map((feature, i) => (
            <div key={i} className="emerald-card p-8 hover:-translate-y-2 transition-transform duration-300">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20">
        <div className="emerald-card p-8 md:p-12 relative overflow-hidden text-center border-primary/20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Pronto para transformar sua realidade financeira?
            </h2>
            <p className="text-lg text-muted-foreground">
              Junte-se a centenas de empresas que já confiam na HV Saúde Financeira para guiar suas decisões mais importantes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg h-14 px-8 text-lg font-bold">
                Agendar Consultoria
              </Button>
              <div className="flex items-center gap-2 text-muted-foreground text-sm justify-center">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Sem compromisso
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
