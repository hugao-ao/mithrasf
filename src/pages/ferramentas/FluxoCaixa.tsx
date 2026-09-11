import { CampoMoeda, Seg, classeCaixa, classeEntrada } from "@/components/ferramentas/Campos";
import { CascaFerramenta } from "@/components/ferramentas/CascaFerramenta";
import {
  Destaque,
  GatilhoPlano,
  MemoriaCalculo,
  Nota,
  Tabela,
} from "@/components/ferramentas/Resultado";
import { Button } from "@/components/ui/button";
import { BRL, NUM } from "@/lib/ferramentas/financas";
import type { Ferramenta, Tom } from "@/lib/ferramentas/tipos";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useState } from "react";

type Freq = "mes" | "ano";
type Item = { d: string; v: number | null; f: Freq };

const ETAPAS = [
  {
    n: "Etapa 1 de 4",
    h: "Tudo que entra",
    p: "Salário, bicos, aluguel recebido, 13º, bônus. Marque se é por mês ou por ano.",
    key: "rendas" as const,
  },
  {
    n: "Etapa 2 de 4",
    h: "Tudo que você guarda",
    p: "Investimento, poupança, previdência. Também pode ser por mês ou por ano.",
    key: "guarda" as const,
  },
  {
    n: "Etapa 3 de 4",
    h: "Tudo que sai",
    p: "Adicione à vontade: contas, mercado, transporte, lazer, assinaturas, IPTU, IPVA.",
    key: "gastos" as const,
  },
];

/** Abre com uma linha em branco em cada etapa, pronta para receber o primeiro lançamento. */
const vazio = () => ({
  rendas: [{ d: "", v: null, f: "mes" as Freq }],
  guarda: [{ d: "", v: null, f: "mes" as Freq }],
  gastos: [{ d: "", v: null, f: "mes" as Freq }],
});

/** Carregado pelo botão "ver um exemplo". */
const EXEMPLO = {
  rendas: [
    { d: "Salário", v: 4500, f: "mes" as Freq },
    { d: "13º salário", v: 4500, f: "ano" as Freq },
  ],
  guarda: [{ d: "Investimento mensal", v: 300, f: "mes" as Freq }],
  gastos: [
    { d: "Aluguel", v: 1500, f: "mes" as Freq },
    { d: "Mercado", v: 900, f: "mes" as Freq },
    { d: "Luz, água e internet", v: 420, f: "mes" as Freq },
    { d: "Transporte", v: 380, f: "mes" as Freq },
    { d: "Assinaturas e lazer", v: 340, f: "mes" as Freq },
    { d: "IPTU", v: 1200, f: "ano" as Freq },
  ],
};

const porMes = (a: Item[]) =>
  a.reduce((t, x) => t + ((x.v ?? 0) / (x.f === "ano" ? 12 : 1)), 0);

