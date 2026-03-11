import { Button } from "@/components/ui/button";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Compass,
  FileText,
  Handshake,
  MessageCircle,
  Shield,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link } from "wouter";

const trilha = [
  {
    numero: "01",
    titulo: "Entre em contato pelo WhatsApp",
    descricao:
      "Mande uma mensagem e nos conte brevemente o que está buscando. Sem formulários complicados — uma conversa simples já é suficiente para dar o primeiro passo.",
    icon: MessageCircle,
  },
  {
    numero: "02",
    titulo: "Agendamento do Diagnóstico Financeiro",
    descricao:
      "Verificamos juntos a disponibilidade de horário e agendamos a reunião de Diagnóstico Financeiro Inicial, que é a base de todo o trabalho.",
    icon: Compass,
  },
  {
    numero: "03",
    titulo: "Reserva do Horário — R$ 250,00",
    descricao:
      "Para garantir o horário, é feita uma reserva no valor de R$ 250,00. Em caso de não comparecimento sem aviso prévio, 50% do valor é retido. Se comparecer, o valor é integralmente abatido do Planejamento.",
    icon: Shield,
  },
  {
    numero: "04",
    titulo: "Preenchimento do Formulário Preparatório",
    descricao:
      "Você recebe um formulário para preencher antes da reunião. Quanto mais detalhado, mais objetivo e personalizado será o diagnóstico — e mais tempo aproveitamos juntos.",
    icon: FileText,
  },
  {
    numero: "05",
    titulo: "Diagnóstico Financeiro Inicial",
    descricao:
      "A reunião em si: mapeamos sua situação atual, seus objetivos, suas prioridades e os principais pontos de atenção em cada área da sua vida financeira.",
    icon: Target,
  },
  {
    numero: "06",
    titulo: "Negociação do Planejamento de Referência",
    descricao:
      "Com base no diagnóstico, apresentamos o escopo completo do trabalho e negociamos o valor do Planejamento de Referência, que é definido caso a caso.",
    icon: Handshake,
  },
  {
    numero: "07",
    titulo: "Entrega do Planejamento de Referência",
    descricao:
      "Em até 15 dias após o fechamento do negócio, você recebe seu Planejamento Financeiro de Referência completo — pronto para seguir, manter atualizado e consultar sempre que precisar.",
    icon: BookOpen,
  },
];

const vantagens = [
  {
    icon: Target,
    titulo: "Cada área da sua vida, analisada",
    descricao:
      "Orçamento, dívidas, investimentos, seguros, previdência, impostos, patrimônio, objetivos de curto e longo prazo — tudo mapeado e com estratégia definida.",
  },
  {
    icon: Compass,
    titulo: "Um norte claro para cada decisão",
    descricao:
      "Chega de ficar em dúvida sobre o que fazer primeiro. O Planejamento de Referência define prioridades e caminhos para cada objetivo da sua vida.",
  },
  {
    icon: TrendingUp,
    titulo: "Estratégias personalizadas para cada objetivo",
    descricao:
      "Não é um plano genérico copiado da internet. É construído para a sua realidade, seus números e os seus objetivos — não os de outra pessoa.",
  },
  {
    icon: Users,
    titulo: "Seu assistente sempre preparado",
    descricao:
      "Toda vez que precisar de assistência, seu consultor consulta o Planejamento de Referência para garantir que qualquer orientação esteja alinhada com o que foi definido para você.",
  },
  {
    icon: Shield,
    titulo: "Segurança para tomar decisões",
    descricao:
      "Com um planejamento em mãos, você para de tomar decisões financeiras no improviso. Cada escolha passa a ter um critério claro e fundamentado.",
  },
  {
    icon: CheckCircle2,
    titulo: "Documento vivo, não engavetado",
    descricao:
      "O Planejamento de Referência é feito para ser mantido atualizado conforme sua vida muda — não é um relatório que fica na gaveta.",
  },
];

