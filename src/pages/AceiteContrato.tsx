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
import ContratoTexto from "@/components/ContratoTexto";
import { porNome } from "@/lib/planos";

// ─── Configurações ────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://vbikskbfkhundhropykf.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiaWtza2Jma2h1bmRocm9weWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MTk5NjEsImV4cCI6MjA2MTA5NTk2MX0.-n-Tj_5JnF1NL2ZImWlMeTcobWDl_VD6Vqp0lxRQFFU";
const CYCLOPAY_API_KEY = "ak_aeb26f6be167cc077eb227c128262e731523d492";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


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


// ─── Componente principal ──────────────────────────────────────────────────────
export default function AceiteContrato() {
  const params = new URLSearchParams(window.location.search);
  const planoNome = decodeURIComponent(params.get("plano") || "HV Nível I");
  const plano = porNome(planoNome);

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

    // Níveis cujo checkout ainda não existe com o preço vigente não podem seguir
    // pelo fluxo automático — mandaria o cliente para uma cobrança de outro valor.
    if (!plano.checkoutUrl) {
      setErro(
        "Este nível ainda não tem contratação automática. Fale com o consultor pelo WhatsApp para assinar.",
      );
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
      const successUrl = `https://hvsaudefinanceira.com.br/aguardando-formulario?email=${encodeURIComponent(email.trim().toLowerCase())}&cpf=${encodeURIComponent(cpfLimpo || '')}&plano=${encodeURIComponent(planoNome)}`;
      if (customerId && plano.pagamento) {
        const linkRes = await fetch(
          `https://api.cyclopay.com/v1/customers/${customerId}/checkout/${plano.pagamento?.checkoutId}`,
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
          plano.checkoutUrl,
        aceite_termos: aceiteTermos,
        aceite_politica_cancelamento: aceiteCancelamento,
        aceite_condicao_atendimento: aceiteCondicao,
        user_agent: navigator.userAgent,
        versao_contrato: "v1.0",
        cyclopay_customer_id: customerId,
        cyclopay_checkout_link: checkoutUrl,
        status: checkoutUrl ? "checkout_gerado" : "pendente",
      });

      // 4. Salvar email, CPF e plano no sessionStorage para a página de aguardo
      sessionStorage.setItem('hvsf_pending_email', email.trim().toLowerCase());
      sessionStorage.setItem('hvsf_pending_cpf', cpfLimpo || '');
      sessionStorage.setItem('hvsf_pending_plano', planoNome);

      // 5. Redirecionar para o checkout do Cyclopay
      // Após o pagamento, o cliente deve navegar manualmente para /aguardando-formulario
      // (ou o Cyclopay redireciona se configurado com success_url)
      window.location.href =
        checkoutUrl ||
        plano.checkoutUrl;
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
                <ContratoTexto plano={plano} />
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
