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
        "Intermediação com profissionais",
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
          "Intermediação técnica com outros profissionais (corretores, gerentes, contadores) para garantir a melhor contratação, sem conflito de interesses (não recebemos comissão).",
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
          "Intermediação técnica com outros profissionais do mercado.",
          "Execução operacional completa: Resolvemos tudo o que não exigir a presença física ou biometria do titular, entregando a solução pronta para sua aprovação final.",
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
                        <DialogContent className="bg-card border-primary/20 text-white max-w-4xl max-h-[85vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-primary mb-2">CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE CONSULTORIA E PLANEJAMENTO FINANCEIRO</DialogTitle>
                            <DialogDescription>Leia atentamente os termos e condições abaixo.</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6 text-sm text-muted-foreground leading-relaxed pr-4 text-justify">
                            
                            <div className="p-6 bg-white/5 rounded-lg border border-white/5 space-y-6">
                              
                              <section>
                                <h4 className="font-bold text-white text-lg mb-3 border-b border-primary/20 pb-2">1. OBJETO E ESCOPO DOS SERVIÇOS</h4>
                                <p className="mb-3">
                                  O presente instrumento tem por objeto a prestação de serviços de <strong>Consultoria, Organização e Planejamento Financeiro Pessoal</strong>, visando a estruturação, otimização e proteção do patrimônio do CONTRATANTE. O escopo dos serviços abrange, de forma não exaustiva, as seguintes áreas de atuação:
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                  <li><strong>Planejamento Orçamentário e Fluxo de Caixa:</strong> Diagnóstico de receitas e despesas, categorização de gastos, definição de teto de gastos e estratégias para aumento da capacidade de poupança.</li>
                                  <li><strong>Gestão de Passivos e Dívidas:</strong> Análise de contratos de crédito, renegociação de dívidas, portabilidade de crédito, cálculo de Custo Efetivo Total (CET) e estratégias para quitação antecipada.</li>
                                  <li><strong>Gestão de Riscos e Seguros:</strong> Cálculo de necessidade de capital segurado para proteção familiar e patrimonial. Análise técnica e comparativa de apólices de Seguro de Vida, Seguro Residencial, Seguro Auto, Seguro de Responsabilidade Civil Profissional, Planos de Saúde e Odontológicos.</li>
                                  <li><strong>Planejamento Previdenciário:</strong> Projeção de necessidade de renda futura, análise de planos de previdência privada (PGBL/VGBL), avaliação de custos (taxas de administração e carregamento) e regime tributário (Progressivo vs. Regressivo).</li>
                                  <li><strong>Planejamento Sucessório:</strong> Orientação sobre transmissão de bens, holding familiar, testamentos e doações, visando a eficiência tributária e a preservação do patrimônio familiar.</li>
                                  <li><strong>Otimização Fiscal:</strong> Análise e orientação para declaração de Imposto de Renda Pessoa Física (IRPF), ganho de capital e estratégias legais para elisão fiscal.</li>
                                  <li><strong>Gestão de Benefícios e Fidelidade:</strong> Estratégias para maximização de acúmulo e uso de milhas aéreas, pontos de cartão de crédito e programas de fidelidade.</li>
                                  <li><strong>Consórcios e Financiamentos Imobiliários:</strong> Simulação e comparação de cenários para aquisição de bens (imóveis e veículos), avaliando a viabilidade econômica entre financiamento (SAC/Price), consórcio ou pagamento à vista.</li>
                                </ul>
                                <p className="mt-3 bg-primary/10 border-l-4 border-primary pl-4 py-2 text-primary-foreground/90 text-sm">
                                  <strong>Níveis de Serviço (Intermediação e Execução):</strong>
                                  <br/>
                                  <strong>Nível III:</strong> Inclui a intermediação técnica com outros profissionais do mercado (corretores, gerentes bancários, contadores, advogados), atuando o CONSULTOR como representante dos interesses técnicos do CONTRATANTE para assegurar a adequação dos produtos contratados, sem qualquer recebimento de comissão ou vínculo comercial com os fornecedores.
                                  <br/>
                                  <strong>Nível IV:</strong> Inclui a execução operacional completa de todas as demandas burocráticas e administrativas que não exijam a presença física, assinatura biométrica ou senha pessoal intransferível do CONTRATANTE, entregando as soluções prontas para validação final.
                                </p>
                              </section>

                              <section>
                                <h4 className="font-bold text-white text-lg mb-3 border-b border-primary/20 pb-2">2. METODOLOGIA DE ALOCAÇÃO DE ATIVOS E INVESTIMENTOS</h4>
                                <p className="mb-3">
                                  No tocante à gestão de investimentos financeiros, a atuação do CONSULTOR pauta-se exclusivamente pela metodologia de <strong>Alocação de Ativos (Asset Allocation)</strong> e rebalanceamento de carteira, respeitando estritamente o Perfil de Investidor (Suitability) do CONTRATANTE.
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                  <li><strong>Distribuição Estratégica:</strong> O CONSULTOR definirá, em conjunto com o CONTRATANTE, a distribuição percentual ideal do patrimônio entre as diversas classes de ativos (Renda Fixa Pós-fixada, Pré-fixada, Inflação, Renda Variável, Multimercados, Investimentos no Exterior, etc.).</li>
                                  <li><strong>Rebalanceamento Periódico:</strong> O CONSULTOR monitorará a carteira e indicará a necessidade de ajustes (aportes ou resgates) para manter a aderência à estratégia original e ao perfil de risco do cliente.</li>
                                  <li><strong>Análise de Produtos:</strong> O CONSULTOR realizará a análise técnica de produtos disponíveis no mercado (CDBs, LCIs, LCAs, Fundos de Investimento, Tesouro Direto, etc.), avaliando rentabilidade histórica, volatilidade, liquidez e custos, para subsidiar a tomada de decisão do CONTRATANTE.</li>
                                </ul>
                                <p className="mt-3 bg-yellow-500/10 border-l-4 border-yellow-500 pl-4 py-2 text-yellow-200/90 text-sm italic">
                                  <strong>Parágrafo Único:</strong> O CONSULTOR não realiza a gestão discricionária de recursos, nem detém procuração para movimentar contas em nome do CONTRATANTE. A execução final das ordens de compra e venda de ativos é de responsabilidade exclusiva do CONTRATANTE junto à sua instituição financeira.
                                </p>
                              </section>

                              <section>
                                <h4 className="font-bold text-white text-lg mb-3 border-b border-primary/20 pb-2">3. OBRIGAÇÕES DAS PARTES</h4>
                                <p className="mb-2 font-semibold text-white">3.1. Do CONSULTOR:</p>
                                <ul className="list-disc pl-5 space-y-1 mb-3">
                                  <li>Empregar as melhores técnicas e conhecimentos para a realização dos serviços contratados.</li>
                                  <li>Manter sigilo absoluto sobre todas as informações e dados fornecidos pelo CONTRATANTE.</li>
                                  <li>Cumprir os prazos de atendimento e entrega de relatórios estabelecidos neste contrato.</li>
                                  <li>Atuar com total isenção e ausência de conflito de interesses, não recebendo comissões, rebates ou incentivos de instituições financeiras ou seguradoras pela indicação de produtos.</li>
                                </ul>
                                <p className="mb-2 font-semibold text-white">3.2. Do CONTRATANTE:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                  <li>Fornecer informações verídicas, completas e atualizadas sobre sua situação financeira e patrimonial.</li>
                                  <li>Participar das reuniões agendadas e responder às solicitações de informações necessárias para a execução do planejamento.</li>
                                  <li>Efetuar o pagamento dos honorários acordados nas datas de vencimento.</li>
                                </ul>
                              </section>

                              <section>
                                <h4 className="font-bold text-white text-lg mb-3 border-b border-primary/20 pb-2">4. PRAZOS, AGENDAMENTOS E NÍVEL DE SERVIÇO (SLA)</h4>
                                <ul className="list-disc pl-5 space-y-2">
                                  <li>
                                    <strong>Disponibilidade de Agenda:</strong> O CONSULTOR compromete-se a disponibilizar horário para reunião em até <strong>{plan.details.contract.sla_agenda}</strong> após a solicitação formal do CONTRATANTE.
                                  </li>
                                  <li>
                                    <strong>Tempo de Resposta (WhatsApp):</strong> As dúvidas e solicitações enviadas pelos canais oficiais serão respondidas em até <strong>{plan.details.contract.sla_whatsapp}</strong> (dias úteis).
                                  </li>
                                  <li>
                                    <strong>Antecedência de Agendamento:</strong> As reuniões devem ser solicitadas com antecedência mínima de <strong>7 (sete) dias corridos</strong>. Solicitações com prazo inferior estarão sujeitas à disponibilidade eventual da agenda.
                                  </li>
                                  <li>
                                    <strong>Política de "No-Show" (Ausência):</strong> O não comparecimento do CONTRATANTE à reunião agendada, sem comunicação de cancelamento com antecedência mínima de 24 horas, implicará na contabilização da reunião como <strong>REALIZADA</strong> para todos os fins contratuais. A data da reunião não realizada será considerada como a data oficial da última atualização do planejamento.
                                  </li>
                                  <li>
                                    <strong>Remarcações:</strong> Em caso de cancelamento por parte do CONSULTOR, a remarcação será garantida na data mais próxima possível. Cancelamentos por iniciativa do CONTRATANTE não garantem prioridade de reagendamento imediato.
                                  </li>
                                </ul>
                              </section>

                              <section>
                                <h4 className="font-bold text-white text-lg mb-3 border-b border-primary/20 pb-2">5. CONFIDENCIALIDADE E PROTEÇÃO DE DADOS (LGPD)</h4>
                                <p className="mb-3">
                                  As partes comprometem-se a tratar os dados pessoais e financeiros envolvidos nesta prestação de serviços em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                  <li>
                                    <strong>Segurança da Informação:</strong> Será criada uma conta de e-mail exclusiva e criptografada (ex: <code>seu.cpf@hvsf.gmail.com</code>) para centralização e armazenamento seguro de documentos e informações financeiras. O acesso a esta conta é restrito e monitorado.
                                  </li>
                                  <li>
                                    <strong>Finalidade:</strong> Os dados coletados serão utilizados exclusivamente para a execução do planejamento financeiro, sendo vedado o seu compartilhamento com terceiros sem autorização expressa do CONTRATANTE.
                                  </li>
                                  <li>
                                    <strong>Retenção e Exclusão:</strong> Após o término do contrato, os dados serão mantidos em arquivo morto seguro pelo prazo de 60 (sessenta) dias para eventual reativação ou auditoria. Após este período, serão permanentemente excluídos dos sistemas do CONSULTOR.
                                  </li>
                                </ul>
                              </section>

                              <section>
                                <h4 className="font-bold text-white text-lg mb-3 border-b border-primary/20 pb-2">6. VIGÊNCIA, CANCELAMENTO E REEMBOLSO</h4>
                                <ul className="list-disc pl-5 space-y-2">
                                  <li>
                                    <strong>Vigência:</strong> Este contrato entra em vigor na data de sua aceitação eletrônica e vigorará por prazo indeterminado, renovando-se automaticamente a cada pagamento mensal.
                                  </li>
                                  <li>
                                    <strong>Cancelamento:</strong> O CONTRATANTE poderá solicitar o cancelamento do serviço a qualquer tempo, sem incidência de multa rescisória, mediante comunicação formal pelos canais oficiais.
                                  </li>
                                  <li>
                                    <strong>Direito de Arrependimento:</strong> Em conformidade com o Art. 49 do Código de Defesa do Consumidor, o CONTRATANTE poderá exercer o direito de arrependimento no prazo de <strong>7 (sete) dias corridos</strong> a contar da contratação, caso em que terá direito ao reembolso integral dos valores pagos.
                                  </li>
                                  <li>
                                    <strong>Reembolso após 7 dias:</strong> Após o prazo de arrependimento legal, não haverá reembolso de mensalidades já pagas, nem estorno proporcional (pro-rata) em caso de cancelamento no meio do ciclo de faturamento.
                                  </li>
                                </ul>
                              </section>

                              <section>
                                <h4 className="font-bold text-white text-lg mb-3 border-b border-primary/20 pb-2">7. DISPOSIÇÕES GERAIS</h4>
                                <p>
                                  As partes elegem o foro da comarca de domicílio do CONSULTOR para dirimir quaisquer dúvidas ou controvérsias oriundas deste contrato, com renúncia expressa a qualquer outro, por mais privilegiado que seja. E por estarem justos e contratados, firmam o presente instrumento através da aceitação eletrônica dos termos aqui dispostos.
                                </p>
                              </section>

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
