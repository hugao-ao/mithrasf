import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Check,
  AlertTriangle,
  FileText,
  Shield,
  Loader2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// ─── Configurações ────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://vbikskbfkhundhropykf.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiaWtza2Jma2h1bmRocm9weWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MTk5NjEsImV4cCI6MjA2MTA5NTk2MX0.-n-Tj_5JnF1NL2ZImWlMeTcobWDl_VD6Vqp0lxRQFFU";
const CYCLOPAY_API_KEY = "ak_aeb26f6be167cc077eb227c128262e731523d492";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Mapa de planos ────────────────────────────────────────────────────────────
const PLANOS_CONFIG: Record<
  string,
  {
    planId: number;
    checkoutId: number;
    preco: string;
    checkoutFallback: string;
    sla_agenda: string;
    sla_whatsapp: string;
    incluso: string;
    nao_incluso: string;
    escopo: string[];
    adesao_info: string;
  }
> = {
  "HV Nível I": {
    planId: 11830,
    checkoutId: 11649,
    preco: "29,90",
    checkoutFallback: "WrKjwGYR4p",
    sla_agenda: "6 meses",
    sla_whatsapp: "30 dias",
    incluso: "Orientação estratégica e resolução de dúvidas pontuais.",
    nao_incluso:
      "Cotações de preços, pesquisas de mercado, contato com terceiros, execução de tarefas operacionais, relatórios escritos fora de reunião.",
    escopo: [
      "Contato ilimitado via WhatsApp (sem análises novas ou cotações).",
      "Resolução de qualquer tipo de demanda durante o horário da reunião.",
    ],
    adesao_info:
      "(Com um Planejamento de Referência, tem direito a pedir 1 reunião de monitoramento a cada 6 meses)",
  },
  "HV Nível II": {
    planId: 11831,
    checkoutId: 11650,
    preco: "59,90",
    checkoutFallback: "2GoFRSHleo",
    sla_agenda: "4 meses",
    sla_whatsapp: "15 dias",
    incluso:
      "Tudo do Nível I + Realização de cotações de preços e pesquisas comparativas de produtos/serviços solicitados em reunião.",
    nao_incluso:
      "Contato com terceiros (corretores, gerentes), intermediação de contratações, execução de tarefas operacionais, relatórios mensais.",
    escopo: [
      "Contato ilimitado via WhatsApp (sem novas análises).",
      "Resolução de qualquer tipo de demanda durante o horário da reunião.",
      "Cotações e pesquisas relativas às demandas da reunião.",
    ],
    adesao_info:
      "(Com um Planejamento de Referência, tem direito a pedir 1 reunião de monitoramento a cada 4 meses)",
  },
  "HV Nível III": {
    planId: 11833,
    checkoutId: 11652,
    preco: "119,90",
    checkoutFallback: "kgl3pLDplo",
    sla_agenda: "2 meses",
    sla_whatsapp: "7 dias",
    incluso:
      "Tudo do Nível II + Supervisão técnica ativa em reuniões/grupos com terceiros + Relatórios mensais de acompanhamento.",
    nao_incluso:
      "Execução operacional de tarefas (preenchimento de formulários, envio de documentos, trâmites burocráticos) em nome do cliente.",
    escopo: [
      "Contato ilimitado via WhatsApp.",
      "Resolução de qualquer tipo de demanda durante o horário da reunião.",
      "Cotações e pesquisas relativas às demandas da reunião.",
      "Supervisão Ativa: Acompanhamento em tempo real (reuniões conjuntas ou grupos de WhatsApp) das tratativas com outros profissionais para garantir a adequação técnica do que está sendo contratado.",
      "Contato via WhatsApp mensal para atualizações e/ou relatórios.",
    ],
    adesao_info:
      "(Com um Planejamento de Referência, tem direito a pedir 1 reunião de monitoramento a cada 2 meses)",
  },
  "HV Nível IV": {
    planId: 11835,
    checkoutId: 11653,
    preco: "299,90",
    checkoutFallback: "rHe327XILq",
    sla_agenda: "1 mês",
    sla_whatsapp: "72 horas",
    incluso:
      "Tudo do Nível III + Execução operacional completa de demandas burocráticas + Relatórios semanais + Horário fixo garantido.",
    nao_incluso:
      "Atos que exijam estritamente a presença física, assinatura biométrica ou uso de senha pessoal intransferível do titular.",
    escopo: [
      "Contato ilimitado via WhatsApp.",
      "Resolução de qualquer tipo de demanda durante o horário da reunião.",
      "Cotações e pesquisas relativas às demandas da reunião.",
      "Supervisão Ativa com outros profissionais (conforme Nível III).",
      "Execução Operacional Completa: Realização de todas as tarefas burocráticas e administrativas possíveis, entregando a solução pronta para validação final do cliente.",
      "Contato via WhatsApp semanal para atualizações e/ou relatórios.",
    ],
    adesao_info: "",
  },
};

