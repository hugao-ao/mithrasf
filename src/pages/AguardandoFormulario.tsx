import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { createClient } from "@supabase/supabase-js";
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react";

const SUPABASE_URL = "https://vbikskbfkhundhropykf.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiaWtza2Jma2h1bmRocm9weWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxODkwNzAsImV4cCI6MjA1Mzc2NTA3MH0.NkEOkOEHvNKkHqjfMVCjCXFEiEHJLQJpNSJJbGqFNrI";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const FORM_BASE_URL = "https://app.hvsaudefinanceira.com.br/formulario-cliente.html";
const POLLING_INTERVAL_MS = 3000;
const MAX_WAIT_MS = 5 * 60 * 1000; // 5 minutos

export default function AguardandoFormulario() {
  const [, navigate] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const email = decodeURIComponent(params.get("email") || "");
  const plano = decodeURIComponent(params.get("plano") || "");

  const [status, setStatus] = useState<"aguardando" | "pronto" | "timeout">("aguardando");
  const [formUrl, setFormUrl] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!email) {
      // Sem e-mail, não tem como fazer polling — redireciona para home
      navigate("/");
      return;
    }

    async function checkFormReady() {
      // Verifica se o aceite_contrato já tem form_token preenchido
      const { data } = await supabase
        .from("aceites_contrato")
        .select("form_token, status")
        .eq("email", email.toLowerCase().trim())
        .eq("status", "cliente_criado")
        .limit(1)
        .maybeSingle();

      if (data?.form_token) {
        const url = `${FORM_BASE_URL}?token=${data.form_token}`;
        setFormUrl(url);
        setStatus("pronto");
        if (intervalRef.current) clearInterval(intervalRef.current);
        // Redireciona automaticamente após 2 segundos
        setTimeout(() => {
          window.location.href = url;
        }, 2000);
        return;
      }

      // Verifica timeout
      if (Date.now() - startTimeRef.current > MAX_WAIT_MS) {
        setStatus("timeout");
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }

    // Primeira verificação imediata
    checkFormReady();

    // Polling a cada 3 segundos
    intervalRef.current = setInterval(checkFormReady, POLLING_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [email, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center space-y-8">

        {/* Status: aguardando */}
        {status === "aguardando" && (
          <>
            {/* Ícone animado */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                </div>
              </div>
            </div>

            {/* Mensagem principal */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-white">
                Que bom ter você aqui!
              </h1>
              <div className="text-muted-foreground text-base leading-relaxed space-y-3 text-left bg-card/60 border border-white/10 rounded-2xl p-6">
                <p>
                  Sério, parabéns — não pela compra em si, mas pela decisão. A maioria das pessoas passa anos
                  sabendo que precisa organizar as finanças e nunca dá o primeiro passo.{" "}
                  <strong className="text-white">Você deu.</strong>
                </p>
                <p>
                  Agora vem o segundo: antes de começar, quero entender um pouco melhor onde você está hoje
                  e o que você quer alcançar. São algumas perguntas rápidas — quanto mais honesto você for,
                  mais objetivo eu consigo ser com você.
                </p>
                <p>
                  Ah, e uma coisa: o que você está comprando aqui não é só consultoria.{" "}
                  <strong className="text-white">É tempo.</strong> Tempo que você vai parar de perder
                  analisando as informações que você pesquisa na internet, antes você ter confiança em tomar
                  alguma decisão — e vai poder usar com outras coisas, afinal, nem tudo na vida é só sobre
                  dinheiro.
                </p>
                <p className="font-medium text-white">Vamos lá?</p>
              </div>
            </div>

            {/* Indicador de carregamento */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Preparando seu formulário personalizado...</span>
            </div>

            {plano && (
              <p className="text-xs text-muted-foreground">
                Plano contratado: <span className="text-primary font-medium">{plano}</span>
              </p>
            )}
          </>
        )}

        {/* Status: pronto */}
        {status === "pronto" && (
          <>
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">Tudo pronto!</h1>
              <p className="text-muted-foreground">
                Redirecionando para o seu formulário...
              </p>
            </div>
            {formUrl && (
              <a
                href={formUrl}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
              >
                Ir para o formulário agora
                <ArrowRight className="h-4 w-4" />
              </a>
            )}
          </>
        )}

        {/* Status: timeout */}
        {status === "timeout" && (
          <>
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-white">
                Quase lá!
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Seu pagamento foi confirmado, mas o formulário ainda está sendo preparado.
                Você receberá um link por e-mail em instantes, ou pode nos chamar no WhatsApp.
              </p>
            </div>
            <a
              href="https://wa.me/5581994297920?text=Oi%2C%20acabei%20de%20me%20tornar%20cliente%20e%20estou%20precisando%20falar%20com%20voc%C3%AA%2C%20Hugo."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Falar no WhatsApp
              <ArrowRight className="h-4 w-4" />
            </a>
          </>
        )}

      </div>
    </div>
  );
}
