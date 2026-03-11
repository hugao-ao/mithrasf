import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BookOpen, Check, Clock, Info, Shield, Star, Target, FileText, AlertTriangle, Lock } from "lucide-react";
import { Link } from "wouter";

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
        adesao_info: "(Com um Planejamento de Referência, tem direito a pedir 1 reunião de monitoramento a cada 6 meses)",
        contract: {
          sla_agenda: "6 meses",
          sla_whatsapp: "30 dias",
          incluso: "Orientação estratégica e resolução de dúvidas pontuais.",
          nao_incluso: "Cotações de preços, pesquisas de mercado, contato com terceiros, execução de tarefas operacionais, relatórios escritos fora de reunião."
        }
      },
      highlight: false,
      icon: Target,
      checkoutUrl: "https://planofinanceiro.cyclopay.com/checkout/WrKjwGYR4p"
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
        adesao_info: "(Com um Planejamento de Referência, tem direito a pedir 1 reunião de monitoramento a cada 4 meses)",
        contract: {
          sla_agenda: "4 meses",
          sla_whatsapp: "15 dias",
          incluso: "Tudo do Nível I + Realização de cotações de preços e pesquisas comparativas de produtos/serviços solicitados em reunião.",
          nao_incluso: "Contato com terceiros (corretores, gerentes), intermediação de contratações, execução de tarefas operacionais, relatórios mensais."
        }
      },
      highlight: false,
      icon: Clock,
      checkoutUrl: "https://planofinanceiro.cyclopay.com/checkout/2GoFRSHleo"
    },
    {
      name: "HV Nível III",
      price: "119,90",
      period: "/mês",
      description: "Acompanhamento próximo para garantir que aconteça.",
      mainFeatures: [
        "Tudo do Nível II",
        "Supervisão Ativa de contratações",
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
          "Supervisão Ativa: Acompanhamento em tempo real (reuniões conjuntas ou grupos de WhatsApp) das tratativas com outros profissionais (corretores, gerentes, contadores) para garantir a adequação técnica do que está sendo contratado.",
          "Contato via whatsapp mensal para atualizações e/ou relatórios."
        ],
        adesao_info: "(Com um Planejamento de Referência, tem direito a pedir 1 reunião de monitoramento a cada 2 meses)",
        contract: {
          sla_agenda: "2 meses",
          sla_whatsapp: "7 dias",
          incluso: "Tudo do Nível II + Supervisão técnica ativa em reuniões/grupos com terceiros + Relatórios mensais de acompanhamento.",
          nao_incluso: "Execução operacional de tarefas (preenchimento de formulários, envio de documentos, trâmites burocráticos) em nome do cliente."
        }
      },
      highlight: true,
      icon: Star,
      checkoutUrl: "https://planofinanceiro.cyclopay.com/checkout/kgl3pLDplo"
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
          "Supervisão Ativa com outros profissionais (conforme Nível III).",
          "Execução Operacional Completa: Realização de todas as tarefas burocráticas e administrativas possíveis, entregando a solução pronta para validação final do cliente.",
          "Contato via whatsapp semanal para atualizações e/ou relatórios."
        ],
        adesao_info: "",
        contract: {
          sla_agenda: "1 mês",
          sla_whatsapp: "72 horas",
          incluso: "Tudo do Nível III + Execução operacional completa de demandas burocráticas + Relatórios semanais + Horário fixo garantido.",
          nao_incluso: "Atos que exijam estritamente a presença física, assinatura biométrica ou uso de senha pessoal intransferível do titular."
        }
      },
      highlight: false,
      isPremium: true,
      icon: Shield,
      checkoutUrl: "https://planofinanceiro.cyclopay.com/checkout/rHe327XILq"
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

      {/* Banner Planejamento de Referência */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Tem um Planejamento Financeiro de Referência?</h3>
            <p className="text-muted-foreground text-sm mt-1 max-w-xl">
              Antes de assinar um plano, considere ter um Planejamento de Referência — um documento completo que define estratégias para cada área da sua vida financeira e serve de base para toda a assistência que você receberá.
            </p>
          </div>
        </div>
        <Link href="/planejamento-de-referencia">
          <Button className="bg-primary text-black hover:bg-primary/90 font-bold shrink-0 whitespace-nowrap">
            Conhecer o Planejamento &rarr;
          </Button>
        </Link>
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
                onClick={() => {
                  const planoEncoded = encodeURIComponent(plan.name);
                  window.location.href = `/aceite-contrato?plano=${planoEncoded}`;
                }}
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
                  
                  <div className="space-y-6 py-4">
                    {/* Reuniões */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-primary font-semibold">
                        <div className="p-1 bg-primary/10 rounded">📅</div>
                        <h3>Reuniões</h3>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg border border-white/10 text-sm">
                        <p>{plan.details.reunioes}</p>
                        {plan.details.adesao_info && (
                          <p className="text-xs text-yellow-500 mt-1">{plan.details.adesao_info}</p>
                        )}
                      </div>
                    </div>

                    {/* Prioridade */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-primary font-semibold">
                        <div className="p-1 bg-primary/10 rounded">⚡</div>
                        <h3>Prioridade de Agenda</h3>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg border border-white/10 text-sm">
                        <p>{plan.details.prioridade}</p>
                      </div>
                    </div>

                    {/* Escopo */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-primary font-semibold">
                        <div className="p-1 bg-primary/10 rounded">🎯</div>
                        <h3>O que está incluso?</h3>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg border border-white/10 text-sm">
                        <ul className="space-y-2">
                          {plan.details.escopo.map((item, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-primary">•</span>
                              <span className="text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Contrato e Regras */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-primary font-semibold">
                        <div className="p-1 bg-primary/10 rounded">📜</div>
                        <h3>Contrato e Regras</h3>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg border border-white/10 text-sm space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-black/20 p-2 rounded">
                            <span className="text-muted-foreground block">SLA Agenda</span>
                            <span className="font-bold text-white">{plan.details.contract.sla_agenda}</span>
                          </div>
                          <div className="bg-black/20 p-2 rounded">
                            <span className="text-muted-foreground block">SLA WhatsApp</span>
                            <span className="font-bold text-white">{plan.details.contract.sla_whatsapp}</span>
                          </div>
                        </div>
                        
                        {/* Inclusões e Exclusões Dinâmicas */}
                        <div className="space-y-2 pt-2 border-t border-white/10">
                          <div className="flex gap-2 items-start">
                            <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                            <div>
                              <span className="text-green-400 font-bold text-xs block mb-1">INCLUSO NESTE PLANO</span>
                              <p className="text-xs text-muted-foreground">{plan.details.contract.incluso}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 items-start">
                            <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                            <div>
                              <span className="text-red-400 font-bold text-xs block mb-1">NÃO INCLUSO (VEDADO)</span>
                              <p className="text-xs text-muted-foreground">{plan.details.contract.nao_incluso}</p>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/10">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="link" className="text-xs text-primary p-0 h-auto">
                                Consultar Contrato Completo
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-card border-primary/20 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Contrato de Prestação de Serviços - {plan.name}</DialogTitle>
                              </DialogHeader>
                              <div className="text-sm text-muted-foreground space-y-4 text-justify pr-2">
                                <div className="bg-red-500/10 border border-red-500/30 p-3 rounded mb-4">
                                  <h4 className="text-red-400 font-bold mb-1 flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4" /> CONDIÇÃO ESSENCIAL PARA ATENDIMENTO
                                  </h4>
                                  <p className="text-xs text-white">
                                    <strong>6. POLÍTICA DE PAGAMENTO E SUSPENSÃO DE SERVIÇOS:</strong> O acesso a quaisquer benefícios deste plano (incluindo respostas no WhatsApp, agendamento de reuniões e envio de relatórios) está estritamente condicionado à regularidade dos pagamentos. O CONSULTOR realizará a verificação de adimplência antes de iniciar qualquer atendimento. Havendo pendência financeira, a prestação de serviços será <strong>IMEDIATAMENTE SUSPENSA</strong> até a regularização, sem que isso gere qualquer direito a indenização ou extensão de prazo contratual.
                                  </p>
                                </div>

                                <p><strong>1. OBJETO:</strong> Prestação de serviços de Consultoria e Planejamento Financeiro Pessoal, abrangendo, conforme o nível contratado: Planejamento Orçamentário, Gestão de Passivos e Dívidas, Análise de Viabilidade de Seguros (Vida, Auto, Residencial, Saúde), Planejamento Previdenciário (PGBL/VGBL), Estratégia de Alocação de Ativos, Otimização Fiscal (IRPF), Planejamento Sucessório, Gestão de Cartões/Milhas e Análise de Crédito (Financiamentos/Consórcios).</p>
                                
                                <div className="bg-primary/10 p-3 rounded border border-primary/20 my-2">
                                  <p className="text-xs font-bold text-primary mb-1">ESCOPO ESPECÍFICO DESTE PLANO ({plan.name}):</p>
                                  <p className="text-xs text-white">{plan.details.contract.incluso}</p>
                                  <p className="text-xs text-red-300 mt-1"><strong>VEDAÇÕES:</strong> {plan.details.contract.nao_incluso}</p>
                                </div>

                                <p><strong>Níveis de Serviço (Intermediação e Execução):</strong><br/>
                                <strong>Nível III:</strong> Inclui a Supervisão Ativa, onde o CONSULTOR participa em conjunto com o CONTRATANTE (via reuniões ou grupos de WhatsApp) nas tratativas com outros profissionais do mercado, atuando como suporte técnico para assegurar a adequação dos produtos, sem qualquer recebimento de comissão ou vínculo comercial com os fornecedores.<br/>
                                <strong>Nível IV:</strong> Inclui a Supervisão Ativa do Nível III somada à execução operacional completa de todas as demandas burocráticas e administrativas que não exijam a presença física, assinatura biométrica ou senha pessoal intransferível do CONTRATANTE, entregando as soluções prontas para validação final.</p>

                                <p><strong>2. METODOLOGIA DE INVESTIMENTOS E SEGUROS:</strong><br/>
                                <strong>Investimentos:</strong> O serviço limita-se à definição da estratégia de Alocação de Ativos (Asset Allocation) e Rebalanceamento Periódico, baseando-se exclusivamente na metodologia de Classificação de Risco dos Ativos (7 perfis de risco). O CONSULTOR não realiza custódia de valores nem emite ordens de compra/venda. A execução final é de responsabilidade exclusiva do cliente junto à sua corretora.<br/>
                                <strong>Seguros e Previdência:</strong> O trabalho consiste na análise de necessidade, cálculo de capital segurado e comparação técnica de apólices. A contratação final deve ser realizada através de corretor habilitado (SUSEP) ou instituição financeira de escolha do cliente.</p>

                                <p><strong>3. OBRIGAÇÕES DO CONSULTOR:</strong> Prestar as orientações técnicas com diligência; manter sigilo absoluto das informações (LGPD); cumprir os prazos de resposta (SLA) estabelecidos neste plano.</p>

                                <p><strong>4. OBRIGAÇÕES DO CONTRATANTE:</strong> Fornecer informações verídicas; manter os pagamentos em dia; comparecer às reuniões agendadas.</p>

                                <p><strong>5. AGENDAMENTOS E SLA:</strong><br/>
                                <strong>Política de "No-Show" (Ausência):</strong> O não comparecimento à reunião agendada, sem aviso prévio de cancelamento com antecedência mínima de 24 horas, implicará na consideração do serviço como PRESTADO, descontando-se do saldo de reuniões ou considerando-se cumprida a agenda do mês.<br/>
                                <strong>Canais Oficiais:</strong> Para fins de registro e contagem de prazos, são válidas apenas as solicitações realizadas em reunião ou via WhatsApp oficial. Áudios com mais de 2 minutos ou mensagens fora do horário comercial poderão ter prazo de resposta estendido.</p>

                                <p><strong>6. CANCELAMENTO E ARREPENDIMENTO:</strong><br/>
                                Conforme o Art. 49 do CDC, o cliente tem direito ao arrependimento em até 7 dias após a contratação, com reembolso integral. Após este prazo, o cancelamento da assinatura mensal pode ser feito a qualquer momento, interrompendo-se as cobranças futuras, sem reembolso dos dias já utilizados no mês corrente.</p>

                                <p><strong>7. ISENÇÃO DE RESPONSABILIDADE (CVM):</strong><br/>
                                Este serviço NÃO constitui consultoria de valores mobiliários (CVM Resolução 19) nem gestão de carteira administrada. O CONSULTOR não promete rentabilidade futura nem se responsabiliza por prejuízos decorrentes de riscos de mercado.</p>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