// ─── Checkbox customizado ──────────────────────────────────────────────────────
function CustomCheckbox({
  checked,
  onChange,
  color = "primary",
}: {
  checked: boolean;
  onChange: () => void;
  color?: "yellow" | "green" | "red";
}) {
  const colorMap = {
    yellow: checked
      ? "bg-yellow-400 border-yellow-400"
      : "border-yellow-400/50 hover:border-yellow-400",
    green: checked
      ? "bg-green-500 border-green-500"
      : "border-green-500/50 hover:border-green-500",
    red: checked
      ? "bg-red-500 border-red-500"
      : "border-red-500/50 hover:border-red-500",
  };
  const checkColor = {
    yellow: "text-black",
    green: "text-white",
    red: "text-white",
  };
  return (
    <div
      onClick={onChange}
      className={`mt-0.5 h-5 w-5 shrink-0 rounded border-2 flex items-center justify-center transition-colors cursor-pointer ${colorMap[color]}`}
    >
      {checked && <Check className={`h-3 w-3 ${checkColor[color]}`} />}
    </div>
  );
}

// ─── Contrato completo por plano (idêntico ao de Planos.tsx) ─────────────────
function ContratoCompleto({ planoNome }: { planoNome: string }) {
  const plano = PLANOS_CONFIG[planoNome] || PLANOS_CONFIG["HV Nível I"];

  return (
    <div className="text-sm text-muted-foreground space-y-4 text-justify">
      <p>
        <strong>1. OBJETO:</strong> Prestação de serviços de Consultoria e Planejamento
        Financeiro Pessoal, abrangendo, conforme o nível contratado: Planejamento
        Orçamentário, Gestão de Passivos e Dívidas, Análise de Viabilidade de Seguros
        (Vida, Auto, Residencial, Saúde), Planejamento Previdenciário (PGBL/VGBL),
        Estratégia de Alocação de Ativos, Otimização Fiscal (IRPF), Planejamento
        Sucessório, Gestão de Cartões/Milhas e Análise de Crédito
        (Financiamentos/Consórcios).
      </p>

      {/* Escopo específico do plano */}
      <div className="bg-primary/10 p-3 rounded border border-primary/20">
        <p className="text-xs font-bold text-primary mb-1">
          ESCOPO ESPECÍFICO DESTE PLANO ({planoNome}):
        </p>
        <ul className="space-y-1 mb-2">
          {plano.escopo.map((item, i) => (
            <li key={i} className="flex gap-2 text-xs text-white">
              <span className="text-primary shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        {plano.adesao_info && (
          <p className="text-xs text-muted-foreground italic mb-2">{plano.adesao_info}</p>
        )}
        <p className="text-xs text-white">{plano.incluso}</p>
        <p className="text-xs text-red-300 mt-1">
          <strong>VEDAÇÕES:</strong> {plano.nao_incluso}
        </p>
      </div>

      <p>
        <strong>Níveis de Serviço (Intermediação e Execução):</strong>
        <br />
        <strong>Nível III:</strong> Inclui a Supervisão Ativa, onde o CONSULTOR participa
        em conjunto com o CONTRATANTE (via reuniões ou grupos de WhatsApp) nas tratativas
        com outros profissionais do mercado, atuando como suporte técnico para assegurar a
        adequação dos produtos, sem qualquer recebimento de comissão ou vínculo comercial
        com os fornecedores.
        <br />
        <strong>Nível IV:</strong> Inclui a Supervisão Ativa do Nível III somada à execução
        operacional completa de todas as demandas burocráticas e administrativas que não
        exijam a presença física, assinatura biométrica ou senha pessoal intransferível do
        CONTRATANTE, entregando as soluções prontas para validação final.
      </p>

      <p>
        <strong>2. METODOLOGIA DE INVESTIMENTOS E SEGUROS:</strong>
        <br />
        <strong>Investimentos:</strong> O serviço limita-se à definição da estratégia de
        Alocação de Ativos (Asset Allocation) e Rebalanceamento Periódico, baseando-se
        exclusivamente na metodologia de Classificação de Risco dos Ativos (7 perfis de
        risco). O CONSULTOR não realiza custódia de valores nem emite ordens de
        compra/venda. A execução final é de responsabilidade exclusiva do cliente junto à
        sua corretora.
        <br />
        <strong>Seguros e Previdência:</strong> O trabalho consiste na análise de
        necessidade, cálculo de capital segurado e comparação técnica de apólices. A
        contratação final deve ser realizada através de corretor habilitado (SUSEP) ou
        instituição financeira de escolha do cliente.
      </p>

      <p>
        <strong>3. OBRIGAÇÕES DO CONSULTOR:</strong> Prestar as orientações técnicas com
        diligência; manter sigilo absoluto das informações (LGPD); cumprir os prazos de
        resposta (SLA) estabelecidos neste plano.
      </p>

      <p>
        <strong>4. OBRIGAÇÕES DO CONTRATANTE:</strong> Fornecer informações verídicas;
        manter os pagamentos em dia; comparecer às reuniões agendadas.
      </p>

      <p>
        <strong>5. AGENDAMENTOS E SLA:</strong>
        <br />
        <strong>Política de "No-Show" (Ausência):</strong> O não comparecimento à reunião
        agendada, sem aviso prévio de cancelamento com antecedência mínima de 24 horas,
        implicará na consideração do serviço como PRESTADO, descontando-se do saldo de
        reuniões ou considerando-se cumprida a agenda do mês.
        <br />
        <strong>Canais Oficiais:</strong> Para fins de registro e contagem de prazos, são
        válidas apenas as solicitações realizadas em reunião ou via WhatsApp oficial. Áudios
        com mais de 2 minutos ou mensagens fora do horário comercial poderão ter prazo de
        resposta estendido.
        <br />
        <strong>SLA deste plano — Agenda:</strong> {plano.sla_agenda} |{" "}
        <strong>WhatsApp:</strong> {plano.sla_whatsapp}
      </p>

      <p>
        <strong>6. CANCELAMENTO E ARREPENDIMENTO:</strong>
        <br />
        Conforme o Art. 49 do CDC, o cliente tem direito ao arrependimento em até 7 dias
        após a contratação, com reembolso integral. Após este prazo, o cancelamento da
        assinatura mensal pode ser feito a qualquer momento, interrompendo-se as cobranças
        futuras, sem reembolso dos dias já utilizados no mês corrente.
      </p>

      <p>
        <strong>7. ISENÇÃO DE RESPONSABILIDADE (CVM):</strong>
        <br />
        Este serviço NÃO constitui consultoria de valores mobiliários (CVM Resolução 19)
        nem gestão de carteira administrada. O CONSULTOR não promete rentabilidade futura
        nem se responsabiliza por prejuízos decorrentes de riscos de mercado.
      </p>

      <div className="bg-red-500/10 border border-red-500/30 p-3 rounded">
        <h4 className="text-red-400 font-bold mb-1 flex items-center gap-2 text-xs">
          <AlertTriangle className="h-4 w-4" /> CONDIÇÃO ESSENCIAL PARA ATENDIMENTO
        </h4>
        <p className="text-xs text-white">
          <strong>8. POLÍTICA DE PAGAMENTO E SUSPENSÃO DE SERVIÇOS:</strong> O acesso a
          quaisquer benefícios deste plano (incluindo respostas no WhatsApp, agendamento de
          reuniões e envio de relatórios) está estritamente condicionado à regularidade dos
          pagamentos. O CONSULTOR realizará a verificação de adimplência antes de iniciar
          qualquer atendimento. Havendo pendência financeira, a prestação de serviços será{" "}
          <strong>IMEDIATAMENTE SUSPENSA</strong> até a regularização, sem que isso gere
          qualquer direito a indenização ou extensão de prazo contratual.
        </p>
      </div>
    </div>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────────
export default function AceiteContrato() {
  const params = new URLSearchParams(window.location.search);
  const planoNome = decodeURIComponent(params.get("plano") || "HV Nível I");
  const plano = PLANOS_CONFIG[planoNome] || PLANOS_CONFIG["HV Nível I"];

  // ─── Estado ────────────────────────────────────────────────────────────────
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");

  const [aceiteTermos, setAceiteTermos] = useState(false);
  const [aceiteCancelamento, setAceiteCancelamento] = useState(false);
  const [aceiteCondicao, setAceiteCondicao] = useState(false);
  const [contratoExpandido, setContratoExpandido] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  // ─── Helpers ───────────────────────────────────────────────────────────────
  function formatarCPF(valor: string) {
    return valor
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);
  }


  // ─── Submissão ─────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (!nome.trim() || !email.trim()) {
      setErro("Por favor, preencha nome e e-mail.");
      return;
    }
    if (!aceiteTermos || !aceiteCancelamento || !aceiteCondicao) {
      setErro("Você precisa marcar todos os checkboxes obrigatórios para continuar.");
      return;
    }

    setLoading(true);

    try {
      const [firstName, ...rest] = nome.trim().split(" ");
      const lastName = rest.join(" ") || firstName;
      const cpfLimpo = cpf.replace(/\D/g, "");

      const customerPayload: Record<string, unknown> = {
        email: email.trim(),
        first_name: firstName,
        last_name: lastName,
      };
      if (cpfLimpo) customerPayload.document = { type: "CPF", number: cpfLimpo };

      let customerId: string | null = null;
      let checkoutUrl: string | null = null;

      // 1. Criar assinante no Cyclopay
      const customerRes = await fetch("https://api.cyclopay.com/v1/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          api_key: CYCLOPAY_API_KEY,
        },
        body: JSON.stringify(customerPayload),
      });

      if (customerRes.ok) {
        const customerData = await customerRes.json();
        customerId = customerData.customer_id;
      } else if (customerRes.status === 409) {
        const searchRes = await fetch(
          `https://api.cyclopay.com/v1/customers?email=${encodeURIComponent(email.trim())}`,
          { headers: { Accept: "application/json", api_key: CYCLOPAY_API_KEY } }
        );
        if (searchRes.ok) {
          const searchData = await searchRes.json();
          const existing = searchData.items?.[0];
          if (existing) customerId = existing.customer_id;
        }
      }

      // 2. Gerar link de checkout personalizado
      const successUrl = `https://hvsaudefinanceira.com.br/aguardando-formulario?email=${encodeURIComponent(email.trim().toLowerCase())}&plano=${encodeURIComponent(planoNome)}`;
      if (customerId) {
        const linkRes = await fetch(
          `https://api.cyclopay.com/v1/customers/${customerId}/checkout/${plano.checkoutId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              api_key: CYCLOPAY_API_KEY,
            },
            body: JSON.stringify({ language: "pt-br", success_url: successUrl }),
          }
        );
        if (linkRes.ok) {
          const linkData = await linkRes.json();
          checkoutUrl = linkData.url || null;
        }
      }

      // 3. Registrar aceite no Supabase
      await supabase.from("aceites_contrato").insert({
        nome: nome.trim(),
        email: email.trim(),
        cpf: cpfLimpo || null,
        plano_nome: planoNome,
        plano_preco: plano.preco,
        plano_checkout_url:
          checkoutUrl ||
          `https://planofinanceiro.cyclopay.com/checkout/${plano.checkoutFallback}`,
        aceite_termos: aceiteTermos,
        aceite_politica_cancelamento: aceiteCancelamento,
        aceite_condicao_atendimento: aceiteCondicao,
        user_agent: navigator.userAgent,
        versao_contrato: "v1.0",
        cyclopay_customer_id: customerId,
        cyclopay_checkout_link: checkoutUrl,
        status: checkoutUrl ? "checkout_gerado" : "pendente",
      });

      // 4. Salvar email no sessionStorage para o polling na página de aguardo
      sessionStorage.setItem('hvsf_pending_email', email.trim().toLowerCase());
      sessionStorage.setItem('hvsf_pending_plano', planoNome);

      // 5. Redirecionar para o checkout do Cyclopay
      // Após o pagamento, o cliente deve navegar manualmente para /aguardando-formulario
      // (ou o Cyclopay redireciona se configurado com success_url)
      window.location.href =
        checkoutUrl ||
        `https://planofinanceiro.cyclopay.com/checkout?hash=${plano.checkoutFallback}`;
    } catch (err) {
      console.error(err);
      setErro("Ocorreu um erro. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const podeEnviar = aceiteTermos && aceiteCancelamento && aceiteCondicao;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20 px-4">
      {/* Cabeçalho */}
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
          <FileText className="h-4 w-4" />
          Aceite de Contrato
        </div>
        <h1 className="text-3xl font-bold text-white">
          Você escolheu o{" "}
          <span className="gold-gradient-text">{planoNome}</span>
        </h1>
        <p className="text-muted-foreground">
          Antes de prosseguir para o pagamento, preencha seus dados e leia os termos do
          serviço.
        </p>
      </div>

      {/* Card principal */}
      <div className="bg-card/60 border border-white/10 rounded-2xl p-6 space-y-6">
        {/* Resumo do plano */}
        <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-xl p-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Plano selecionado
            </p>
            <p className="text-white font-bold text-lg">{planoNome}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Valor mensal</p>
            <p className="gold-gradient-text font-bold text-2xl">R$ {plano.preco}</p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dados pessoais */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="nome" className="text-white text-sm">
                Nome completo <span className="text-red-400">*</span>
              </Label>
              <Input
                id="nome"
                placeholder="Seu nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-white text-sm">
                E-mail <span className="text-red-400">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cpf" className="text-white text-sm">
                CPF
              </Label>
              <Input
                id="cpf"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(formatarCPF(e.target.value))}
                className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* ── Contrato completo (expansível) ── */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setContratoExpandido(!contratoExpandido)}
              className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  Contrato de Prestação de Serviços — {planoNome}
                </span>
              </div>
              {contratoExpandido ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            {contratoExpandido && (
              <div className="bg-black/30 border border-white/10 rounded-xl p-4 max-h-96 overflow-y-auto">
                <ContratoCompleto planoNome={planoNome} />
              </div>
            )}
          </div>

          {/* ── 1. Li e aceito (caixa amarela) ── */}
          <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-yellow-400 font-bold text-sm mb-1">
                    TERMOS DO CONTRATO
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Leia o contrato completo acima antes de marcar. Ao aceitar, você
                    confirma que leu e compreendeu todas as cláusulas do{" "}
                    <button
                      type="button"
                      onClick={() => setContratoExpandido(true)}
                      className="text-primary underline underline-offset-2"
                    >
                      Contrato de Prestação de Serviços — {planoNome}
                    </button>
                    .
                  </p>
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <CustomCheckbox
                    checked={aceiteTermos}
                    onChange={() => setAceiteTermos(!aceiteTermos)}
                    color="yellow"
                  />
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    <span className="text-yellow-400 font-semibold">Li e aceito</span> os
                    Termos do Contrato de Prestação de Serviços e estou ciente do escopo
                    do plano {planoNome}.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* ── 2. Política de Cancelamento (caixa verde) ── */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-green-400 font-bold text-sm mb-1">
                    POLÍTICA DE CANCELAMENTO
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Você tem direito ao arrependimento em até{" "}
                    <strong className="text-white">7 dias</strong> (com reembolso
                    integral). Após esse prazo, pode cancelar a qualquer momento, mas{" "}
                    <strong className="text-white">
                      não haverá reembolso dos dias já utilizados no mês corrente
                    </strong>
                    .
                  </p>
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <CustomCheckbox
                    checked={aceiteCancelamento}
                    onChange={() => setAceiteCancelamento(!aceiteCancelamento)}
                    color="green"
                  />
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    <span className="text-yellow-400 font-semibold">
                      Li e estou ciente
                    </span>{" "}
                    da Política de Cancelamento acima.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* ── 3. Condição Essencial para Atendimento (caixa vermelha) ── */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-red-400 font-bold text-sm mb-1">
                    CONDIÇÃO ESSENCIAL PARA ATENDIMENTO
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    O acesso a todos os benefícios do plano está condicionado à{" "}
                    <strong className="text-white">regularidade dos pagamentos</strong>.
                    Havendo pendência financeira, a prestação de serviços será{" "}
                    <strong className="text-white">IMEDIATAMENTE SUSPENSA</strong> até a
                    regularização.
                  </p>
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <CustomCheckbox
                    checked={aceiteCondicao}
                    onChange={() => setAceiteCondicao(!aceiteCondicao)}
                    color="red"
                  />
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    <span className="text-yellow-400 font-semibold">Estou ciente</span> de
                    que o não pagamento suspende imediatamente o atendimento.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Erro */}
          {erro && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
              {erro}
            </div>
          )}

          {/* Botão */}
          <Button
            type="submit"
            disabled={loading || !podeEnviar}
            className="w-full h-14 text-base font-bold bg-primary text-black hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Shield className="h-5 w-5 mr-2" />
                Aceitar e Ir para o Pagamento
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Ao clicar, você será redirecionado para o ambiente seguro de pagamento do
            Cyclopay.
          </p>
        </form>
      </div>
    </div>
  );
}
