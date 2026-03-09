import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { createClient } from "@supabase/supabase-js";
import { Loader2, CheckCircle2, ArrowRight, Pause, Play, AlertCircle } from "lucide-react";

const SUPABASE_URL = "https://vbikskbfkhundhropykf.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiaWtza2Jma2h1bmRocm9weWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MTk5NjEsImV4cCI6MjA2MTA5NTk2MX0.-n-Tj_5JnF1NL2ZImWlMeTcobWDl_VD6Vqp0lxRQFFU";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const FORM_BASE_URL = "https://app.hvsaudefinanceira.com.br/formulario-cliente.html";
const POLLING_INTERVAL_MS = 3000;
const MAX_WAIT_MS = 5 * 60 * 1000; // 5 minutos
const COUNTDOWN_SECONDS = 60; // 1 minuto de leitura
const WHATSAPP_URL =
  "https://wa.me/5581994297920?text=Oi%2C%20acabei%20de%20me%20tornar%20cliente%20e%20estou%20precisando%20falar%20com%20voc%C3%AA%2C%20Hugo.";

export default function AguardandoFormulario() {
  const [, navigate] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const email = decodeURIComponent(
    params.get("email") || sessionStorage.getItem("hvsf_pending_email") || ""
  );
  const plano = decodeURIComponent(
    params.get("plano") || sessionStorage.getItem("hvsf_pending_plano") || ""
  );

  const [status, setStatus] = useState<"aguardando" | "pronto" | "timeout" | "erro">("aguardando");
  const [formUrl, setFormUrl] = useState<string | null>(null);

  // Relógio regressivo
  const [countdown, setCountdown] = useState<number>(COUNTDOWN_SECONDS);
  const [paused, setPaused] = useState<boolean>(false);
  const [countdownDone, setCountdownDone] = useState<boolean>(false);

  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const formUrlRef = useRef<string | null>(null);
  const pausedRef = useRef<boolean>(false);
  const errorCountRef = useRef<number>(0);

  // Mantém pausedRef sincronizado com o estado
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  // Função para avançar para o formulário
  const goToForm = useCallback(() => {
    if (formUrlRef.current) {
      window.location.href = formUrlRef.current;
    }
  }, []);

  // Relógio regressivo — só começa quando o formulário estiver pronto
  useEffect(() => {
    if (!countdownDone) return;
    // Formulário pronto e countdown zerou — redireciona
    if (formUrlRef.current) {
      window.location.href = formUrlRef.current;
    }
  }, [countdownDone]);

  // Inicia o countdown quando status muda para "pronto"
  useEffect(() => {
    if (status !== "pronto") return;

    countdownIntervalRef.current = setInterval(() => {
      if (pausedRef.current) return; // pausado, não decrementa
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
          setCountdownDone(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [status]);

  // Polling para verificar se o formulário foi criado
  useEffect(() => {
    if (!email) {
      navigate("/");
      return;
    }

    async function checkFormReady() {
      try {
        const { data, error } = await supabase
          .from("aceites_contrato")
          .select("form_token, status")
          .eq("email", email.toLowerCase().trim())
          .eq("status", "cliente_criado")
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        // Reseta contador de erros em caso de sucesso
        errorCountRef.current = 0;

        if (data?.form_token) {
          const url = `${FORM_BASE_URL}?token=${data.form_token}`;
          formUrlRef.current = url;
          setFormUrl(url);
          setStatus("pronto");
          if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
          return;
        }

        if (Date.now() - startTimeRef.current > MAX_WAIT_MS) {
          setStatus("timeout");
          if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        }
      } catch (err) {
        // Incrementa contador de erros consecutivos
        errorCountRef.current += 1;

        // Após 5 erros consecutivos, exibe tela de erro com WhatsApp
        if (errorCountRef.current >= 5) {
          setStatus("erro");
          if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        }
      }
    }

    checkFormReady();
    pollingIntervalRef.current = setInterval(checkFormReady, POLLING_INTERVAL_MS);

    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, [email, navigate]);

  // Calcula a porcentagem para o anel SVG
  const progress = countdown / COUNTDOWN_SECONDS;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  // Bloco de botão WhatsApp reutilizável
  const WhatsAppButton = () => (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
    >
      Falar no WhatsApp
      <ArrowRight className="h-4 w-4" />
    </a>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center space-y-8">

        {/* Status: aguardando */}
        {status === "aguardando" && (
          <>
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-white">
                Que bom ter você aqui!
              </h1>
              <div className="text-muted-foreground text-base leading-relaxed space-y-3 text-left bg-card/60 border border-white/10 rounded-2xl p-6">
                <p>
                  Sério, parabéns — não pela compra em si, mas pela decisão. A maioria das pessoas passa anos
                  sabendo que poderia ter feito as coisas de um jeito melhor e nunca dá o primeiro passo.{" "}
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
                  analisando as informações que você pesquisa na internet, antes você ter confiança para tomar
                  alguma decisão — e vai poder usar com outras coisas, afinal, nem tudo na vida é só sobre
                  dinheiro.
                </p>
                <p className="font-medium text-white">Vamos lá?</p>
              </div>
            </div>

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

        {/* Status: pronto — mostra mensagem + relógio regressivo */}
        {status === "pronto" && (
          <>
            {/* Mensagem principal */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-white">
                Que bom ter você aqui!
              </h1>
              <div className="text-muted-foreground text-base leading-relaxed space-y-3 text-left bg-card/60 border border-white/10 rounded-2xl p-6">
                <p>
                  Sério, parabéns — não pela compra em si, mas pela decisão. A maioria das pessoas passa anos
                  sabendo que poderia ter feito as coisas de um jeito melhor e nunca dá o primeiro passo.{" "}
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
                  analisando as informações que você pesquisa na internet, antes você ter confiança para tomar
                  alguma decisão — e vai poder usar com outras coisas, afinal, nem tudo na vida é só sobre
                  dinheiro.
                </p>
                <p className="font-medium text-white">Vamos lá?</p>
              </div>
            </div>

            {/* Relógio regressivo + controles */}
            <div className="flex flex-col items-center gap-4">
              {/* Anel SVG com contagem */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 88 88">
                  {/* Trilha de fundo */}
                  <circle
                    cx="44" cy="44" r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-white/10"
                  />
                  {/* Arco de progresso */}
                  <circle
                    cx="44" cy="44" r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className={`transition-all duration-1000 ${paused ? "text-yellow-400" : "text-primary"}`}
                  />
                </svg>
                {/* Número no centro */}
                <span className={`text-2xl font-bold tabular-nums ${paused ? "text-yellow-400" : "text-white"}`}>
                  {countdown}
                </span>
              </div>

              <p className="text-sm text-muted-foreground">
                {paused
                  ? "Relógio pausado — leia com calma"
                  : `Seu formulário abre em ${countdown} segundo${countdown !== 1 ? "s" : ""}...`}
              </p>

              {/* Botões */}
              <div className="flex items-center gap-3">
                {/* Pausar / Retomar */}
                <button
                  onClick={() => setPaused((p) => !p)}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  {paused ? (
                    <><Play className="h-4 w-4" /> Retomar</>
                  ) : (
                    <><Pause className="h-4 w-4" /> Pausar</>
                  )}
                </button>

                {/* Avançar */}
                <button
                  onClick={goToForm}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  Ir para o formulário
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {plano && (
              <p className="text-xs text-muted-foreground">
                Plano contratado: <span className="text-primary font-medium">{plano}</span>
              </p>
            )}
          </>
        )}

        {/* Status: timeout — formulário demorou mais de 5 minutos */}
        {status === "timeout" && (
          <>
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <AlertCircle className="h-10 w-10 text-yellow-400" />
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-white">
                Quase lá!
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Seu pagamento foi confirmado, mas o formulário está demorando um pouco mais do que o esperado.
                Me chame no WhatsApp e eu resolvo isso agora para você.
              </p>
            </div>
            <WhatsAppButton />
          </>
        )}

        {/* Status: erro — falha de conexão ou erro inesperado */}
        {status === "erro" && (
          <>
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="h-10 w-10 text-red-400" />
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-white">
                Algo deu errado
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Houve um problema ao preparar seu formulário. Não se preocupe — seu pagamento foi confirmado.
                Me chame no WhatsApp e eu resolvo isso agora para você.
              </p>
            </div>
            <WhatsAppButton />
          </>
        )}

      </div>
    </div>
  );
}
