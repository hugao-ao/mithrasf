import { CampoMoeda, Seg, classeCaixa, classeEntrada } from "@/components/ferramentas/Campos";
import { CascaFerramenta } from "@/components/ferramentas/CascaFerramenta";
import {
  Destaque,
  GatilhoPlano,
  MemoriaCalculo,
  Nota,
  Tabela,
} from "@/components/ferramentas/Resultado";
import { BRL, iMes, NUM, taxaDeParcelas, type ValorJuro } from "@/lib/ferramentas/financas";
import type { Ferramenta, Linha } from "@/lib/ferramentas/tipos";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useState } from "react";

/** Quando a pessoa não sabe a taxa, ela vem das parcelas. */
type Divida = {
  d: string;
  s: number | null;
  modo: "sabe" | "nao";
  j: { n: number | null; u: ValorJuro["u"] };
  pv: number | null;
  np: number | null;
  pc: number | null;
};

const novaDivida = (): Divida => ({
  d: "",
  s: null,
  modo: "sabe",
  j: { n: null, u: "mes" },
  pv: null,
  np: null,
  pc: null,
});

/** Carregado pelo botão "ver um exemplo". */
const EXEMPLO: Divida[] = [
  { d: "Cartão de crédito", s: 3200, modo: "sabe", j: { n: 14, u: "mes" }, pv: 0, np: 0, pc: 0 },
  {
    d: "Empréstimo do banco",
    s: 9000,
    modo: "nao",
    j: { n: 3.2, u: "mes" },
    pv: 12000,
    np: 36,
    pc: 520,
  },
  { d: "Crediário da loja", s: 1500, modo: "sabe", j: { n: 7.5, u: "mes" }, pv: 0, np: 0, pc: 0 },
];

const taxaDe = (x: Divida) =>
  x.modo === "sabe"
    ? iMes({ n: x.j.n ?? 0, u: x.j.u })
    : taxaDeParcelas(x.pv ?? 0, x.pc ?? 0, x.np ?? 0);

