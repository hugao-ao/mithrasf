import ContratoTexto from "@/components/ContratoTexto";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BENEFICIOS_COMUNS, PLANOS, linkWhatsapp, type Nivel } from "@/lib/planos";
import { BookOpen, Check, Clock, Handshake, MessageCircle, Shield, Star, Target } from "lucide-react";
import { Link } from "wouter";

const ICONE: Record<Nivel, typeof Target> = {
  I: Target,
  II: Clock,
  III: Star,
  IV: Handshake,
  V: Shield,
};

export default function Planos() {
  return (
    <div className="space-y-16 pb-20">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Escolha o Nível da Sua <span className="gold-gradient-text">Evolução</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Você paga todo mês e usa quando precisa. O que muda de um nível para o outro é o
          quanto a gente entra entre você e o mercado.
          <br />
          <span className="text-primary font-medium">
            Não é necessário fazer o Diagnóstico para assinar os planos mensais.
          </span>
        </p>
      </div>

      {/* O que todos incluem */}
      <div className="bg-card/40 border border-white/5 rounded-2xl p-6">
        <h2 className="text-white font-bold mb-4 flex items-center gap-2">
          <Check className="h-5 w-5 text-primary" /> Em todos os cinco níveis
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFICIOS_COMUNS.map((b, i) => (
            <li key={i} className="flex gap-2 text-sm text-muted-foreground">
              <span className="text-primary shrink-0">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {PLANOS.map((plan) => {
          const Icone = ICONE[plan.nivel];
          const temCheckout = Boolean(plan.checkoutUrl);
          return (
            <div
              key={plan.nivel}
              className={`relative flex flex-col p-5 rounded-2xl transition-all duration-300 hover:-translate-y-2 ${
                plan.premium
                  ? "bg-gradient-to-b from-primary/20 to-background border-2 border-primary/50 shadow-[0_0_30px_rgba(212,175,55,0.15)]"
                  : plan.destaque
                    ? "bg-card/80 border border-primary/30 shadow-lg"
                    : "bg-card/40 border border-white/5 hover:border-primary/20"
              }`}
            >
              {plan.destaque && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[0.65rem] font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                  MAIS POPULAR
                </div>
              )}

              {plan.premium && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary via-yellow-400 to-primary text-black text-[0.65rem] font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                  MÁXIMO
                </div>
              )}

              <div className="mb-5 space-y-2">
                <div
                  className={`h-11 w-11 rounded-xl flex items-center justify-center mb-3 ${
                    plan.premium ? "bg-primary text-black" : "bg-primary/10 text-primary"
                  }`}
                >
                  <Icone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground">
                    {plan.nome}
                  </p>
                  <h3 className="text-lg font-bold text-white">{plan.apelido}</h3>
                </div>
                <p className="text-xs text-primary italic min-h-[32px]">{plan.promessa}</p>
              </div>

              <div className="mb-5">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-muted-foreground">R$</span>
                  <span
                    className={`text-3xl font-bold ${plan.premium ? "gold-gradient-text" : "text-white"}`}
                  >
                    {plan.preco}
                  </span>
                  <span className="text-muted-foreground text-sm">/mês</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6 flex-1">
                {plan.destaques.map((feature, i) => (
                  <li key={i} className="flex gap-2 text-xs text-muted-foreground">
                    <Check
                      className={`h-4 w-4 shrink-0 ${plan.premium ? "text-primary" : "text-primary/70"}`}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="space-y-2 mt-auto">
                {temCheckout ? (
                  <Button
                    className={`w-full font-bold h-11 text-sm ${
                      plan.premium
                        ? "bg-primary text-black hover:bg-primary/90 shadow-lg shadow-primary/20"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                    onClick={() => {
                      window.location.href = `/aceite-contrato?plano=${encodeURIComponent(plan.nome)}`;
                    }}
                  >
                    Assinar Agora
                  </Button>
                ) : (
                  /* Sem checkout com este preço ainda. Mandar para um checkout de
                     outro valor cobraria errado — melhor conversar. */
                  <Button
                    className={`w-full font-bold h-11 text-sm ${
                      plan.premium
                        ? "bg-primary text-black hover:bg-primary/90 shadow-lg shadow-primary/20"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                    onClick={() => {
                      window.location.href = linkWhatsapp(
                        `Oi Hugo. Quero assinar o ${plan.nome} — ${plan.apelido}.`,
                      );
                    }}
                  >
                    <MessageCircle className="h-4 w-4 mr-1.5" /> Falar para assinar
                  </Button>
                )}

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full text-[0.7rem] text-muted-foreground hover:text-primary h-8"
                    >
                      Ver detalhes e regras
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-primary/20 text-white sm:max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold text-primary flex items-center gap-2">
                        <Icone className="h-5 w-5" /> {plan.nome} · {plan.apelido}
                      </DialogTitle>
                      <DialogDescription className="text-muted-foreground">
                        {plan.descricao}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                      {/* Quadro do nível */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {[
                          ["WhatsApp responde em até", plan.slaWhatsapp],
                          ["Reunião pedida por você", plan.reuniao],
                          ["Cotação", plan.cotacao],
                          ["Reunião com especialista", plan.especialista],
                        ].map(([rot, val]) => (
                          <div key={rot} className="bg-black/20 p-2 rounded">
                            <span className="text-muted-foreground block text-[0.65rem]">{rot}</span>
                            <span className="font-bold text-white">{val}</span>
                          </div>
                        ))}
                        <div className="bg-black/20 p-2 rounded col-span-2">
                          <span className="text-muted-foreground block text-[0.65rem]">
                            Quem alimenta o sistema
                          </span>
                          <span className="font-bold text-white">{plan.alimenta}</span>
                        </div>
                      </div>

                      {/* Escopo */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary font-semibold">
                          <div className="p-1 bg-primary/10 rounded">🎯</div>
                          <h3>O que está incluso</h3>
                        </div>
                        <div className="bg-white/5 p-3 rounded-lg border border-white/10 text-sm">
                          <ul className="space-y-2">
                            {plan.escopo.map((item, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="text-primary">•</span>
                                <span className="text-muted-foreground text-xs">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Vedações */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-red-400 font-semibold">
                          <div className="p-1 bg-red-500/10 rounded">⛔</div>
                          <h3>O que não está</h3>
                        </div>
                        <div className="bg-red-500/5 p-3 rounded-lg border border-red-500/20">
                          <p className="text-xs text-muted-foreground">{plan.naoIncluso}</p>
                        </div>
                      </div>

                      {/* Contrato completo */}
                      <div className="pt-2 border-t border-white/10">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="link" className="text-xs text-primary p-0 h-auto">
                              Consultar contrato completo
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-card border-primary/20 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>
                                Contrato de Prestação de Serviços de Saúde Financeira —{" "}
                                {plan.nome}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="pr-2">
                              <ContratoTexto plano={plan} />
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          );
        })}
      </div>

      {/* Banner Planejamento de Referência */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">
              Tem um Planejamento Financeiro de Referência?
            </h3>
            <p className="text-muted-foreground text-sm mt-1 max-w-xl">
              É o documento que define a estratégia de cada objetivo seu e organiza a sua vida
              financeira em 18 partes. Ele é contratado à parte — e, tendo um, a revisão dele
              não custa nada enquanto você mantiver um plano mensal.
            </p>
          </div>
        </div>
        <Link href="/planejamento-de-referencia">
          <Button className="bg-primary text-black hover:bg-primary/90 font-bold shrink-0 whitespace-nowrap">
            Conhecer o Planejamento &rarr;
          </Button>
        </Link>
      </div>
    </div>
  );
}
