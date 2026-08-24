import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  RODAPE_PLANO,
  type Linha,
  type Memoria,
  type Resultado,
  type Tom,
} from "@/lib/ferramentas/tipos";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";

const TOM: Record<string, { caixa: string; rotulo: string }> = {
  "is-good": { caixa: "border-green-500/30 bg-green-500/10", rotulo: "text-green-400" },
  "is-bad": { caixa: "border-red-500/30 bg-red-500/10", rotulo: "text-red-400" },
  "is-warn": { caixa: "border-amber-500/30 bg-amber-500/10", rotulo: "text-amber-400" },
  "": { caixa: "border-primary/30 bg-primary/10", rotulo: "text-primary" },
};

/** Número-herói: rótulo curto, valor grande e uma frase de explicação. */
export function Destaque({
  tom,
  rotulo,
  valor,
  frase,
}: {
  tom?: Tom;
  rotulo: string;
  valor: string;
  frase: string;
}) {
  const t = TOM[tom || ""] || TOM[""];
  return (
    <div className={cn("flex flex-col gap-1 rounded-2xl border p-5", t.caixa)}>
      <span className={cn("text-xs font-bold uppercase tracking-[0.12em]", t.rotulo)}>
        {rotulo}
      </span>
      <span className="text-[clamp(1.6rem,5vw,2.2rem)] font-extrabold leading-none tracking-tight tabular-nums text-white">
        {valor}
      </span>
      <span className="text-sm leading-snug text-card-foreground">{frase}</span>
    </div>
  );
}

export function Tabela({ linhas }: { linhas: Linha[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      {linhas.map((l, i) => (
        <div
          key={i}
          className={cn(
            "flex items-baseline justify-between gap-4 px-4 py-2.5 text-sm",
            i > 0 && "border-t border-white/10",
            l[2] === "hl" ? "bg-primary/10" : "bg-black/15",
          )}
        >
          <span className={cn("min-w-0", l[2] === "dim" ? "text-muted-foreground" : "text-muted-foreground")}>
            {l[0]}
          </span>
          <span
            className={cn(
              "whitespace-nowrap font-bold tabular-nums",
              l[2] === "hl" ? "text-primary" : l[2] === "dim" ? "text-muted-foreground" : "text-white",
            )}
          >
            {l[1]}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Ressalva honesta sobre o que o cálculo não considera. */
export function Nota({ children }: { children: React.ReactNode }) {
  return (
    <p className="border-l-2 border-primary/35 pl-3 text-[0.79rem] leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}

/**
 * Gatilho de assinatura em três tempos: valida a conta, mostra que a lacuna é de
 * execução (não de profundidade) e vende recorrência.
 */
export function GatilhoPlano({
  titulo,
  corpo,
  nivel,
  botao,
}: {
  titulo: string;
  corpo: string;
  nivel: string;
  botao: string;
}) {
  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-white/10 bg-black/20 p-5">
      <b className="text-sm font-bold text-white">{titulo}</b>
      <p className="text-[0.84rem] leading-relaxed text-muted-foreground">{corpo}</p>
      <p className="text-[0.84rem] leading-relaxed text-primary">{nivel}</p>
      <Link href="/planos">
        <Button
          variant="outline"
          className="mt-1 w-full border-primary text-primary hover:bg-primary/10"
        >
          {botao}
        </Button>
      </Link>
      <p className="text-center text-[0.68rem] text-muted-foreground">{RODAPE_PLANO}</p>
    </div>
  );
}

/** Saída completa de uma ferramenta declarativa. */
/**
 * Memória de cálculo. Fica fechada por padrão — quem só quer a resposta não
 * tropeça nela, e quem desconfia do número consegue conferir conta por conta.
 */
export function MemoriaCalculo({ memoria }: { memoria: Memoria }) {
  const { passos, serie } = memoria;
  if (!passos?.length && !serie?.linhas.length) return null;

  return (
    <details className="group overflow-hidden rounded-xl border border-white/10 bg-black/20">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 [&::-webkit-details-marker]:hidden">
        <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-90" />
        Ver a memória de cálculo
      </summary>

      <div className="flex flex-col gap-4 border-t border-white/10 px-4 py-4">
        {passos?.length ? (
          <div className="flex flex-col gap-3">
            {passos.map((p, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <span className="text-[0.78rem] font-semibold text-white">{p.rotulo}</span>
                <span className="font-mono text-[0.76rem] leading-relaxed text-muted-foreground">
                  {p.conta}
                </span>
                <span className="text-[0.82rem] font-bold tabular-nums text-primary">
                  = {p.valor}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        {serie?.linhas.length ? (
          <div className="flex flex-col gap-2">
            {serie.resumo ? (
              <p className="text-[0.75rem] italic text-muted-foreground">{serie.resumo}</p>
            ) : null}
            <div className="max-h-80 overflow-auto rounded-lg border border-white/10">
              <table className="w-full border-collapse text-[0.76rem]">
                <thead className="sticky top-0 bg-card">
                  <tr>
                    {serie.colunas.map((c, i) => (
                      <th
                        key={i}
                        className={cn(
                          "whitespace-nowrap border-b border-white/10 px-3 py-2 font-semibold text-muted-foreground",
                          i === 0 ? "text-left" : "text-right",
                        )}
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {serie.linhas.map((l, i) => (
                    <tr key={i} className="border-b border-white/5 last:border-0">
                      {l.map((v, j) => (
                        <td
                          key={j}
                          className={cn(
                            "whitespace-nowrap px-3 py-1.5 tabular-nums",
                            j === 0 ? "text-left text-muted-foreground" : "text-right text-white",
                          )}
                        >
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </details>
  );
}

export function PainelResultado({ r }: { r: Resultado }) {
  return (
    <div className="flex flex-col gap-4">
      <Destaque tom={r.tom} rotulo={r.k} valor={r.val} frase={r.sub} />
      <Tabela linhas={r.rows} />
      {r.memoria ? <MemoriaCalculo memoria={r.memoria} /> : null}
      <Nota>{r.nota}</Nota>
      <GatilhoPlano
        titulo={r.gat.titulo}
        corpo={r.gat.corpo}
        nivel={r.gat.nivel}
        botao={r.gat.botao}
      />
    </div>
  );
}
