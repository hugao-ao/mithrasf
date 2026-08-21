import { cn } from "@/lib/utils";
import { lerMoeda, mascaraMoeda } from "@/lib/ferramentas/financas";
import type { Campo, Valores } from "@/lib/ferramentas/tipos";

/** Alternador de unidade — meses/anos, ao mês/ao ano, e afins. */
export function Seg({
  valor,
  opcoes,
  onChange,
  className,
}: {
  valor: string;
  opcoes: Array<[string, string]>;
  onChange: (u: string) => void;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 overflow-hidden rounded-md border border-white/10",
        className,
      )}
    >
      {opcoes.map(([u, rotulo]) => (
        <button
          key={u}
          type="button"
          onClick={() => onChange(u)}
          className={cn(
            "whitespace-nowrap px-2 py-1 text-[0.68rem] font-bold transition-colors",
            "border-l border-white/10 first:border-l-0",
            u === valor
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-white",
          )}
        >
          {rotulo}
        </button>
      ))}
    </span>
  );
}

const caixa =
  "flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/25 pl-3 pr-1 transition-colors focus-within:border-primary/40";
const entrada =
  "min-w-0 flex-1 bg-transparent py-2.5 text-[0.95rem] font-semibold tabular-nums text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

/** Campo de moeda com máscara viva: o texto é sempre R$ 000.000,00. */
export function CampoMoeda({
  valor,
  onChange,
  id,
}: {
  valor: number;
  onChange: (n: number) => void;
  id?: string;
}) {
  return (
    <div className={caixa}>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        className={cn(entrada, "pr-2")}
        value={mascaraMoeda(valor)}
        onChange={(e) => {
          /* `currentTarget` é anulado depois do handler; `target` sobrevive. */
          const el = e.target as HTMLInputElement;
          onChange(lerMoeda(el.value));
          requestAnimationFrame(() => {
            const fim = el.value.length;
            try {
              el.setSelectionRange(fim, fim);
            } catch {
              /* o input pode já ter perdido o foco */
            }
          });
        }}
      />
    </div>
  );
}

/** Renderiza um campo qualquer do catálogo e devolve o novo valor. */
export function CampoDinamico({
  chave,
  campo,
  valores,
  onChange,
}: {
  chave: string;
  campo: Campo;
  valores: Valores;
  onChange: (chave: string, valor: any) => void;
}) {
  const id = `campo-${chave}`;
  const v = valores[chave];

  let controle: React.ReactNode;

  if (campo.t === "money") {
    controle = <CampoMoeda id={id} valor={v as number} onChange={(n) => onChange(chave, n)} />;
  } else if (campo.t === "juro") {
    controle = (
      <div className={caixa}>
        <input
          id={id}
          type="number"
          step="any"
          className={entrada}
          value={v.n}
          onChange={(e) => onChange(chave, { n: parseFloat(e.target.value || "0") || 0, u: v.u })}
        />
        <span className="shrink-0 pr-1 text-sm text-muted-foreground">%</span>
        <Seg
          valor={v.u}
          opcoes={[
            ["mes", "ao mês"],
            ["ano", "ao ano"],
          ]}
          onChange={(u) => onChange(chave, { n: v.n, u })}
        />
      </div>
    );
  } else if (campo.t === "prazo") {
    controle = (
      <div className={caixa}>
        <input
          id={id}
          type="number"
          step="any"
          className={entrada}
          value={v.n}
          onChange={(e) => onChange(chave, { n: parseFloat(e.target.value || "0") || 0, u: v.u })}
        />
        <Seg
          valor={v.u}
          opcoes={[
            ["meses", "meses"],
            ["anos", "anos"],
          ]}
          onChange={(u) => onChange(chave, { n: v.n, u })}
        />
      </div>
    );
  } else if (campo.t === "sel") {
    controle = (
      <div className={caixa}>
        <select
          id={id}
          className={cn(entrada, "cursor-pointer pr-2")}
          value={v as string}
          onChange={(e) => onChange(chave, e.target.value)}
        >
          {campo.opts.map(([val, rotulo]) => (
            <option key={val} value={val} className="bg-card text-white">
              {rotulo}
            </option>
          ))}
        </select>
      </div>
    );
  } else {
    controle = (
      <div className={caixa}>
        <input
          id={id}
          type="number"
          step="any"
          className={entrada}
          value={v as number}
          onChange={(e) => onChange(chave, parseFloat(e.target.value || "0") || 0)}
        />
        {campo.suf ? (
          <span className="shrink-0 pr-2 text-sm text-muted-foreground">{campo.suf}</span>
        ) : null}
      </div>
    );
  }

  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", campo.w && "sm:col-span-2")}>
      <label htmlFor={id} className="text-[0.8rem] font-medium leading-snug text-muted-foreground">
        {campo.l}
      </label>
      {controle}
    </div>
  );
}

export { caixa as classeCaixa, entrada as classeEntrada };
