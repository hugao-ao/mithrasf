import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, Clock, Info, Shield, Star, Target, FileText } from "lucide-react";

export default function Planos() {
  const plans = [
    {
      name: "HV Nível I",
      price: "29,90",
      period: "/mês",
      description: "Para quem quer autonomia com direção profissional.",
      mainFeatures: [
        "Planejamento e metas definidos",
        "WhatsApp Ilimitado (Dúvidas)",
        "Resolução de demandas em reunião",
        "Você executa, nós orientamos"
      ],
      details: {
        reunioes: "Ilimitadas (mediante agendamento)",
        prioridade: "Baixa",
        escopo: [
          "Contato ilimitado via whatsapp (Sem análises novas ou cotações).",
          "Resolução de qualquer tipo de demanda durante o horário da reunião."
        ],
        adesao_info: "(Contratando a ADESÃO, tem direito a pedir 1 reunião de monitoramento a cada 6 meses)",
        contract: {
          sla_agenda: "6 meses",
          sla_whatsapp: "30 dias"
        }
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
        "Cotações de itens da reunião",
        "Prioridade maior na agenda",
        "Pesquisas de preços e opções"
      ],
      details: {
        reunioes: "Ilimitadas (mediante agendamento)",
        prioridade: "Normal",
        escopo: [
          "Contato ilimitado via whatsapp (Sem novas análises).",
          "Resolução de qualquer tipo de demanda durante o horário da reunião.",
          "Cotações e Pesquisas relativas às demandas da reunião."
        ],
        adesao_info: "(Contratando a ADESÃO, tem direito a pedir 1 reunião de monitoramento a cada 4 meses)",
        contract: {
          sla_agenda: "4 meses",
          sla_whatsapp: "15 dias"
        }
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
        "Intermediação de contratações",
        "Relatórios mensais de progresso",
        "Prioridade Alta na agenda"
      ],
      details: {
        reunioes: "Ilimitadas (mediante agendamento)",
        prioridade: "Alta",
        escopo: [
          "Contato ilimitado via whatsapp.",
          "Resolução de qualquer tipo de demanda durante o horário da reunião.",
          "Cotações e Pesquisas relativas às demandas da reunião.",
          "Intermediação de contratação de produtos e serviços.",
          "Contato via whatsapp mensal para atualizações e/ou relatórios."
        ],
        adesao_info: "(Contratando a ADESÃO, tem direito a pedir 1 reunião de monitoramento a cada 2 meses)",
        contract: {
          sla_agenda: "2 meses",
          sla_whatsapp: "7 dias"
        }
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
        "Resolução total (o que for possível)",
        "Relatórios semanais de evolução",
        "Prioridade MÁXIMA (horário fixo mensal)",
        "Nós executamos por você"
      ],
      details: {
        reunioes: "Ilimitadas + Horário Fixo Mensal Garantido",
        prioridade: "Máxima",
        escopo: [
          "Contato ilimitado via whatsapp.",
          "Resolução de qualquer tipo de demanda durante o horário da reunião.",
          "Cotações e Pesquisas relativas às demandas da reunião.",
          "Intermediação de contratação de produtos e serviços que não puderem ser resolvidos pelo consultor no seu lugar.",
          "Contato via whatsapp semanal para atualizações e/ou relatórios."
        ],
        adesao_info: "",
        contract: {
          sla_agenda: "1 mês",
          sla_whatsapp: "72 horas"
        }
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
                <DialogContent className="bg-card border-primary/20 text-white sm:max-w-md max-h-[90vh] overflow-y-auto">
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
                      <div className="text-sm text-muted-foreground bg-white/5 p-3 rounded-lg border border-white/5">
                        <p>{plan.details.reunioes}</p>
                        {plan.details.adesao_info && (
                          <p className="text-xs text-primary mt-1 font-medium">{plan.details.adesao_info}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-white text-sm">⚡ Prioridade de Agenda</h4>
                      <p className="text-sm text-muted-foreground bg-white/5 p-3 rounded-lg border border-white/5">
                        {plan.details.prioridade}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-white text-sm">🎯 O que está incluso?</h4>
                      <div className="text-sm text-muted-foreground bg-white/5 p-3 rounded-lg border border-white/5 space-y-2">
                        <ul className="list-disc pl-4 space-y-1">
                          {plan.details.escopo.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10">
                            <FileText className="mr-2 h-4 w-4" /> Consultar Contrato Completo
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card border-primary/20 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-primary">Contrato de Prestação de Serviços - {plan.name}</DialogTitle>
                            <DialogDescription>Termos e condições do serviço de Consultoria Administrativa Financeira.</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed pr-2">
                            <div className="p-4 bg-white/5 rounded-lg border border-white/5 space-y-4">
                              <h4 className="font-bold text-white">1. OBJETO DO CONTRATO</h4>
                              <p>
                                O presente contrato tem por objeto a prestação de serviços de <strong>Organização e Apoio Administrativo Financeiro</strong>. 
                                O CONSULTOR atuará na organização de dados, controle de fluxo de caixa, pesquisas de preços e resolução de burocracias, conforme o escopo do plano contratado.
                              </p>
                              <p className="bg-yellow-500/10 border-l-2 border-yellow-500 pl-3 py-1 text-yellow-200/90 text-xs">
                                <strong>CLÁUSULA DE ISENÇÃO (CVM):</strong> Este serviço NÃO constitui consultoria, análise ou recomendação de valores mobiliários ou investimentos. O CONSULTOR não realizará recomendações de compra ou venda de ativos financeiros. Todas as decisões de investimento são de exclusiva responsabilidade do CONTRATANTE.
                              </p>

                              <h4 className="font-bold text-white mt-6">2. PRAZOS E NÍVEIS DE SERVIÇO (SLA)</h4>
                              <ul className="list-disc pl-4 space-y-2">
                                <li>
                                  <strong>Agendamento de Reuniões:</strong> O prazo máximo para disponibilização de horário na agenda é de <strong>{plan.details.contract.sla_agenda}</strong>, contados a partir da solicitação formal.
                                </li>
                                <li>
                                  <strong>Atendimento via WhatsApp:</strong> As solicitações enviadas terão prazo de resposta de até <strong>{plan.details.contract.sla_whatsapp}</strong> (dias úteis).
                                </li>
                                <li>
                                  <strong>Canais Oficiais:</strong> Para fins de registro e contagem de prazos, são válidas apenas as solicitações realizadas em reunião ou via WhatsApp oficial. Solicitações por outros meios (redes sociais pessoais, e-mail não-oficial) não geram obrigação de atendimento.
                                </li>
                              </ul>

                              <h4 className="font-bold text-white mt-6">3. POLÍTICA DE AGENDAMENTO E AUSÊNCIAS</h4>
                              <ul className="list-disc pl-4 space-y-2">
                                <li>
                                  <strong>Antecedência Mínima:</strong> Reuniões devem ser solicitadas com antecedência mínima de <strong>7 (sete) dias corridos</strong>. Solicitações com prazo inferior dependerão exclusivamente de disponibilidade eventual, sem garantia de atendimento.
                                </li>
                                <li>
                                  <strong>Política de "No-Show" (Ausência):</strong> O não comparecimento à reunião agendada, sem aviso prévio de cancelamento, implicará na consideração do serviço como <strong>PRESTADO</strong>. A data da reunião não realizada será registrada como a data oficial da última atualização do planejamento.
                                </li>
                                <li>
                                  <strong>Remarcações:</strong> A garantia de remarcação aplica-se apenas em casos de cancelamento por parte do CONSULTOR. Cancelamentos por parte do CONTRATANTE sujeitam-se à disponibilidade de agenda, sem garantia de nova data imediata.
                                </li>
                              </ul>

                              <h4 className="font-bold text-white mt-6">4. SEGURANÇA E PROTEÇÃO DE DADOS</h4>
                              <p>
                                Será criada uma conta de e-mail exclusiva (ex: <code>seu.cpf@hvsf.gmail.com</code>) para centralização das informações financeiras.
                              </p>
                              <ul className="list-disc pl-4 space-y-2">
                                <li>O acesso aos dados é restrito ao CONTRATANTE e ao CONSULTOR.</li>
                                <li>A segurança das informações é garantida pelos protocolos de autenticação do provedor (Google), incluindo verificação em duas etapas quando aplicável.</li>
                              </ul>

                              <h4 className="font-bold text-white mt-6">5. CANCELAMENTO E REEMBOLSO</h4>
                              <ul className="list-disc pl-4 space-y-2">
                                <li><strong>Cancelamento:</strong> O contrato pode ser rescindido a qualquer momento pelo CONTRATANTE, sem cobrança de multa rescisória.</li>
                                <li><strong>Direito de Arrependimento (Art. 49 do CDC):</strong> Para contratações realizadas online, o CONTRATANTE poderá exercer o direito de arrependimento no prazo de <strong>7 (sete) dias corridos</strong> a contar da assinatura, com reembolso integral dos valores pagos. Após este prazo, não haverá reembolso de mensalidades já quitadas.</li>
                                <li><strong>Processamento de Cobrança:</strong> Cancelamentos solicitados próximos à data de renovação podem não impedir o processamento automático da cobrança seguinte. Nestes casos, não haverá estorno proporcional (pro-rata) se o prazo de arrependimento já tiver expirado.</li>
                                <li><strong>Exclusão de Dados:</strong> Após o cancelamento, o histórico de dados será mantido por 60 dias para eventual reativação. Após este período, todos os dados serão excluídos permanentemente.</li>
                              </ul>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
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