export default function FluxoCaixa({ f }: { f: Ferramenta }) {
  const [etapa, setEtapa] = useState(0);
  const [listas, setListas] = useState<Record<string, Item[]>>(vazio);

  const mudar = (key: string, i: number, patch: Partial<Item>) =>
    setListas((L) => ({
      ...L,
      [key]: L[key].map((x, k) => (k === i ? { ...x, ...patch } : x)),
    }));
  const remover = (key: string, i: number) =>
    setListas((L) => ({ ...L, [key]: L[key].filter((_, k) => k !== i) }));
  const adicionar = (key: string) =>
    setListas((L) => ({ ...L, [key]: [...L[key], { d: "", v: 0, f: "mes" }] }));

  const barra = (
    <div className="flex gap-1.5">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={cn("h-[3px] flex-1 rounded-sm", i <= etapa ? "bg-primary" : "bg-white/10")}
        />
      ))}
    </div>
  );

  /* ── Etapas de lançamento: nenhum total aparece aqui, de propósito ── */
  if (etapa < 3) {
    const e = ETAPAS[etapa];
    const itens = listas[e.key];
    return (
      <CascaFerramenta f={f}>
        {barra}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{e.n}</span>
          <h2 className="text-lg font-bold text-white">{e.h}</h2>
          <p className="text-sm text-muted-foreground">{e.p}</p>
        </div>

        <div className="flex flex-col gap-2">
          {itens.length === 0 && (
            <p className="py-2 text-sm italic text-muted-foreground">Nada lançado ainda.</p>
          )}
          {itens.map((it, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <div className={cn(classeCaixa, "min-w-0 flex-1 basis-32")}>
                <input
                  type="text"
                  className={cn(classeEntrada, "pr-2")}
                  placeholder="Do que se trata"
                  value={it.d}
                  onChange={(ev) => mudar(e.key, i, { d: ev.target.value })}
                />
              </div>
              <div className="min-w-0 flex-1 basis-28">
                <CampoMoeda valor={it.v} onChange={(n) => mudar(e.key, i, { v: n })} />
              </div>
              <Seg
                valor={it.f}
                opcoes={[
                  ["mes", "mês"],
                  ["ano", "ano"],
                ]}
                onChange={(u) => mudar(e.key, i, { f: u as Freq })}
              />
              <button
                type="button"
                onClick={() => remover(e.key, i)}
                aria-label="Remover lançamento"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 text-muted-foreground transition-colors hover:border-red-500/40 hover:text-red-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => adicionar(e.key)}
            className="w-full rounded-lg border border-dashed border-primary/35 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            + Adicionar
          </button>
        </div>

        <div className="flex gap-3">
          {etapa > 0 && (
            <Button variant="outline" onClick={() => setEtapa(etapa - 1)}>
              Voltar
            </Button>
          )}
          <Button
            className="flex-1 bg-primary font-bold text-primary-foreground hover:bg-primary/90"
            onClick={() => setEtapa(etapa + 1)}
          >
            {etapa === 2 ? "Ver meu resultado" : "Continuar"}
          </Button>
        </div>

        {etapa === 0 && (
          <button
            type="button"
            onClick={() => {
              setListas({
                rendas: [...EXEMPLO.rendas],
                guarda: [...EXEMPLO.guarda],
                gastos: [...EXEMPLO.gastos],
              });
              setEtapa(3);
            }}
            className="-mt-1 w-fit text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Ver um exemplo preenchido
          </button>
        )}
      </CascaFerramenta>
    );
  }

  /* ── Resultado ─────────────────────────────────────────────────────
     Sobra e falta são os dois lados do mesmo descontrole. O que o cliente
     guarda já foi lançado na etapa 2 — então sobra aqui nunca é poupança,
     é gasto que passou sem registro. */
  const R = porMes(listas.rendas);
  const G = porMes(listas.guarda);
  const D = porMes(listas.gastos);

  /* Sem renda lançada não há percentual de descontrole a calcular. */
  if (R <= 0) {
    return (
      <CascaFerramenta f={f}>
        {barra}
        <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-white/15 bg-black/20 p-5">
          <p className="text-sm text-muted-foreground">
            Você ainda não lançou nada que entra. Volte à primeira etapa e informe pelo menos uma
            renda.
          </p>
          <Button variant="outline" onClick={() => setEtapa(0)}>
            Voltar para as rendas
          </Button>
        </div>
      </CascaFerramenta>
    );
  }

  const saldo = R - G - D;
  const pct = (Math.abs(saldo) / R) * 100;

  let tom: Tom;
  let rotulo: string;
  let frase: string;

  if (saldo < 0 && pct > 20) {
    tom = "is-bad";
    rotulo = "Falta todo mês";
    frase = `Você gasta ${NUM(pct)}% a mais do que ganha. Em um ano isso vira ${BRL(Math.abs(saldo) * 12, 0)} de buraco. Não é descuido de fim de mês — é a estrutura do orçamento que não fecha.`;
  } else if (saldo < 0 && pct > 5) {
    tom = "is-bad";
    rotulo = "Falta todo mês";
    frase = `São ${NUM(pct)}% da sua renda faltando por mês. Dá para fechar cortando gastos, mas só se você souber quais — e é aí que quase todo mundo trava.`;
  } else if (saldo < 0) {
    tom = "is-warn";
    rotulo = "Falta todo mês";
    frase = `Faltam ${NUM(pct)}% da renda. É pouco, e por isso perigoso: qualquer imprevisto vira dívida no cartão.`;
  } else if (pct <= 3) {
    tom = "is-good";
    rotulo = "Seu retrato bate";
    frase = `A diferença é de só ${NUM(pct)}% da renda, dentro do erro esperado. Você sabe para onde vai o seu dinheiro — e isso é mais raro do que parece.`;
  } else if (pct <= 10) {
    tom = "is-warn";
    rotulo = "Some sem você saber para onde";
    frase = `${BRL(saldo, 0)} por mês não foram explicados — ${NUM(pct)}% da renda. Isso não é dinheiro guardado: o que você guarda já foi lançado na etapa 2. É gasto que passou sem registro.`;
  } else if (pct <= 25) {
    tom = "is-bad";
    rotulo = "Some sem você saber para onde";
    frase = `${BRL(saldo, 0)} saem todo mês sem destino conhecido — ${NUM(pct)}% de tudo que você ganha, ou ${BRL(saldo * 12, 0)} por ano. Se esse dinheiro estivesse mesmo parado na conta, você já teria percebido.`;
  } else {
    tom = "is-bad";
    rotulo = "Some sem você saber para onde";
    frase = `Mais de um quarto da sua renda sumiu do mapa: ${BRL(saldo, 0)} por mês, ${BRL(saldo * 12, 0)} por ano. O que você guarda já está lançado, então isso é gasto puro que você não registrou. Um orçamento com esse furo não serve para decidir nada.`;
  }

  const gatilho =
    saldo < 0
      ? {
          titulo: "O mapa está pronto. Executar é que é o problema.",
          corpo:
            "Cortar gasto é fácil de listar e difícil de manter. O que muda o resultado é ter alguém revisando com você mês a mês.",
          botao: "Quero acompanhamento, não mais um relatório",
        }
      : pct <= 3
        ? {
            titulo: "Seu retrato bate. E agora?",
            corpo:
              "Saber para onde vai o dinheiro é o começo. Decidir o que fazer com ele — reserva, quitar dívida, objetivo, investimento — é uma decisão nova todo mês.",
            botao: "Quero decidir isso com alguém junto",
          }
        : {
            titulo: "O furo apareceu. Fechar ele é outra coisa.",
            corpo:
              "Achar dinheiro que some exige rastrear os gastos por algumas semanas e alguém olhando junto para enxergar o padrão. Sozinho, quase ninguém acha.",
            botao: "Quero descobrir para onde vai esse dinheiro",
          };

  return (
    <CascaFerramenta f={f}>
      {barra}
      <Destaque tom={tom} rotulo={rotulo} valor={BRL(Math.abs(saldo))} frase={frase} />
      <Tabela
        linhas={[
          ["Entra por mês", BRL(R)],
          ["Você guarda", BRL(G)],
          ["Sai por mês, registrado", BRL(D)],
          [
            saldo < 0 ? "Falta para fechar" : pct <= 3 ? "Diferença" : "Não explicado",
            BRL(Math.abs(saldo)),
            "hl",
          ],
        ]}
      />
      <MemoriaCalculo
        memoria={{
          passos: [
            {
              rotulo: "Tudo que entra, trazido para o mês",
              conta: listas.rendas
                .filter((x) => (x.v ?? 0) > 0)
                .map((x) => `${x.d || "sem nome"} ${BRL(x.v ?? 0)}${x.f === "ano" ? " ÷ 12" : ""}`)
                .join("  +  ") || "nada lançado",
              valor: BRL(R),
            },
            {
              rotulo: "Tudo que você guarda, trazido para o mês",
              conta: listas.guarda
                .filter((x) => (x.v ?? 0) > 0)
                .map((x) => `${x.d || "sem nome"} ${BRL(x.v ?? 0)}${x.f === "ano" ? " ÷ 12" : ""}`)
                .join("  +  ") || "nada lançado",
              valor: BRL(G),
            },
            {
              rotulo: "Tudo que sai, trazido para o mês",
              conta: listas.gastos
                .filter((x) => (x.v ?? 0) > 0)
                .map((x) => `${x.d || "sem nome"} ${BRL(x.v ?? 0)}${x.f === "ano" ? " ÷ 12" : ""}`)
                .join("  +  ") || "nada lançado",
              valor: BRL(D),
            },
            {
              rotulo: saldo < 0 ? "O que falta para fechar" : "O que não foi explicado",
              conta: `${BRL(R)} − ${BRL(G)} − ${BRL(D)}`,
              valor: BRL(saldo),
            },
            {
              rotulo: "Isso representa, da sua renda",
              conta: `${BRL(Math.abs(saldo))} ÷ ${BRL(R)}`,
              valor: NUM(pct, 1) + "%",
            },
          ],
        }}
      />
      <Nota>
        {saldo > 0 && pct > 3
          ? "Num raio-X bem feito não existe sobra: o que você poupa já foi lançado na etapa 2. Quando o resultado dá positivo, quase sempre é gasto que não foi registrado — cartão, aplicativo, assinatura, dinheiro solto. Lançamentos anuais como 13º, IPTU e IPVA foram divididos por 12."
          : "Lançamentos anuais como 13º, IPTU e IPVA foram divididos por 12 para caber no mês. É por isso que o resultado costuma ser pior do que a conta de cabeça."}
      </Nota>
      <GatilhoPlano
        titulo={gatilho.titulo}
        corpo={gatilho.corpo}
        nivel="WhatsApp ilimitado desde o Nível I; reunião a partir do Nível II."
        botao={gatilho.botao}
      />
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={() => setEtapa(2)}>
          Revisar lançamentos
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setListas(vazio());
            setEtapa(0);
          }}
        >
          Refazer do zero
        </Button>
      </div>
    </CascaFerramenta>
  );
}
