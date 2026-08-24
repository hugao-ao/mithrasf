import { CampoMoeda, Seg, classeCaixa, classeEntrada } from "@/components/ferramentas/Campos";
import { CascaFerramenta } from "@/components/ferramentas/CascaFerramenta";
import { Grafico } from "@/components/ferramentas/Grafico";
import {
  Destaque,
  GatilhoPlano,
  MemoriaCalculo,
  Nota,
  Tabela,
} from "@/components/ferramentas/Resultado";
import {
  BRL,
  fvSerie,
  iMes,
  NUM,
  nMes,
  type ValorJuro,
  type ValorPrazo,
} from "@/lib/ferramentas/financas";
import type { Ferramenta } from "@/lib/ferramentas/tipos";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useMemo, useState } from "react";

type Recorrencia = "unica" | "anual" | "mensal";
type Objetivo = { d: string; v: number | null; q: { n: number | null; u: ValorPrazo["u"] }; rec: Recorrencia };

/** Carregado pelo botão "ver um exemplo". */
const EXEMPLO = {
  pat: 40000,
  ap: 800,
  r: { n: 10, u: "ano" as ValorJuro["u"] },
  pz: { n: 25, u: "anos" as ValorPrazo["u"] },
  obj: [
    { d: "Trocar de carro", v: 60000, q: { n: 5, u: "anos" as ValorPrazo["u"] }, rec: "unica" as Recorrencia },
    { d: "Faculdade do filho", v: 24000, q: { n: 10, u: "anos" as ValorPrazo["u"] }, rec: "anual" as Recorrencia },
  ],
};

/** Renda mensal estimada de um patrimônio, a 0,4% ao mês sem tocar no principal. */
const TAXA_RENDA = 0.004;

