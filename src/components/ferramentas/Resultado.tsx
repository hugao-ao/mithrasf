import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RODAPE_PLANO, type Linha, type Resultado, type Tom } from "@/lib/ferramentas/tipos";
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
export function PainelResultado({ r }: { r: Resultado }) {
  return (
    <div className="flex flex-col gap-4">
      <Destaque tom={r.tom} rotulo={r.k} valor={r.val} frase={r.sub} />
      <Tabela linhas={r.rows} />
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
