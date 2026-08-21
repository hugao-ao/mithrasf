import type { LucideIcon } from "lucide-react";
import type { ValorJuro, ValorPrazo, UnidJuro, UnidPrazo } from "./financas";

export type { ValorJuro, ValorPrazo, UnidJuro, UnidPrazo };

export type Campo =
  | { t: "money"; l: string; v: number; w?: boolean }
  | { t: "juro"; l: string; v: ValorJuro; w?: boolean }
  | { t: "prazo"; l: string; v: ValorPrazo; w?: boolean }
  | { t: "num"; l: string; v: number; suf?: string; w?: boolean }
  | { t: "sel"; l: string; v: string; opts: Array<[string, string]>; w?: boolean };

/** Valores correntes de um formulário, indexados pela chave do campo. */
export type Valores = Record<string, any>;

/**
 * Linha da tabela de detalhe: rótulo, valor e destaque opcional.
 * Tupla com terceiro item opcional — e não união de tuplas — para que ler
 * `linha[2]` continue válido quando o destaque não foi informado.
 */
export type Linha = [string, string, ("hl" | "dim")?];

export type Tom = "" | "is-good" | "is-bad" | "is-warn";

export type Gatilho = {
  /** Título do bloco — afirma o que a ferramenta entregou. */
  titulo: string;
  /** O que ela não faz: a lacuna é de execução, não de profundidade. */
  corpo: string;
  /** Menção discreta ao nível que resolve essa dor. */
  nivel: string;
  /** Texto do botão. */
  botao: string;
};

export type Resultado = {
  tom?: Tom;
  /** Rótulo curto acima do número-herói. */
  k: string;
  /** Número-herói. */
  val: string;
  /** Frase única que explica o resultado. */
  sub: string;
  rows: Linha[];
  /** Ressalva honesta sobre o que o cálculo não considera. */
  nota: string;
  gat: Gatilho;
};

export type Ferramenta = {
  id: string;
  slug: string;
  area: string;
  nome: string;
  /** Aparece no card ao passar o mouse. */
  desc: string;
  /** Aparece sob o título dentro da ferramenta. */
  como: string;
  icone: LucideIcon;
  nova?: boolean;
  campos?: Record<string, Campo>;
  /** Campos onde deixar em branco é resposta legítima — viram zero no cálculo. */
  opcionais?: string[];
  calc?: (v: Valores) => Resultado;
  /** Ferramentas com tela própria, fora do motor declarativo. */
  custom?: "fluxo" | "dividas" | "oraculo";
};

/* ── Construtores de campo ────────────────────────────── */

export const money = (l: string, v: number, w?: boolean): Campo => ({ t: "money", l, v, w });

export const juro = (l: string, n: number, u: UnidJuro = "ano", w?: boolean): Campo => ({
  t: "juro",
  l,
  v: { n, u },
  w,
});

export const prazo = (l: string, n: number, u: UnidPrazo = "anos", w?: boolean): Campo => ({
  t: "prazo",
  l,
  v: { n, u },
  w,
});

export const qtd = (l: string, v: number, suf?: string, w?: boolean): Campo => ({
  t: "num",
  l,
  v,
  suf: suf || "",
  w,
});

export const opt = (
  l: string,
  v: string,
  opts: Array<[string, string]>,
  w?: boolean,
): Campo => ({ t: "sel", l, v, opts, w });

/**
 * Estado inicial: tudo vazio. Os números declarados no catálogo não são
 * preenchimento — são só o exemplo que o botão "ver um exemplo" carrega.
 * Listas de opções continuam com a escolha padrão, porque um seletor sempre
 * precisa de um valor.
 */
export function valoresIniciais(campos: Record<string, Campo>): Valores {
  const v: Valores = {};
  for (const [k, c] of Object.entries(campos)) {
    if (c.t === "sel") v[k] = c.v;
    else if (c.t === "juro" || c.t === "prazo") v[k] = { n: null, u: (c.v as any).u };
    else v[k] = null;
  }
  return v;
}

/** Os valores de demonstração do catálogo, para o botão de exemplo. */
export function valoresExemplo(campos: Record<string, Campo>): Valores {
  const v: Valores = {};
  for (const [k, c] of Object.entries(campos)) {
    v[k] = c.t === "juro" || c.t === "prazo" ? { ...(c.v as object) } : c.v;
  }
  return v;
}

const vazio = (c: Campo, valor: any): boolean => {
  if (c.t === "sel") return false;
  if (c.t === "juro" || c.t === "prazo") return valor?.n === null || valor?.n === undefined;
  return valor === null || valor === undefined;
};

/** Só calcula quando todo campo obrigatório foi preenchido. */
export function estaPronto(
  campos: Record<string, Campo>,
  valores: Valores,
  opcionais: string[] = [],
): boolean {
  return Object.entries(campos).every(
    ([k, c]) => opcionais.includes(k) || !vazio(c, valores[k]),
  );
}

/** Quantos campos obrigatórios ainda faltam. */
export function faltando(
  campos: Record<string, Campo>,
  valores: Valores,
  opcionais: string[] = [],
): number {
  return Object.entries(campos).filter(
    ([k, c]) => !opcionais.includes(k) && vazio(c, valores[k]),
  ).length;
}

/** Troca os vazios por zero antes de entregar ao cálculo. */
export function paraCalculo(campos: Record<string, Campo>, valores: Valores): Valores {
  const v: Valores = {};
  for (const [k, c] of Object.entries(campos)) {
    const atual = valores[k];
    if (c.t === "sel") v[k] = atual;
    else if (c.t === "juro" || c.t === "prazo") v[k] = { n: atual?.n ?? 0, u: atual?.u };
    else v[k] = atual ?? 0;
  }
  return v;
}

/** Rodapé fixo do gatilho, repetido em todas as ferramentas. */
export const RODAPE_PLANO =
  "Reunião e WhatsApp ilimitados em todos os níveis · a partir de R$ 29,90/mês";