export default function Oraculo({ f }: { f: Ferramenta }) {
  const [pat, setPat] = useState<number | null>(null);
  const [ap, setAp] = useState<number | null>(null);
  const [r, setR] = useState<{ n: number | null; u: ValorJuro["u"] }>({ n: null, u: "ano" });
  const [pz, setPz] = useState<{ n: number | null; u: ValorPrazo["u"] }>({ n: null, u: "anos" });
  const [obj, setObj] = useState<Objetivo[]>([]);

  const mudarObj = (i: number, patch: Partial<Objetivo>) =>
    setObj((L) => L.map((o, k) => (k === i ? { ...o, ...patch } : o)));
  const removerObj = (i: number) => setObj((L) => L.filter((_, k) => k !== i));
  const adicionarObj = () =>
    setObj((L) => [...L, { d: "", v: null, q: { n: null, u: "anos" }, rec: "unica" }]);

  const carregarExemplo = () => {
    setPat(EXEMPLO.pat);
    setAp(EXEMPLO.ap);
    setR({ ...EXEMPLO.r });
    setPz({ ...EXEMPLO.pz });
    setObj(EXEMPLO.obj.map((o) => ({ ...o, q: { ...o.q } })));
  };

  /* Precisa de rendimento e prazo para existir curva; patrimônio e aporte podem
     ser um ou o outro, mas não os dois em branco. */
  const pronto = r.n !== null && pz.n !== null && (pat !== null || ap !== null);

  const sim = useMemo(() => {
    const i = iMes({ n: r.n ?? 0, u: r.u });
    const n = nMes({ n: pz.n ?? 0, u: pz.u });
    const p0 = pat ?? 0;
    const aporte = ap ?? 0;
    const serie: number[] = [p0];
    const marcas: number[] = [];
    let s = p0;
    for (const o of obj) marcas.push(nMes({ n: o.q.n ?? 0, u: o.q.u }));
    for (let m = 1; m <= n; m++) {
      s = s * (1 + i) + aporte;
      for (const o of obj) {
        const a = nMes({ n: o.q.n ?? 0, u: o.q.u });
        const valor = o.v ?? 0;
        if (o.rec === "unica" && m === a) s -= valor;
        else if (o.rec === "anual" && m >= a && (m - a) % 12 === 0) s -= valor;
        else if (o.rec === "mensal" && m >= a) s -= valor;
      }
      serie.push(s);
    }
    return { serie, marcas, fim: s, n, i, p0, aporte };
  }, [pat, ap, r, pz, obj]);

  const semObj = fvSerie(sim.p0, sim.aporte, sim.i, sim.n);
  const renda = Math.max(sim.fim, 0) * TAXA_RENDA;
  const depositado = sim.p0 + sim.aporte * sim.n;
  const quebrou = sim.serie.findIndex((v) => v < 0);
  const acabou = sim.fim < 0;

  return (
    <CascaFerramenta f={f}>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-1.5">
          <label className="text-[0.8rem] font-medium text-muted-foreground">
            Quanto já tem investido
          </label>
          <CampoMoeda valor={pat} onChange={setPat} />
        </div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <label className="text-[0.8rem] font-medium text-muted-foreground">
            Quanto guarda por mês
          </label>
          <CampoMoeda valor={ap} onChange={setAp} />
        </div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <label className="text-[0.8rem] font-medium text-muted-foreground">Rendimento</label>
          <div className={classeCaixa}>
            <input
              type="number"
              step="any"
              className={classeEntrada}
              value={r.n ?? ""}
              onChange={(e) => setR({ n: e.target.value === "" ? null : parseFloat(e.target.value) || 0, u: r.u })}
            />
            <span className="shrink-0 pr-1 text-sm text-muted-foreground">%</span>
            <Seg
              valor={r.u}
              opcoes={[
                ["mes", "ao mês"],
                ["ano", "ao ano"],
              ]}
              onChange={(u) => setR({ n: r.n, u: u as "mes" | "ano" })}
            />
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <label className="text-[0.8rem] font-medium text-muted-foreground">
            Por quanto tempo
          </label>
          <div className={classeCaixa}>
            <input
              type="number"
              step="any"
              className={classeEntrada}
              value={pz.n ?? ""}
              onChange={(e) => setPz({ n: e.target.value === "" ? null : parseFloat(e.target.value) || 0, u: pz.u })}
            />
            <Seg
              valor={pz.u}
              opcoes={[
                ["meses", "meses"],
                ["anos", "anos"],
              ]}
              onChange={(u) => setPz({ n: pz.n, u: u as "meses" | "anos" })}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[0.8rem] font-medium text-muted-foreground">
          Seus objetivos — cada um saca dinheiro da curva
        </label>
        {obj.length === 0 && (
          <p className="py-2 text-sm italic text-muted-foreground">
            Nenhum objetivo. A curva sobe sem interrupção.
          </p>
        )}
        {obj.map((o, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2">
            <div className={cn(classeCaixa, "min-w-0 flex-1 basis-32")}>
              <input
                type="text"
                className={cn(classeEntrada, "pr-2")}
                placeholder="Nome do objetivo"
                value={o.d}
                onChange={(e) => mudarObj(i, { d: e.target.value })}
              />
            </div>
            <div className="min-w-0 flex-1 basis-28">
              <CampoMoeda valor={o.v} onChange={(n) => mudarObj(i, { v: n })} />
            </div>
            <div className={cn(classeCaixa, "min-w-0 flex-1 basis-28")}>
              <span className="shrink-0 text-xs text-muted-foreground">em</span>
              <input
                type="number"
                step="any"
                className={classeEntrada}
                value={o.q.n ?? ""}
                onChange={(e) =>
                  mudarObj(i, { q: { n: e.target.value === "" ? null : parseFloat(e.target.value) || 0, u: o.q.u } })
                }
              />
              <Seg
                valor={o.q.u}
                opcoes={[
                  ["meses", "m"],
                  ["anos", "a"],
                ]}
                onChange={(u) => mudarObj(i, { q: { n: o.q.n, u: u as "meses" | "anos" } })}
              />
            </div>
            <div className={cn(classeCaixa, "min-w-0 flex-1 basis-28")}>
              <select
                className={cn(classeEntrada, "cursor-pointer pr-2")}
                value={o.rec}
                onChange={(e) => mudarObj(i, { rec: e.target.value as Recorrencia })}
              >
                <option value="unica" className="bg-card">
                  Uma vez
                </option>
                <option value="anual" className="bg-card">
                  Todo ano
                </option>
                <option value="mensal" className="bg-card">
                  Todo mês
                </option>
              </select>
            </div>
            <button
              type="button"
              onClick={() => removerObj(i)}
              aria-label="Remover objetivo"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 text-muted-foreground transition-colors hover:border-red-500/40 hover:text-red-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={adicionarObj}
          className="w-full rounded-lg border border-dashed border-primary/35 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
        >
          + Adicionar objetivo
        </button>
      </div>

      {!pronto ? (
        <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-white/15 bg-black/20 p-5">
          <p className="text-sm text-muted-foreground">
            Informe o rendimento, por quanto tempo, e quanto você já tem ou guarda por mês.
          </p>
          <button
            type="button"
            onClick={carregarExemplo}
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Ver um exemplo preenchido
          </button>
        </div>
      ) : (
      <div className="flex flex-col gap-4">
        <Destaque
          tom={acabou ? "is-bad" : "is-good"}
          rotulo={acabou ? "Seu dinheiro acaba antes do fim" : "Você chega em"}
          valor={acabou ? "no mês " + quebrou : BRL(sim.fim, 0)}
          frase={
            acabou
              ? `Os objetivos que você encaixou sacam mais do que a curva consegue repor. Sem eles, você chegaria a ${BRL(semObj, 0)}.`
              : `Isso vira cerca de ${BRL(renda, 0)} por mês de renda sem encostar no principal. Seus objetivos custaram ${BRL(semObj - sim.fim, 0)} do patrimônio final.`
          }
        />
        <Grafico serie={sim.serie} marcas={sim.marcas} />
        <Tabela
          linhas={[
            ["Você depositou", BRL(depositado, 0)],
            ["Sem nenhum objetivo, chegaria a", BRL(semObj, 0), "dim"],
            ["Com seus objetivos", BRL(sim.fim, 0), "hl"],
            ["Renda mensal disso", BRL(renda, 0)],
          ]}
        />
        <MemoriaCalculo
          memoria={{
            passos: [
              {
                rotulo: "Rendimento convertido para o mês",
                conta:
                  r.u === "ano"
                    ? `(1 + ${NUM(r.n ?? 0, 2)}%)^(1/12) − 1`
                    : `${NUM(r.n ?? 0, 2)}% já é mensal`,
                valor: NUM(sim.i * 100, 4) + "% ao mês",
              },
              {
                rotulo: "Prazo em meses",
                conta:
                  pz.u === "anos" ? `${NUM(pz.n ?? 0, 0)} anos × 12` : `${NUM(pz.n ?? 0, 0)} meses`,
                valor: `${sim.n} meses`,
              },
              {
                rotulo: "Quanto você deposita ao todo",
                conta: `${BRL(sim.p0, 0)} que já tem + ${BRL(sim.aporte)} × ${sim.n} meses`,
                valor: BRL(depositado, 0),
              },
              {
                rotulo: "Onde chegaria sem nenhum objetivo",
                conta: `${BRL(sim.p0, 0)} rendendo, mais ${BRL(sim.aporte)} por mês, durante ${sim.n} meses`,
                valor: BRL(semObj, 0),
              },
              ...obj
                .filter((o) => (o.v ?? 0) > 0)
                .map((o) => ({
                  rotulo: `Objetivo: ${o.d || "sem nome"}`,
                  conta: `${BRL(o.v ?? 0, 0)} ${
                    o.rec === "unica"
                      ? `uma vez, no mês ${nMes({ n: o.q.n ?? 0, u: o.q.u })}`
                      : o.rec === "anual"
                        ? `todo ano, a partir do mês ${nMes({ n: o.q.n ?? 0, u: o.q.u })}`
                        : `todo mês, a partir do mês ${nMes({ n: o.q.n ?? 0, u: o.q.u })}`
                  }`,
                  valor: "sai da curva",
                })),
              {
                rotulo: "Quanto os objetivos custaram do patrimônio final",
                conta: `${BRL(semObj, 0)} − ${BRL(sim.fim, 0)}`,
                valor: BRL(semObj - sim.fim, 0),
              },
              {
                rotulo: "Renda mensal sem encostar no principal",
                conta: `${BRL(Math.max(sim.fim, 0), 0)} × 0,4% ao mês`,
                valor: BRL(renda, 0),
              },
            ],
            serie: {
              colunas: ["Mês", "Rendeu", "Depositou", "Saiu para objetivos", "Patrimônio"],
              linhas: sim.serie
                .map((valor, m) => {
                  if (m === 0) return null;
                  const anterior = sim.serie[m - 1];
                  const rend = anterior * sim.i;
                  const saques = obj.reduce((t, o) => {
                    const a = nMes({ n: o.q.n ?? 0, u: o.q.u });
                    const val = o.v ?? 0;
                    if (o.rec === "unica" && m === a) return t + val;
                    if (o.rec === "anual" && m >= a && (m - a) % 12 === 0) return t + val;
                    if (o.rec === "mensal" && m >= a) return t + val;
                    return t;
                  }, 0);
                  return [
                    String(m),
                    BRL(rend, 0),
                    BRL(sim.aporte, 0),
                    saques > 0 ? "− " + BRL(saques, 0) : "—",
                    BRL(valor, 0),
                  ];
                })
                .filter((l): l is string[] => l !== null)
                .filter((_, i, arr) => i < 12 || (i + 1) % 12 === 0 || i === arr.length - 1),
              resumo:
                sim.n > 60
                  ? `Série de ${sim.n} meses resumida: os 12 primeiros, depois um mês por ano, e o último.`
                  : undefined,
            },
          }}
        />
        <Nota>
          Não descontei inflação nem imposto. Daqui a {NUM(sim.n / 12, 0)} anos esse valor compra
          menos do que compra hoje — some algo entre 4% e 5% ao ano de perda de poder de compra.
        </Nota>
        <GatilhoPlano
          titulo="A projeção está pronta. As premissas é que precisam de conferência."
          corpo="Essa rentabilidade você consegue de verdade no seu perfil? O valor por mês é sustentável ou é o que você gostaria de guardar?"
          nivel="Traga a projeção para a reunião — conferimos junto e ajustamos."
          botao="Quero validar isso com um especialista"
        />
      </div>
      )}
    </CascaFerramenta>
  );
}
