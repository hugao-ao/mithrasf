import { Button } from "@/components/ui/button";
import { Check, Clock, Info, Shield, Star, Target, Zap } from "lucide-react";

export default function Planos() {
  const plans = [
    {
      name: "HV Nível I",
      price: "29,90",
      period: "/mês",
      description: "Para quem quer autonomia com direção profissional.",
      features: [
        "Acesso liberado a todas as ferramentas",
        "Reuniões Ilimitadas (mediante solicitação, prioridade zero, prazo máx. 6 meses)",
        "Contato livre em horário comercial via WhatsApp",
        "Planejamento e definição de metas",
        "Assistência via WhatsApp (dúvidas pontuais)",
        "Análises e pesquisas apenas durante a reunião"
      ],
      highlight: false,
      icon: Target
    },
    {
      name: "HV Nível II",
      price: "59,90",
      period: "/mês",
      description: "Mais agilidade e suporte em cotações.",
      features: [
        "Acesso liberado a todas as ferramentas",
        "Reuniões Ilimitadas (prioridade baixa, prazo máx. 4 meses)",
        "Contato livre em horário comercial via WhatsApp",
        "Planejamento, metas e cotações",
        "Assistência e cotações via WhatsApp",
        "Análises profundas apenas durante a reunião"
      ],
      highlight: false,
      icon: Clock
    },
    {
      name: "HV Nível III",
      price: "119,90",
      period: "/mês",
      description: "Acompanhamento próximo e intermediação.",
      features: [
        "Acesso liberado a todas as ferramentas",
        "Reuniões Ilimitadas (prioridade alta, prazo máx. 2 meses)",
        "Contato livre em horário comercial via WhatsApp",
        "Monitoramento e intermediação de implementação",
        "Assistência completa via WhatsApp e reuniões",
        "Relatórios quinzenais de evolução (mediante preenchimento)"
      ],
      highlight: true,
      icon: Star
    },
    {
      name: "HV Nível IV",
      price: "299,90",
      period: "/mês",
      description: "Gestão completa e resolução total.",
      features: [
        "Acesso liberado a todas as ferramentas",
        "Reuniões Ilimitadas (prioridade MÁXIMA, horário fixo mensal)",
        "Contato livre em horário comercial via WhatsApp",
        "Resolução de demandas por procuração",
        "Assistência total: dúvidas, análises e cotações via WhatsApp",
        "Relatórios semanais (nós preenchemos para você)"
      ],
      highlight: false,
      isPremium: true,
      icon: Shield
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Escolha o Nível da Sua <span className="gold-gradient-text">Evolução</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Planos desenhados para se adaptar ao seu momento de vida e necessidade de acompanhamento.
          <br />
          <span className="text-primary font-medium">Não é necessário fazer o Diagnóstico para assinar os planos mensais.</span>
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {plans.map((plan, index) => (
          <div 
            key={index}
            className={`relative flex flex-col p-6 rounded-2xl transition-all duration-300 hover:-translate-y-2 ${
              plan.isPremium 
                ? "bg-gradient-to-b from-primary/20 to-background border-2 border-primary/50 shadow-[0_0_30px_rgba(212,175,55,0.15)]" 
                : plan.highlight
                  ? "bg-card/80 border border-primary/30 shadow-lg"
                  : "bg-card/40 border border-white/5 hover:border-primary/20"
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                MAIS POPULAR
              </div>
            )}
            
            {plan.isPremium && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary via-yellow-400 to-primary text-black text-xs font-bold px-4 py-1 rounded-full shadow-lg animate-pulse">
                VIP EXCLUSIVE
              </div>
            )}

            <div className="mb-6 space-y-2">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${
                plan.isPremium ? "bg-primary text-black" : "bg-primary/10 text-primary"
              }`}>
                <plan.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <p className="text-sm text-muted-foreground min-h-[40px]">{plan.description}</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-sm text-muted-foreground">R$</span>
                <span className={`text-4xl font-bold ${plan.isPremium ? "gold-gradient-text" : "text-white"}`}>
                  {plan.price}
                </span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                  <Check className={`h-5 w-5 shrink-0 ${plan.isPremium ? "text-primary" : "text-primary/70"}`} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button 
              className={`w-full font-bold h-12 ${
                plan.isPremium 
                  ? "bg-primary text-black hover:bg-primary/90 shadow-lg shadow-primary/20" 
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              Assinar Agora
            </Button>
          </div>
        ))}
      </div>

      {/* Adesão Section */}
      <div className="relative rounded-3xl overflow-hidden border border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
        
        <div className="relative z-10 p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              <Info className="h-4 w-4" /> Opcional
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Planejamento de Referência & <span className="gold-gradient-text">Adesão</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Deseja um mapa completo da sua vida financeira montado por um profissional? 
              A Adesão é para quem busca um <strong>Planejamento Financeiro de Referência</strong> para seguir e implementar ao longo da vida.
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3 text-left">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                  <span className="text-primary font-bold text-xs">1</span>
                </div>
                <p className="text-muted-foreground">Agende seu <strong>Diagnóstico Financeiro</strong> (Reunião de 2h)</p>
              </div>
              <div className="flex items-start gap-3 text-left">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                  <span className="text-primary font-bold text-xs">2</span>
                </div>
                <p className="text-muted-foreground">Receba a apresentação do valor final da Adesão personalizado para seu caso</p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-md bg-card border border-border/50 rounded-2xl p-8 shadow-2xl relative">
            <div className="absolute -top-4 -right-4 h-20 w-20 bg-primary/20 rounded-full blur-2xl"></div>
            
            <div className="text-center space-y-2 mb-8">
              <p className="text-sm text-muted-foreground uppercase tracking-wider">Investimento Inicial</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-5xl font-bold text-white">R$ 250</span>
                <span className="text-xl text-muted-foreground">,00</span>
              </div>
              <p className="text-xs text-primary font-medium">ou 12x de R$ 29,90</p>
            </div>

            <Button className="w-full h-14 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/10 mb-4">
              Agendar Diagnóstico
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              *O valor da Adesão completa será apresentado durante esta reunião.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
