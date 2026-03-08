import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, AlertTriangle, FileText, Shield, Loader2, ChevronDown, ChevronUp } from "lucide-react";
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
  { planId: number; checkoutId: number; preco: string }
> = {
  "HV Nível I":   { planId: 11830, checkoutId: 11649, preco: "29,90" },
  "HV Nível II":  { planId: 11831, checkoutId: 11650, preco: "59,90" },
  "HV Nível III": { planId: 11833, checkoutId: 11652, preco: "119,90" },
  "HV Nível IV":  { planId: 11835, checkoutId: 11653, preco: "299,90" },
};

// ─── Texto do contrato (resumido para exibição) ────────────────────────────────
const CONTRATO_CLAUSULAS = [
  {
    titulo: "1. OBJETO",
    texto:
      "Prestação de serviços de Consultoria e Planejamento Financeiro Pessoal, abrangendo, conforme o nível contratado: Planejamento Orçamentário, Gestão de Passivos e Dívidas, Análise de Viabilidade de Seguros, Planejamento Previdenciário, Estratégia de Alocação de Ativos, Otimização Fiscal (IRPF), Planejamento Sucessório, Gestão de Cartões/Milhas e Análise de Crédito.",
  },
  {
    titulo: "2. METODOLOGIA",
    texto:
      "O serviço limita-se à definição de estratégia e orientação técnica. O CONSULTOR não realiza custódia de valores, não emite ordens de compra/venda e não promete rentabilidade futura. A execução final é de responsabilidade exclusiva do cliente.",
  },
  {
    titulo: "3. OBRIGAÇÕES DO CONSULTOR",
    texto:
      "Prestar as orientações técnicas com diligência; manter sigilo absoluto das informações (LGPD); cumprir os prazos de resposta (SLA) estabelecidos no plano contratado.",
  },
  {
    titulo: "4. OBRIGAÇÕES DO CONTRATANTE",
    texto:
      "Fornecer informações verídicas; manter os pagamentos em dia; comparecer às reuniões agendadas.",
  },
  {
    titulo: "5. AGENDAMENTOS E SLA",
    texto:
      'Política de "No-Show": O não comparecimento à reunião agendada, sem aviso prévio mínimo de 24 horas, implica na consideração do serviço como PRESTADO. Canais oficiais: apenas WhatsApp oficial e reuniões agendadas.',
  },
  {
    titulo: "6. CANCELAMENTO E ARREPENDIMENTO",
    texto:
      "Conforme o Art. 49 do CDC, o cliente tem direito ao arrependimento em até 7 dias após a contratação, com reembolso integral. Após este prazo, o cancelamento pode ser feito a qualquer momento, interrompendo cobranças futuras, sem reembolso dos dias já utilizados no mês corrente.",
    destaque: true,
  },
  {
    titulo: "7. ISENÇÃO DE RESPONSABILIDADE (CVM)",
    texto:
      "Este serviço NÃO constitui consultoria de valores mobiliários (CVM Resolução 19) nem gestão de carteira administrada. O CONSULTOR não promete rentabilidade futura nem se responsabiliza por prejuízos decorrentes de riscos de mercado.",
  },
];