export default function PlanejamentoReferencia() {
  const whatsappMsg = encodeURIComponent(
    "Oi Hugo. Quero fazer um diagnóstico para ter um Planejamento Financeiro de Referência"
  );
  const whatsappUrl = `https://wa.me/5581994297920?text=${whatsappMsg}`;

  return (
    <div className="space-y-20 pb-20">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="text-center space-y-6 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 text-primary text-sm font-medium bg-primary/5">
          <BookOpen className="h-4 w-4" />
          Planejamento Financeiro Completo
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
          Planejamento Financeiro{" "}
          <span className="gold-gradient-text">de Referência</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Um documento completo, personalizado e feito para durar — que mapeia
          cada área da sua vida financeira, define estratégias para cada
          objetivo e serve como base para todas as decisões que você tomar
          daqui pra frente.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg h-14 px-8 text-lg font-bold shadow-lg shadow-green-900/30 w-full sm:w-auto"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Quero meu Planejamento de Referência
            </Button>
          </a>
          <Link href="/planos">
            <Button
              size="lg"
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary/10 rounded-lg h-14 px-8 text-lg w-full sm:w-auto"
            >
              Ver Planos de Assistência
            </Button>
          </Link>
        </div>
      </section>

      {/* ── O QUE É ──────────────────────────────────────────────────────── */}
      <section className="bg-white/5 rounded-3xl border border-white/5 p-8 md:p-14 space-y-8">
        <div className="max-w-3xl mx-auto space-y-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            O que é o Planejamento de Referência?
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Pense no Planejamento de Referência como a{" "}
            <span className="text-white font-semibold">
              escritura da sua vida financeira
            </span>
            . Assim como você não compra um imóvel sem escritura, não faz
            sentido tomar decisões financeiras importantes sem um documento
            que registre onde você está, aonde quer chegar e qual é o melhor
            caminho para isso.
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed">
            É diferente de uma consultoria pontual — onde você resolve um
            problema de cada vez. O Planejamento de Referência analisa{" "}
            <span className="text-white font-semibold">
              cada área da sua vida
            </span>{" "}
            (orçamento, dívidas, investimentos, seguros, previdência,
            patrimônio, impostos, objetivos) e define uma estratégia
            específica para cada uma delas, considerando suas prioridades e
            sua realidade.
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Se a ADESÃO a um plano mensal é como ter um especialista sempre
            disponível para resolver o que surgir, o Planejamento de
            Referência é o{" "}
            <span className="text-white font-semibold">
              mapa que guia cada uma dessas resoluções
            </span>
            . Ele não fica engavetado — é mantido atualizado conforme sua
            vida muda e consultado sempre que você ou seu assistente
            precisarem tomar uma decisão.
          </p>
        </div>
      </section>

      {/* ── VANTAGENS ────────────────────────────────────────────────────── */}
      <section className="space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Por que ter um Planejamento de Referência?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Não é sobre ter um documento bonito. É sobre parar de tomar
            decisões financeiras no escuro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vantagens.map((v, i) => (
            <div
              key={i}
              className="bg-card/40 border border-white/5 hover:border-primary/20 rounded-2xl p-6 space-y-3 transition-all hover:-translate-y-1"
            >
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <v.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-white">{v.titulo}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {v.descricao}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TRILHA ───────────────────────────────────────────────────────── */}
      <section className="space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            O caminho até o seu Planejamento
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Do primeiro contato à entrega do documento — sete etapas simples
            e transparentes.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          {/* Linha vertical conectora */}
          <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary/60 via-primary/20 to-transparent hidden md:block" />

          <div className="space-y-4">
            {trilha.map((etapa, i) => (
              <div
                key={i}
                className="relative flex gap-6 items-start bg-card/40 border border-white/5 hover:border-primary/20 rounded-2xl p-6 transition-all"
              >
                {/* Número / ícone */}
                <div className="relative z-10 shrink-0 h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col items-center justify-center gap-0.5">
                  <span className="text-xs text-primary/60 font-mono leading-none">
                    {etapa.numero}
                  </span>
                  <etapa.icon className="h-5 w-5 text-primary" />
                </div>

                <div className="flex-1 space-y-1 pt-1">
                  <h3 className="text-base font-bold text-white">
                    {etapa.titulo}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {etapa.descricao}
                  </p>
                </div>

                {i < trilha.length - 1 && (
                  <ChevronRight className="hidden md:block absolute -bottom-5 left-8 -translate-x-1/2 h-4 w-4 text-primary/30 rotate-90" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────────── */}
      <section className="emerald-card p-8 md:p-14 relative overflow-hidden text-center border-primary/20 rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Pronto para ter um mapa da sua vida financeira?
          </h2>
          <p className="text-lg text-muted-foreground">
            O primeiro passo é uma conversa. Sem compromisso, sem formulário
            longo — só uma mensagem no WhatsApp.
          </p>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg h-14 px-10 text-lg font-bold shadow-lg shadow-green-900/30"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Falar com Hugo no WhatsApp
            </Button>
          </a>
          <p className="text-xs text-muted-foreground pt-2">
            Ao entrar em contato, você inicia a trilha para ter seu
            Planejamento Financeiro de Referência em mãos em até 15 dias após
            o diagnóstico.
          </p>
        </div>
      </section>
    </div>
  );
}