export default function QualDivida({ f }: { f: Ferramenta }) {
  const [itens, setItens] = useState<Divida[]>(() => [novaDivida()]);

  const mudar = (i: number, patch: Partial<Divida>) =>
    setItens((L) => L.map((x, k) => (k === i ? { ...x, ...patch } : x)));
  const remover = (i: number) => setItens((L) => L.filter((_, k) => k !== i));
  const adicionar = () => setItens((L) => [...L, novaDivida()]);

  const calc = itens
    .filter((x) => (x.s ?? 0) > 0)
    .map((x) => {
      const taxa = taxaDe(x);
      return { ...x, taxa, custo: (x.s ?? 0) * taxa };
    })
    .sort((a, b) => b.custo - a.custo);

  const total = calc.reduce((t, x) => t + x.custo, 0);
  const top = calc[0];

  const linhas: Linha[] = calc.map(
    (x, i) =>
      [
        (x.d || "Sem nome") + " · " + NUM(x.taxa * 100, 2) + "% ao mês",
        BRL(x.custo) + " / mês",
        i === 0 ? "hl" : "dim",
      ] as Linha,
  );
  linhas.push(["Você paga de juros, por mês", BRL(total), "dim"]);

  return (
    <CascaFerramenta f={f}>
      <div className="flex flex-col gap-3">
        {itens.length === 0 && (
          <p className="py-2 text-sm italic text-muted-foreground">Nenhuma dívida lançada.</p>
        )}

        {itens.map((x, i) => (
          <div
            key={i}
            className="flex flex-col gap-2.5 rounded-xl border border-white/10 bg-black/15 p-3"
          >
            <div className="flex flex-wrap items-center gap-2">
              <div className={cn(classeCaixa, "min-w-0 flex-1 basis-32")}>
                <input
                  type="text"
                  className={cn(classeEntrada, "pr-2")}
                  placeholder="Nome da dívida"
                  value={x.d}
                  onChange={(e) => mudar(i, { d: e.target.value })}
                />
              </div>
              <div className="min-w-0 flex-1 basis-28">
                <CampoMoeda valor={x.s} onChange={(n) => mudar(i, { s: n })} />
              </div>
              <button
                type="button"
                onClick={() => remover(i)}
                aria-label="Remover dívida"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 text-muted-foreground transition-colors hover:border-red-500/40 hover:text-red-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <Seg
              valor={x.modo}
              opcoes={[
                ["sabe", "Sei os juros"],
                ["nao", "Descobrir pelas parcelas"],
              ]}
              onChange={(u) => mudar(i, { modo: u as "sabe" | "nao" })}
              className="w-fit"
            />

            {x.modo === "sabe" ? (
              <div className={classeCaixa}>
                <input
                  type="number"
                  step="any"
                  className={classeEntrada}
                  value={x.j.n ?? ""}
                  onChange={(e) =>
                    mudar(i, { j: { n: e.target.value === "" ? null : parseFloat(e.target.value) || 0, u: x.j.u } })
                  }
                />
                <span className="shrink-0 pr-1 text-sm text-muted-foreground">%</span>
                <Seg
                  valor={x.j.u}
                  opcoes={[
                    ["mes", "ao mês"],
                    ["ano", "ao ano"],
                  ]}
                  onChange={(u) => mudar(i, { j: { n: x.j.n, u: u as "mes" | "ano" } })}
                />
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex min-w-0 flex-1 basis-28 items-center gap-1.5">
                  <span className="shrink-0 text-xs text-muted-foreground">pegou</span>
                  <div className="min-w-0 flex-1">
                    <CampoMoeda valor={x.pv} onChange={(n) => mudar(i, { pv: n })} />
                  </div>
                </div>
                <div className={cn(classeCaixa, "min-w-0 flex-1 basis-20")}>
                  <input
                    type="number"
                    step="1"
                    className={classeEntrada}
                    value={x.np ?? ""}
                    onChange={(e) => mudar(i, { np: e.target.value === "" ? null : parseInt(e.target.value, 10) || 0 })}
                  />
                  <span className="shrink-0 pr-1 text-xs text-muted-foreground">x de</span>
                </div>
                <div className="min-w-0 flex-1 basis-28">
                  <CampoMoeda valor={x.pc} onChange={(n) => mudar(i, { pc: n })} />
                </div>
                <span className="basis-full text-right text-xs font-semibold text-primary">
                  = {NUM(taxaDeParcelas(x.pv ?? 0, x.pc ?? 0, x.np ?? 0) * 100, 2)}% ao mês
                </span>
              </div>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={adicionar}
          className="w-full rounded-lg border border-dashed border-primary/35 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
        >
          + Adicionar dívida
        </button>
      </div>

      {top ? (
        <div className="flex flex-col gap-4">
          <Destaque
            tom="is-bad"
            rotulo="Ataque primeiro"
            valor={top.d || "Dívida sem nome"}
            frase={`Ela sozinha te custa ${BRL(top.custo)} por mês só de juros — ${NUM(total > 0 ? (top.custo / total) * 100 : 0, 0)}% de tudo que você paga de juros. Quitar essa primeiro economiza mais do que quitar a maior.`}
          />
          <Tabela linhas={linhas} />
          <MemoriaCalculo
            memoria={{
              passos: calc.map((x) => ({
                rotulo: (x.d || "Dívida sem nome") + " — quanto os juros custam por mês",
                conta:
                  x.modo === "sabe"
                    ? `${BRL(x.s ?? 0)} × ${NUM(x.taxa * 100, 2)}% ao mês`
                    : `taxa descoberta de ${BRL(x.pv ?? 0)} em ${x.np ?? 0}× de ${BRL(x.pc ?? 0)} = ${NUM(x.taxa * 100, 2)}% ao mês, aplicada sobre ${BRL(x.s ?? 0)}`,
                valor: BRL(x.custo) + " por mês",
              })),
              serie: {
                colunas: ["Dívida", "Você deve", "Taxa ao mês", "Juros por mês", "Juros por ano"],
                linhas: calc.map((x) => [
                  x.d || "sem nome",
                  BRL(x.s ?? 0),
                  NUM(x.taxa * 100, 2) + "%",
                  BRL(x.custo),
                  BRL(x.custo * 12),
                ]),
                resumo: "Ordenadas pelo que mais custa por mês — é essa a ordem de ataque.",
              },
            }}
          />
          <Nota>
            A maior dívida nem sempre é a pior. O que dói é a taxa, não o tamanho. Se você não sabe
            a taxa, informe quanto pegou, em quantas vezes e o valor da parcela — a conta sai
            sozinha.
          </Nota>
          <GatilhoPlano
            titulo="A ordem está clara. Sair da dívida é que não é só ordem."
            corpo="Tem renegociação para fazer, portabilidade para avaliar e proposta de banco para conferir — cada uma com uma pegadinha diferente."
            nivel="A partir do Nível III, a gente entra na conversa com o banco junto com você."
            botao="Quero ajuda para negociar isso"
          />
        </div>
      ) : (
        <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-white/15 bg-black/20 p-5">
          <p className="text-sm text-muted-foreground">
            Informe o valor que você ainda deve em pelo menos uma dívida para ver o resultado.
          </p>
          <button
            type="button"
            onClick={() => setItens(EXEMPLO.map((x) => ({ ...x, j: { ...x.j } })))}
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Ver um exemplo preenchido
          </button>
        </div>
      )}
    </CascaFerramenta>
  );
}