// ─── Componente principal ──────────────────────────────────────────────────────
export default function AceiteContrato() {
  // Lê o plano da URL: /aceite-contrato?plano=HV+Nível+I
  const params = new URLSearchParams(window.location.search);
  const planoNome = decodeURIComponent(params.get("plano") || "HV Nível I");
  const planoConfig = PLANOS_CONFIG[planoNome] || PLANOS_CONFIG["HV Nível I"];

  // ─── Estado ────────────────────────────────────────────────────────────────
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [aceiteTermos, setAceiteTermos] = useState(false);
  const [aceiteCancelamento, setAceiteCancelamento] = useState(false);
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

  function formatarTelefone(valor: string) {
    return valor
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d{4})$/, "$1-$2")
      .slice(0, 15);
  }

  // ─── Submissão ─────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (!nome.trim() || !email.trim()) {
      setErro("Por favor, preencha nome e e-mail.");
      return;
    }
    if (!aceiteTermos || !aceiteCancelamento) {
      setErro("Você precisa aceitar os termos e a política de cancelamento.");
      return;
    }

    setLoading(true);

    try {
      // 1. Criar ou buscar assinante no Cyclopay
      const [firstName, ...rest] = nome.trim().split(" ");
      const lastName = rest.join(" ") || firstName;
      const cpfLimpo = cpf.replace(/\D/g, "");
      const telefoneLimpo = telefone.replace(/\D/g, "");

      const customerPayload: Record<string, unknown> = {
        email: email.trim(),
        first_name: firstName,
        last_name: lastName,
      };
      if (cpfLimpo) {
        customerPayload.document = { type: "CPF", number: cpfLimpo };
      }
      if (telefoneLimpo) {
        customerPayload.mobile_phone = telefoneLimpo;
      }

      const customerRes = await fetch("https://api.cyclopay.com/v1/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          api_key: CYCLOPAY_API_KEY,
        },
        body: JSON.stringify(customerPayload),
      });

      let customerId: string | null = null;
      let checkoutUrl: string | null = null;

      if (customerRes.ok) {
        const customerData = await customerRes.json();
        customerId = customerData.customer_id;

        // 2. Gerar link de checkout personalizado
        const linkRes = await fetch(
          `https://api.cyclopay.com/v1/customers/${customerId}/checkout/${planoConfig.checkoutId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              api_key: CYCLOPAY_API_KEY,
            },
            body: JSON.stringify({ language: "pt-br" }),
          }
        );

        if (linkRes.ok) {
          const linkData = await linkRes.json();
          checkoutUrl = linkData.url || null;
        }
      } else if (customerRes.status === 409) {
        // Assinante já existe — buscar pelo e-mail
        const searchRes = await fetch(
          `https://api.cyclopay.com/v1/customers?email=${encodeURIComponent(email.trim())}`,
          {
            headers: {
              Accept: "application/json",
              api_key: CYCLOPAY_API_KEY,
            },
          }
        );
        if (searchRes.ok) {
          const searchData = await searchRes.json();
          const existing = searchData.items?.[0];
          if (existing) {
            customerId = existing.customer_id;

            const linkRes = await fetch(
              `https://api.cyclopay.com/v1/customers/${customerId}/checkout/${planoConfig.checkoutId}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  api_key: CYCLOPAY_API_KEY,
                },
                body: JSON.stringify({ language: "pt-br" }),
              }
            );
            if (linkRes.ok) {
              const linkData = await linkRes.json();
              checkoutUrl = linkData.url || null;
            }
          }
        }
      }

      // 3. Registrar aceite no Supabase
      await supabase.from("aceites_contrato").insert({
        nome: nome.trim(),
        email: email.trim(),
        cpf: cpfLimpo || null,
        telefone: telefoneLimpo || null,
        plano_nome: planoNome,
        plano_preco: planoConfig.preco,
        plano_checkout_url: checkoutUrl || `https://planofinanceiro.cyclopay.com/checkout/`,
        aceite_termos: aceiteTermos,
        aceite_politica_cancelamento: aceiteCancelamento,
        user_agent: navigator.userAgent,
        versao_contrato: "v1.0",
        cyclopay_customer_id: customerId,
        cyclopay_checkout_link: checkoutUrl,
        status: checkoutUrl ? "checkout_gerado" : "pendente",
      });

      // 4. Redirecionar para o checkout
      const destino =
        checkoutUrl ||
        `https://planofinanceiro.cyclopay.com/checkout/${
          planoNome === "HV Nível I"
            ? "WrKjwGYR4p"
            : planoNome === "HV Nível II"
            ? "2GoFRSHleo"
            : planoNome === "HV Nível III"
            ? "kgl3pLDplo"
            : "rHe327XILq"
        }`;

      window.location.href = destino;
    } catch (err) {
      console.error(err);
      setErro("Ocorreu um erro. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  }

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
          Antes de prosseguir para o pagamento, preencha seus dados e leia os
          termos do serviço.
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
            <p className="gold-gradient-text font-bold text-2xl">
              R$ {planoConfig.preco}
            </p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="grid grid-cols-2 gap-4">
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
              <div className="space-y-1.5">
                <Label htmlFor="telefone" className="text-white text-sm">
                  Telefone / WhatsApp
                </Label>
                <Input
                  id="telefone"
                  placeholder="(00) 00000-0000"
                  value={telefone}
                  onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                  className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>

          {/* Contrato */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setContratoExpandido(!contratoExpandido)}
              className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  Contrato de Prestação de Serviços
                </span>
              </div>
              {contratoExpandido ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            {contratoExpandido && (
              <div className="bg-black/30 border border-white/10 rounded-xl p-4 max-h-72 overflow-y-auto space-y-4 text-sm">
                {CONTRATO_CLAUSULAS.map((c, i) => (
                  <div key={i} className={c.destaque ? "bg-red-500/10 border border-red-500/30 rounded-lg p-3" : ""}>
                    <p className={`font-bold mb-1 ${c.destaque ? "text-red-400" : "text-primary"}`}>
                      {c.titulo}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">{c.texto}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkboxes de aceite */}
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div
                onClick={() => setAceiteTermos(!aceiteTermos)}
                className={`mt-0.5 h-5 w-5 shrink-0 rounded border-2 flex items-center justify-center transition-colors ${
                  aceiteTermos
                    ? "bg-primary border-primary"
                    : "border-white/30 group-hover:border-primary/60"
                }`}
              >
                {aceiteTermos && <Check className="h-3 w-3 text-black" />}
              </div>
              <span className="text-sm text-muted-foreground leading-relaxed">
                Li e aceito os{" "}
                <button
                  type="button"
                  onClick={() => setContratoExpandido(true)}
                  className="text-primary underline underline-offset-2"
                >
                  Termos do Contrato de Prestação de Serviços
                </button>{" "}
                e estou ciente do escopo do plano {planoNome}.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <div
                onClick={() => setAceiteCancelamento(!aceiteCancelamento)}
                className={`mt-0.5 h-5 w-5 shrink-0 rounded border-2 flex items-center justify-center transition-colors ${
                  aceiteCancelamento
                    ? "bg-primary border-primary"
                    : "border-white/30 group-hover:border-primary/60"
                }`}
              >
                {aceiteCancelamento && <Check className="h-3 w-3 text-black" />}
              </div>
              <span className="text-sm text-muted-foreground leading-relaxed">
                <span className="text-white font-medium">Política de Cancelamento:</span>{" "}
                Estou ciente de que tenho direito ao arrependimento em até{" "}
                <strong className="text-white">7 dias</strong> (com reembolso integral). Após
                esse prazo, posso cancelar a qualquer momento, mas{" "}
                <strong className="text-white">
                  não haverá reembolso dos dias já utilizados no mês corrente
                </strong>
                .
              </span>
            </label>
          </div>

          {/* Aviso de suspensão por inadimplência */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-red-400 font-bold mb-1">
                  CONDIÇÃO ESSENCIAL PARA ATENDIMENTO
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  O acesso a todos os benefícios do plano está condicionado à{" "}
                  <strong className="text-white">regularidade dos pagamentos</strong>. Havendo
                  pendência financeira, a prestação de serviços será{" "}
                  <strong className="text-white">IMEDIATAMENTE SUSPENSA</strong> até a
                  regularização.
                </p>
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
            disabled={loading || !aceiteTermos || !aceiteCancelamento}
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
            Ao clicar, você será redirecionado para o ambiente seguro de pagamento do Cyclopay.
          </p>
        </form>
      </div>
    </div>
  );
}
