import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, Clock, Info, Shield, Star, Target } from "lucide-react";

export default function Planos() {
  const plans = [
    {
      name: "HV Nível I",
      price: "29,90",
      period: "/mês",
      description: "Para quem quer autonomia com direção profissional.",
      mainFeatures: [
        "Planejamento e metas definidos",
        "Tire dúvidas no WhatsApp",
        "Análises durante as reuniões",
        "Você executa, nós orientamos"
      ],
      details: {
        reunioes: "Ilimitadas (mediante agendamento)",
        prioridade: "Normal (prazo máx. 6 meses para agendamento)",
        suporte: "WhatsApp em horário comercial para dúvidas pontuais",
        escopo: "O consultor define o plano e você implementa sozinho."
      },
      highlight: false,
      icon: Target
    },
    {
      name: "HV Nível II",
      price: "59,90",
      period: "/mês",
      description: "Mais agilidade e ajuda com pesquisas de preço.",
      mainFeatures: [
        "Tudo do Nível I",
        "Nós fazemos as cotações para você",
        "Prioridade maior na agenda",
        "Ajuda para encontrar o melhor custo-benefício para qualquer produto ou serviço"
      ],
      details: {
        reunioes: "Ilimitadas (mediante agendamento)",
        prioridade: "Baixa (prazo máx. 4 meses para agendamento)",
        suporte: "WhatsApp para dúvidas e pedidos de cotação",
        escopo: "Além do plano, nós pesquisamos preços e opções para você."
      },
      highlight: false,
      icon: Clock
    },
    {
      name: "HV Nível III",
      price: "119,90",
      period: "/mês",
      description: "Acompanhamento próximo para garantir que aconteça.",
      mainFeatures: [
        "Tudo do Nível II",
        "Nós intermediamos contratações",
        "Relatórios quinzenais de progresso",
        "Prioridade Alta na agenda"
      ],
      details: {
        reunioes: "Ilimitadas (mediante agendamento)",
        prioridade: "Alta (prazo máx. 2 meses para agendamento)",
        suporte: "WhatsApp completo + Intermediação de serviços",
        escopo: "Nós falamos com fornecedores por você e monitoramos se o plano está sendo seguido."
      },
      highlight: true,
      icon: Star
    },
    {
      name: "HV Nível IV",
      price: "299,90",
      period: "/mês",
      description: "Nós resolvemos tudo para você.",
      mainFeatures: [
        "Gestão completa por procuração",
        "Relatórios semanais de evolução",
        "Prioridade MÁXIMA (horário fixo mensal)",
        "Nós executamos por você"
      ],
      details: {
        reunioes: "Ilimitadas + Horário Fixo Mensal Garantido",
        prioridade: "Máxima (Atendimento VIP)",
        suporte: "Resolução total de problemas (inclusive burocráticos)",
        escopo: "Você decide, nós fazemos. Resolvemos tudo que não exigir sua presença física."
      },
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
          Planos simples e diretos. Você escolhe o quanto quer colocar a mão na massa.
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
              {plan.mainFeatures.map((feature, i) => (
                <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                  <Check className={`h-5 w-5 shrink-0 ${plan.isPremium ? "text-primary" : "text-primary/70"}`} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-3 mt-auto">
              <Button 
                className={`w-full font-bold h-12 ${
                  plan.isPremium 
                    ? "bg-primary text-black hover:bg-primary/90 shadow-lg shadow-primary/20" 
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                Assinar Agora
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-primary h-8">
                    Ver detalhes e regras
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-primary/20 text-white sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-primary flex items-center gap-2">
                      <plan.icon className="h-5 w-5" /> Detalhes do {plan.name}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      Entenda como funciona este nível de serviço.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-white text-sm">📅 Reuniões</h4>
                      <p className="text-sm text-muted-foreground bg-white/5 p-3 rounded-lg border border-white/5">
                        {plan.details.reunioes}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-white text-sm">⚡ Prioridade de Agenda</h4>
                      <p className="text-sm text-muted-foreground bg-white/5 p-3 rounded-lg border border-white/5">
                        {plan.details.prioridade}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-white text-sm">💬 Suporte WhatsApp</h4>
                      <p className="text-sm text-muted-foreground bg-white/5 p-3 rounded-lg border border-white/5">
                        {plan.details.suporte}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-white text-sm">🎯 O que está incluso?</h4>
                      <p className="text-sm text-muted-foreground bg-white/5 p-3 rounded-lg border border-white/5">
                        {plan.details.escopo}
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
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
