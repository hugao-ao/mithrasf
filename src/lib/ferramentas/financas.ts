/**
 * Matemática financeira compartilhada pelas ferramentas gratuitas.
 * Todas as taxas circulam internamente como decimal ao mês.
 */

export type UnidJuro = "mes" | "ano";
export type UnidPrazo = "meses" | "anos";
export type ValorJuro = { n: number; u: UnidJuro };
export type ValorPrazo = { n: number; u: UnidPrazo };

/** Taxa do campo convertida para decimal ao mês. */
export const iMes = (f: ValorJuro): number => {
  const n = (f?.n || 0) / 100;
  return f?.u === "ano" ? Math.pow(1 + n, 1 / 12) - 1 : n;
};

/** Teto de 100 anos. Sem ele, um prazo absurdo digitado sem querer gera séries de
 *  milhões de pontos e trava a aba — o Oráculo chega a montar um gráfico com um
 *  ponto por mês. Nenhum planejamento pessoal precisa de mais que isso. */
export const MAX_MESES = 1200;

/** Prazo do campo convertido para meses inteiros, entre 1 e MAX_MESES. */
export const nMes = (f: ValorPrazo): number =>
  Math.min(MAX_MESES, Math.max(1, Math.round((f?.n || 0) * (f?.u === "anos" ? 12 : 1))));

/** Parcela fixa da Tabela Price. */
export const pmtPrice = (pv: number, i: number, n: number): number =>
  n <= 0 ? 0 : i <= 0 ? pv / n : (pv * i) / (1 - Math.pow(1 + i, -n));

/** Total de juros da Tabela SAC: i * pv * (n + 1) / 2. */
export const totJurosSac = (pv: number, i: number, n: number): number =>
  n <= 0 ? 0 : (i * pv * (n + 1)) / 2;

/** Montante de um valor inicial somado a aportes mensais constantes. */
export const fvSerie = (pv: number, pmt: number, i: number, n: number): number =>
  pv * Math.pow(1 + i, n) + (i <= 0 ? pmt * n : (pmt * (Math.pow(1 + i, n) - 1)) / i);

/**
 * Taxa mensal embutida num parcelamento, por bisseção.
 * Devolve 0 quando o total das parcelas não supera o preço à vista.
 */
export function taxaDeParcelas(pv: number, pmt: number, n: number): number {
  if (pv <= 0 || pmt <= 0 || n <= 0 || pmt * n <= pv) return 0;
  let lo = 0;
  let hi = 3;
  for (let k = 0; k < 160; k++) {
    const m = (lo + hi) / 2;
    const v = m <= 0 ? pmt * n : (pmt * (1 - Math.pow(1 + m, -n))) / m;
    if (v > pv) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

/** Alíquota regressiva de IR sobre o lucro, conforme o prazo em meses. */
export const aliqIR = (meses: number): number =>
  meses <= 6 ? 0.225 : meses <= 12 ? 0.2 : meses <= 24 ? 0.175 : 0.15;

/* ── IRPF: tabela progressiva anual ───────────────────────
   Vigente desde a Lei 15.270/2025. A tabela é 12x a mensal
   (isento até R$ 2.428,80/mês); o redutor é o que zera o imposto
   de quem ganha até R$ 60 mil por ano e some aos R$ 88.200. */

export const IRPF_ISENCAO_ANUAL = 60000;
export const IRPF_REDUTOR_TETO = 88200;

/** Faixas anuais: [teto da faixa, alíquota, parcela a deduzir]. */
export const IRPF_FAIXAS: Array<[number, number, number]> = [
  [29145.6, 0, 0],
  [33919.8, 0.075, 2185.92],
  [45012.6, 0.15, 4729.91],
  [55976.16, 0.225, 8105.85],
  [Infinity, 0.275, 10904.66],
];

/** Imposto pela tabela progressiva, antes do redutor. */
export const irpfTabela = (base: number): number => {
  if (base <= 0) return 0;
  const f = IRPF_FAIXAS.find(([teto]) => base <= teto) as [number, number, number];
  return Math.max(0, base * f[1] - f[2]);
};

/**
 * Redutor da Lei 15.270/2025, calculado sobre os rendimentos tributáveis
 * (não sobre a base). Devolve Infinity na faixa isenta, para o imposto zerar
 * por completo em vez de depender de a subtração dar negativo.
 */
export const irpfRedutor = (rendimentos: number): number => {
  if (rendimentos <= IRPF_ISENCAO_ANUAL) return Infinity;
  if (rendimentos >= IRPF_REDUTOR_TETO) return 0;
  return Math.max(0, 8429.73 - 0.095575 * rendimentos);
};

/**
 * Imposto anual devido. `base` separa-se de `rendimentos` porque deduções
 * (PGBL, saúde, dependentes) abatem a base, mas não mudam o redutor.
 */
export const irpfAnual = (rendimentos: number, base = rendimentos): number => {
  const red = irpfRedutor(rendimentos);
  if (!isFinite(red)) return 0;
  return Math.max(0, irpfTabela(base) - red);
};

/* ── Formatação ───────────────────────────────────────── */

export const BRL = (v: number, d = 2): string =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  }).format(isFinite(v) ? v : 0);

export const NUM = (v: number, d = 1): string =>
  new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: d,
  }).format(isFinite(v) ? v : 0);

/** Valor numérico para o texto exibido dentro de um campo de moeda. */
export const mascaraMoeda = (n: number): string =>
  "R$ " +
  (isFinite(n) ? n : 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

/**
 * Texto digitado num campo de moeda de volta para número (centavos).
 * Devolve null quando o campo está vazio, para distinguir "não preenchi"
 * de "preenchi com zero".
 */
export const lerMoeda = (s: string): number | null => {
  const d = String(s).replace(/\D/g, "").slice(0, 15);
  return d ? parseInt(d, 10) / 100 : null;
};
