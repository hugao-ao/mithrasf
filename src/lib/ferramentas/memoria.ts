import {
  aliqIR,
  IRPF_ISENCAO_ANUAL,
  irpfAnual,
  BRL,
  iMes,
  NUM,
  nMes,
  pmtPrice,
  taxaDeParcelas,
  totJurosSac,
} from "./financas";
import type { Memoria, Serie, Valores } from "./tipos";

/**
 * Séries longas ficam ilegíveis inteiras. Mostra os doze primeiros meses,
 * depois um por ano, e sempre o último — que é onde o resultado aparece.
 */
function amostrar(linhas: string[][], total: number): Serie["resumo"] | undefined {
  return total > 60
    ? `Série de ${total} meses resumida: os 12 primeiros, depois um mês por ano, e o último.`
    : undefined;
}

function filtrarMeses<T>(itens: T[]): { item: T; i: number }[] {
  const n = itens.length;
  if (n <= 60) return itens.map((item, i) => ({ item, i }));
  return itens
    .map((item, i) => ({ item, i }))
    .filter(({ i }) => i < 12 || (i + 1) % 12 === 0 || i === n - 1);
}

const pct = (x: number) => NUM(x * 100, 4) + "%";

/**
 * Memória de cálculo por ferramenta. Fica separada do catálogo de propósito:
 * o catálogo responde "quanto dá", isto responde "como chegou lá".
 */
export const MEMORIAS: Record<string, (v: Valores) => Memoria> = {
  /* ── Orçamento ─────────────────────────────────────── */
  precos: (v) => {
    const ua = v.qa > 0 ? v.pa / v.qa : 0;
    const ub = v.qb > 0 ? v.pb / v.qb : 0;
    const maior = Math.max(ua, ub);
    return {
      passos: [
        {
          rotulo: "Preço por unidade da embalagem A",
          conta: `${BRL(v.pa)} ÷ ${NUM(v.qa, 2)}`,
          valor: BRL(ua, 4),
        },
        {
          rotulo: "Preço por unidade da embalagem B",
          conta: `${BRL(v.pb)} ÷ ${NUM(v.qb, 2)}`,
          valor: BRL(ub, 4),
        },
        {
          rotulo: "Quanto a mais barata economiza",
          conta: `(${BRL(maior, 4)} − ${BRL(Math.min(ua, ub), 4)}) ÷ ${BRL(maior, 4)}`,
          valor: NUM(maior > 0 ? (Math.abs(ua - ub) / maior) * 100 : 0, 1) + "%",
        },
      ],
    };
  },

  /* ── Dívidas ───────────────────────────────────────── */
  juros: (v) => {
    const i = taxaDeParcelas(v.av, v.pc, v.n);
    const total = v.pc * v.n;
    const linhas: string[][] = [];
    let saldo = v.av;
    for (let m = 1; m <= v.n; m++) {
      const j = saldo * i;
      const amort = v.pc - j;
      saldo = saldo - amort;
      linhas.push([
        String(m),
        BRL(v.pc),
        BRL(j),
        BRL(amort),
        BRL(Math.max(saldo, 0)),
      ]);
    }
    return {
      passos: [
        {
          rotulo: "Total que você vai pagar parcelado",
          conta: `${BRL(v.pc)} × ${v.n}`,
          valor: BRL(total),
        },
        {
          rotulo: "Quanto a mais do que o preço à vista",
          conta: `${BRL(total)} − ${BRL(v.av)}`,
          valor: BRL(total - v.av),
        },
        {
          rotulo: "Taxa que faz as parcelas valerem o preço à vista hoje",
          conta: `procura o juro em que ${BRL(v.pc)} × ${v.n} parcelas descontadas = ${BRL(v.av)}`,
          valor: pct(i) + " ao mês",
        },
        {
          rotulo: "A mesma taxa ao ano",
          conta: `(1 + ${NUM(i, 6)})^12 − 1`,
          valor: NUM((Math.pow(1 + i, 12) - 1) * 100, 2) + "%",
        },
      ],
      serie: {
        colunas: ["Mês", "Parcela", "Juros", "Abate da dívida", "Saldo devedor"],
        linhas: filtrarMeses(linhas).map((x) => x.item),
        resumo: amostrar(linhas, v.n),
      },
    };
  },

  parcela: (v) => {
    const i = iMes(v.j);
    const n = nMes(v.pz);
    const price = v.sis === "price";
    const pp = pmtPrice(v.pv, i, n);
    const am = v.pv / n;
    const linhas: string[][] = [];
    let saldo = v.pv;
    for (let m = 1; m <= n; m++) {
      const juros = saldo * i;
      const parcela = price ? pp : am + juros;
      const amort = parcela - juros;
      saldo -= amort;
      linhas.push([String(m), BRL(parcela), BRL(juros), BRL(amort), BRL(Math.max(saldo, 0))]);
    }
    const passos = [
      {
        rotulo: "Juros convertidos para o mês",
        conta:
          v.j.u === "ano"
            ? `(1 + ${NUM(v.j.n, 2)}%)^(1/12) − 1`
            : `${NUM(v.j.n, 2)}% já é mensal`,
        valor: pct(i) + " ao mês",
      },
      {
        rotulo: "Prazo em meses",
        conta: v.pz.u === "anos" ? `${NUM(v.pz.n, 0)} anos × 12` : `${NUM(v.pz.n, 0)} meses`,
        valor: `${n} meses`,
      },
      price
        ? {
            rotulo: "Parcela fixa (Tabela Price)",
            conta: `${BRL(v.pv)} × ${NUM(i, 6)} ÷ (1 − (1 + ${NUM(i, 6)})^−${n})`,
            valor: BRL(pp),
          }
        : {
            rotulo: "Primeira parcela (Tabela SAC)",
            conta: `${BRL(am)} de amortização + ${BRL(v.pv)} × ${NUM(i, 6)} de juros`,
            valor: BRL(am + v.pv * i),
          },
      {
        rotulo: "Total de juros no contrato",
        conta: price
          ? `${BRL(pp)} × ${n} − ${BRL(v.pv)}`
          : `${NUM(i, 6)} × ${BRL(v.pv)} × (${n} + 1) ÷ 2`,
        valor: BRL(price ? pp * n - v.pv : totJurosSac(v.pv, i, n)),
      },
    ];
    if (v.of > 0) {
      const iReal = taxaDeParcelas(v.pv, v.of, n);
      passos.push({
        rotulo: "Taxa real embutida na proposta que te ofereceram",
        conta: `procura o juro em que ${BRL(v.of)} × ${n} parcelas descontadas = ${BRL(v.pv)}`,
        valor: pct(iReal) + " ao mês",
      });
    }
    return {
      passos,
      serie: {
        colunas: ["Mês", "Parcela", "Juros", "Amortização", "Saldo devedor"],
        linhas: filtrarMeses(linhas).map((x) => x.item),
        resumo: amostrar(linhas, n),
      },
    };
  },

  avista: (v) => {
    const i = iMes(v.r);
    const linhas: string[][] = [];
    let s = v.av;
    for (let m = 1; m <= v.n; m++) {
      const rend = s * i;
      s = s + rend - v.pc;
      linhas.push([String(m), BRL(rend), BRL(v.pc), BRL(s)]);
    }
    return {
      passos: [
        {
          rotulo: "Rendimento convertido para o mês",
          conta: `(1 + ${NUM(v.r.n, 2)}%)^(1/12) − 1`,
          valor: pct(i) + " ao mês",
        },
        {
          rotulo: "Total das parcelas",
          conta: `${BRL(v.pc)} × ${v.n}`,
          valor: BRL(v.pc * v.n),
        },
        {
          rotulo: "O que sobra do dinheiro investido no fim",
          conta: `${BRL(v.av)} rendendo ${pct(i)} ao mês, menos ${BRL(v.pc)} por mês`,
          valor: BRL(s),
        },
      ],
      serie: {
        colunas: ["Mês", "Rendeu", "Pagou de parcela", "Sobra investida"],
        linhas: filtrarMeses(linhas).map((x) => x.item),
        resumo: amostrar(linhas, v.n),
      },
    };
  },

  /* ── Casa e crédito ────────────────────────────────── */
  imobiliario: (v) => {
    const n = nMes(v.pz);
    const i = iMes(v.j);
    const pp = pmtPrice(v.pv, i, n);
    const am = v.pv / n;
    const linhas: string[][] = [];
    let sSac = v.pv;
    for (let m = 1; m <= n; m++) {
      const jSac = sSac * i;
      const pSac = am + jSac;
      sSac -= am;
      linhas.push([String(m), BRL(pSac), BRL(pp), BRL(pSac - pp)]);
    }
    return {
      passos: [
        {
          rotulo: "Juros convertidos para o mês",
          conta: `(1 + ${NUM(v.j.n, 2)}%)^(1/12) − 1`,
          valor: pct(i) + " ao mês",
        },
        {
          rotulo: "Parcela fixa da Price",
          conta: `${BRL(v.pv)} × ${NUM(i, 6)} ÷ (1 − (1 + ${NUM(i, 6)})^−${n})`,
          valor: BRL(pp),
        },
        {
          rotulo: "Amortização mensal do SAC",
          conta: `${BRL(v.pv)} ÷ ${n}`,
          valor: BRL(am),
        },
        {
          rotulo: "Total pago na Price",
          conta: `${BRL(pp)} × ${n}`,
          valor: BRL(pp * n),
        },
        {
          rotulo: "Total pago no SAC",
          conta: `${BRL(v.pv)} + ${NUM(i, 6)} × ${BRL(v.pv)} × (${n} + 1) ÷ 2`,
          valor: BRL(v.pv + totJurosSac(v.pv, i, n)),
        },
      ],
      serie: {
        colunas: ["Mês", "Parcela SAC", "Parcela Price", "Diferença"],
        linhas: filtrarMeses(linhas).map((x) => x.item),
        resumo: amostrar(linhas, n),
      },
    };
  },

  casatotal: (v) => {
    const ent = (v.pr * v.ent) / 100;
    const itbi = v.pr * 0.02;
    const cart = v.pr * 0.015;
    return {
      passos: [
        { rotulo: "Entrada", conta: `${BRL(v.pr)} × ${NUM(v.ent, 1)}%`, valor: BRL(ent, 2) },
        { rotulo: "ITBI", conta: `${BRL(v.pr)} × 2%`, valor: BRL(itbi, 2) },
        { rotulo: "Cartório e registro", conta: `${BRL(v.pr)} × 1,5%`, valor: BRL(cart, 2) },
        {
          rotulo: "Total que você precisa ter",
          conta: `${BRL(ent)} + ${BRL(itbi)} + ${BRL(cart)} + ${BRL(v.mv)}`,
          valor: BRL(ent + itbi + cart + v.mv, 2),
        },
      ],
    };
  },

  consorcio: (v) => {
    const ent = v.ent || 0;
    const price = v.sis === "price";
    const fin = Math.max(0, v.pr - ent);
    const nF = nMes(v.pz);
    const nC = nMes(v.pzc);
    const iF = iMes({ n: v.j.n + (v.tr || 0), u: v.j.u });
    const iR = iMes(v.rend);

    const parcelas: number[] = [];
    let p = (v.pr * (1 + v.tx / 100)) / nC;
    for (let m = 0; m < nC; m++) {
      if (m > 0 && m % 12 === 0) p *= 1 + (v.rj || 0) / 100;
      parcelas.push(p);
    }
    const restante: number[] = new Array(nC + 1).fill(0);
    for (let m = nC - 1; m >= 0; m--) restante[m] = restante[m + 1] + parcelas[m];

    /* A série mostra a corrida: de um lado o que falta do consórcio caindo,
       do outro o dinheiro rendendo. O cruzamento é onde ele se encerra. */
    const linhas: string[][] = [];
    let inv = ent;
    let pago = 0;
    let mesQuita = nC;
    let sobra = 0;
    const amF = fin / nF;
    let saldoF = fin;
    /* Para antes da quitação: depois dela o consórcio não existe mais, e
       continuar a série daria a impressão de que ele segue correndo. */
    for (let m = 1; m <= nC; m++) {
      inv *= 1 + iR;
      pago += parcelas[m - 1];
      let pFinM = 0;
      if (m <= nF) {
        pFinM = price ? pmtPrice(fin, iF, nF) : amF + saldoF * iF;
        if (!price) saldoF -= amF;
      }
      linhas.push([
        String(m),
        BRL(parcelas[m - 1]),
        m <= nF ? BRL(pFinM) : "—",
        BRL(restante[m]),
        BRL(inv),
      ]);
      if (inv >= restante[m]) {
        mesQuita = m;
        sobra = inv - restante[m];
        break;
      }
    }
    const totCons = parcelas.reduce((a, b) => a + b, 0);
    const netCons = ent + pago - sobra;

    return {
      passos: [
        {
          rotulo: "Financiamento: quanto entra no contrato",
          conta: `${BRL(v.pr)} do bem − ${BRL(ent)} de entrada`,
          valor: BRL(fin, 2),
        },
        {
          rotulo: "Juros do financiamento no mês, já com a TR",
          conta: `(1 + ${NUM(v.j.n + (v.tr || 0), 2)}%)^(1/12) − 1`,
          valor: pct(iF) + " ao mês",
        },
        {
          rotulo: "Consórcio: a carta é o bem inteiro",
          conta: `${BRL(v.pr)} × (1 + ${NUM(v.tx, 1)}% de taxa de administração)`,
          valor: BRL(v.pr * (1 + v.tx / 100), 2),
        },
        {
          rotulo: "Primeira parcela do consórcio",
          conta: `${BRL(v.pr * (1 + v.tx / 100))} ÷ ${nC}`,
          valor: BRL(parcelas[0]),
        },
        {
          rotulo: "Total do consórcio se for até o fim",
          conta: `soma das ${nC} parcelas, reajustadas ${NUM(v.rj || 0, 1)}% a cada 12 meses`,
          valor: BRL(totCons, 2),
        },
        {
          rotulo: "Rendimento do seu dinheiro no mês",
          conta: `(1 + ${NUM(v.rend.n, 2)}%)^(1/12) − 1`,
          valor: pct(iR) + " ao mês",
        },
        {
          rotulo:
            mesQuita < nC
              ? "Mês em que o dinheiro passa a cobrir o que falta"
              : "O dinheiro não alcança o saldo antes do fim",
          conta:
            mesQuita < nC
              ? `no mês ${mesQuita} o investido (${BRL(inv)}) alcançou os ${BRL(restante[mesQuita])} que faltavam`
              : `as ${nC} parcelas quitam o consórcio sozinhas, e o investido (${BRL(inv)}) fica todo com você`,
          valor: `mês ${mesQuita}`,
        },
        {
          rotulo: "Custo final do consórcio para você",
          conta: `${BRL(ent)} que você tinha + ${BRL(pago)} pago em parcelas − ${BRL(sobra)} que sobrou do investimento`,
          valor: BRL(netCons, 2),
        },
      ],
      serie: {
        colunas: [
          "Mês",
          "Parcela consórcio",
          "Parcela financiamento",
          "Falta do consórcio",
          "Seu dinheiro rendendo",
        ],
        linhas: filtrarMeses(linhas).map((x) => x.item),
        resumo:
          mesQuita < nC
            ? `Série até o mês ${mesQuita}, quando o consórcio é encerrado. ${amostrar(linhas, linhas.length) || ""}`.trim()
            : amostrar(linhas, linhas.length),
      },
    };
  },

  alugar: (v) => {
    const n = nMes(v.pz);
    const i = iMes({ n: v.j.n + (v.tr || 0), u: v.j.u });
    const ri = iMes(v.r);
    const fin = Math.max(v.pr - v.ent, 0);
    const pP = pmtPrice(fin, i, n);
    const amS = fin / n;
    const pS1 = amS + fin * i;
    const pC0 = (v.pr * (1 + v.tx / 100)) / n;
    const ano = (k: number) => Math.floor(k / 12);
    const alK = (k: number) => v.al * Math.pow(1 + (v.rjal || 0) / 100, ano(k));
    const coK = (k: number) => pC0 * Math.pow(1 + (v.rjco || 0) / 100, ano(k));
    const orc = Math.max(pP, pS1, pC0 + v.al, v.al);
    const linhas: string[][] = [];
    for (let k = 0; k < n; k++) {
      if (k % 12 === 0 || k === n - 1) {
        linhas.push([
          `ano ${ano(k) + 1}`,
          BRL(alK(k)),
          BRL(coK(k)),
          BRL(v.pr * Math.pow(1 + v.vz / 100, k / 12)),
        ]);
      }
    }
    return {
      passos: [
        {
          rotulo: "Quanto sobra para financiar",
          conta: `${BRL(v.pr)} − ${BRL(v.ent)}`,
          valor: BRL(fin, 2),
        },
        {
          rotulo: "Parcela fixa do financiamento",
          conta: `${BRL(fin)} × ${NUM(i, 6)} ÷ (1 − (1 + ${NUM(i, 6)})^−${n})`,
          valor: BRL(pP),
        },
        {
          rotulo: "Primeira parcela do consórcio",
          conta: `${BRL(v.pr)} × (1 + ${NUM(v.tx, 1)}%) ÷ ${n}`,
          valor: BRL(pC0),
        },
        {
          rotulo: "Orçamento mensal usado em todos os caminhos",
          conta: "a maior primeira parcela entre os cinco caminhos",
          valor: BRL(orc),
        },
        {
          rotulo: "Quanto o imóvel valeria no fim",
          conta: `${BRL(v.pr)} × (1 + ${NUM(v.vz, 1)}%)^${NUM(n / 12, 1)}`,
          valor: BRL(v.pr * Math.pow(1 + v.vz / 100, n / 12), 2),
        },
      ],
      serie: {
        colunas: ["Período", "Aluguel", "Parcela consórcio", "Valor do imóvel"],
        linhas,
        resumo: "Um ponto por ano. Cada caminho investe o que sobrar do orçamento mensal.",
      },
    };
  },

  /* ── Carro e bens ──────────────────────────────────── */
  carro: (v) => {
    const an = (v.sg + v.ip + v.mn) / 12;
    return {
      passos: [
        {
          rotulo: "Gastos anuais trazidos para o mês",
          conta: `(${BRL(v.sg)} + ${BRL(v.ip)} + ${BRL(v.mn)}) ÷ 12`,
          valor: BRL(an),
        },
        {
          rotulo: "Custo real por mês",
          conta: `${BRL(v.pc)} de parcela + ${BRL(v.cb)} de combustível + ${BRL(an)}`,
          valor: BRL(v.pc + v.cb + an),
        },
        {
          rotulo: "Custo real por ano",
          conta: `${BRL(v.pc + v.cb + an)} × 12`,
          valor: BRL((v.pc + v.cb + an) * 12, 2),
        },
      ],
    };
  },

  cartoes: (v) => {
    const anual = v.g * 12;
    const usd = v.dol > 0 ? anual / v.dol : 0;
    const cash = (c: number) => (anual * c) / 100;
    const milhas = (p: number) => ((usd * p) / 1000) * v.ml;
    return {
      passos: [
        { rotulo: "Gasto no ano", conta: `${BRL(v.g)} × 12`, valor: BRL(anual) },
        {
          rotulo: "Equivalente em dólares",
          conta: `${BRL(anual)} ÷ ${BRL(v.dol)}`,
          valor: "US$ " + NUM(usd, 0),
        },
        {
          rotulo: "Cartão A — sobra no ano",
          conta: `${BRL(cash(v.c1))} de cashback + ${BRL(milhas(v.p1))} de milhas − ${BRL(v.a1)} de anuidade`,
          valor: BRL(cash(v.c1) + milhas(v.p1) - v.a1, 2),
        },
        {
          rotulo: "Cartão B — sobra no ano",
          conta: `${BRL(cash(v.c2))} de cashback + ${BRL(milhas(v.p2))} de milhas − ${BRL(v.a2)} de anuidade`,
          valor: BRL(cash(v.c2) + milhas(v.p2) - v.a2, 2),
        },
      ],
    };
  },

  /* ── Proteção ──────────────────────────────────────── */
  reserva: (v) => {
    const meses = v.t === "pj" ? 12 : v.t === "pub" ? 3 : 6;
    const alvo = v.g * meses;
    const falta = Math.max(alvo - v.ja, 0);
    const linhas: string[][] = [];
    let acum = v.ja;
    let m = 0;
    while (acum < alvo && v.ap > 0 && m < 600) {
      m++;
      acum += v.ap;
      linhas.push([String(m), BRL(v.ap), BRL(Math.min(acum, alvo)), BRL(Math.max(alvo - acum, 0))]);
    }
    return {
      passos: [
        {
          rotulo: "Quantos meses de gasto você precisa guardar",
          conta:
            v.t === "pj"
              ? "autônomo ou PJ: 12 meses"
              : v.t === "pub"
                ? "servidor público: 3 meses"
                : "carteira assinada: 6 meses",
          valor: `${meses} meses`,
        },
        { rotulo: "Sua reserva ideal", conta: `${BRL(v.g)} × ${meses}`, valor: BRL(alvo) },
        { rotulo: "Quanto falta", conta: `${BRL(alvo)} − ${BRL(v.ja)}`, valor: BRL(falta) },
        {
          rotulo: "Quantos meses você aguenta hoje sem renda",
          conta: `${BRL(v.ja)} ÷ ${BRL(v.g)}`,
          valor: NUM(v.g > 0 ? v.ja / v.g : 0, 1) + " meses",
        },
      ],
      serie: linhas.length
        ? {
            colunas: ["Mês", "Guardou", "Acumulado", "Ainda falta"],
            linhas: filtrarMeses(linhas).map((x) => x.item),
            resumo: amostrar(linhas, linhas.length),
          }
        : undefined,
    };
  },

  capital: (v) => {
    const n = nMes(v.pz);
    return {
      passos: [
        {
          rotulo: "Por quantos meses a família dependeria",
          conta: v.pz.u === "anos" ? `${NUM(v.pz.n, 0)} anos × 12` : `${NUM(v.pz.n, 0)} meses`,
          valor: `${n} meses`,
        },
        {
          rotulo: "Para manter o padrão de vida",
          conta: `${BRL(v.r)} × ${n}`,
          valor: BRL(v.r * n, 2),
        },
        {
          rotulo: "Total necessário",
          conta: `${BRL(v.r * n)} + ${BRL(v.dv)} de dívidas`,
          valor: BRL(v.r * n + v.dv, 2),
        },
      ],
    };
  },

  /* ── Objetivos ─────────────────────────────────────── */
  meta: (v) => {
    const i = iMes(v.r);
    const n = nMes(v.pz);
    const fut = v.ja * Math.pow(1 + i, n);
    const falta = Math.max(v.alvo - fut, 0);
    const pmt = i <= 0 ? falta / n : (falta * i) / (Math.pow(1 + i, n) - 1);
    const linhas: string[][] = [];
    let acum = v.ja;
    for (let m = 1; m <= n; m++) {
      const rend = acum * i;
      acum = acum + rend + pmt;
      linhas.push([String(m), BRL(pmt), BRL(rend), BRL(acum)]);
    }
    return {
      passos: [
        {
          rotulo: "Rendimento convertido para o mês",
          conta: `(1 + ${NUM(v.r.n, 2)}%)^(1/12) − 1`,
          valor: pct(i) + " ao mês",
        },
        {
          rotulo: "Quanto o que você já tem vira sozinho",
          conta: `${BRL(v.ja)} × (1 + ${NUM(i, 6)})^${n}`,
          valor: BRL(fut, 2),
        },
        {
          rotulo: "Quanto falta juntar",
          conta: `${BRL(v.alvo)} − ${BRL(fut)}`,
          valor: BRL(falta, 2),
        },
        {
          rotulo: "Depósito mensal necessário",
          conta: `${BRL(falta)} × ${NUM(i, 6)} ÷ ((1 + ${NUM(i, 6)})^${n} − 1)`,
          valor: BRL(pmt),
        },
      ],
      serie: {
        colunas: ["Mês", "Depositou", "Rendeu", "Acumulado"],
        linhas: filtrarMeses(linhas).map((x) => x.item),
        resumo: amostrar(linhas, n),
      },
    };
  },

  curso: (v) => {
    const g = v.dp - v.hj;
    return {
      passos: [
        {
          rotulo: "Aumento esperado por mês",
          conta: `${BRL(v.dp)} − ${BRL(v.hj)}`,
          valor: BRL(g),
        },
        {
          rotulo: "Meses até o aumento cobrir o curso",
          conta: g > 0 ? `${BRL(v.c)} ÷ ${BRL(g)}` : "sem aumento, não se paga",
          valor: g > 0 ? `${Math.ceil(v.c / g)} meses` : "—",
        },
        {
          rotulo: "Lucro líquido em 5 anos",
          conta: `${BRL(g)} × 60 − ${BRL(v.c)}`,
          valor: BRL(g * 60 - v.c, 2),
        },
      ],
    };
  },

  /* ── Renda ─────────────────────────────────────────── */
  cltpj: (v) => {
    const extra = 1 / 12 + 1.3333 / 12 + 0.08;
    const clt = v.sal * (1 + extra) + v.ben;
    return {
      passos: [
        {
          rotulo: "13º salário diluído por mês",
          conta: `${BRL(v.sal)} ÷ 12`,
          valor: BRL(v.sal / 12, 2),
        },
        {
          rotulo: "Férias mais um terço, por mês",
          conta: `${BRL(v.sal)} × 1,3333 ÷ 12`,
          valor: BRL((v.sal * 1.3333) / 12, 2),
        },
        { rotulo: "FGTS", conta: `${BRL(v.sal)} × 8%`, valor: BRL(v.sal * 0.08, 2) },
        {
          rotulo: "Valor real do seu CLT",
          conta: `${BRL(v.sal)} + ${BRL(v.sal * extra)} + ${BRL(v.ben)} de benefícios`,
          valor: BRL(clt, 2),
        },
        {
          rotulo: "Quanto cobrar como PJ, já descontando o imposto",
          conta: `${BRL(clt)} ÷ (1 − ${NUM(v.imp, 1)}%)`,
          valor: BRL(v.imp < 100 ? clt / (1 - v.imp / 100) : 0, 2),
        },
      ],
    };
  },

  /* ── Aposentadoria ─────────────────────────────────── */
  previdencia: (v) => {
    const teto = v.renda * 0.12;
    const ded = Math.min(v.ap, teto);
    const elegivel = v.comp === "sim" && v.inss === "sim";
    const impSem = irpfAnual(v.renda);
    const impCom = irpfAnual(v.renda, v.renda - ded);
    const eco = elegivel ? impSem - impCom : 0;
    const isento = v.renda <= IRPF_ISENCAO_ANUAL;
    return {
      passos: [
        {
          rotulo: "Limite dedutível do PGBL",
          conta: `${BRL(v.renda)} × 12%`,
          valor: BRL(teto, 2),
        },
        {
          rotulo: "Quanto de fato entra na dedução",
          conta: `o menor entre ${BRL(v.ap)} e ${BRL(teto)}`,
          valor: BRL(ded, 2),
        },
        {
          rotulo: "Imposto no ano sem o PGBL",
          conta: isento
            ? `renda de ${BRL(v.renda)} está dentro da isenção de ${BRL(IRPF_ISENCAO_ANUAL)}`
            : `tabela progressiva sobre ${BRL(v.renda)}, já com o redutor da faixa`,
          valor: BRL(impSem, 2),
        },
        {
          rotulo: "Imposto no ano com o PGBL",
          conta: `mesma conta, sobre ${BRL(v.renda)} − ${BRL(ded)} = ${BRL(v.renda - ded)}`,
          valor: BRL(impCom, 2),
        },
        {
          rotulo: "Imposto adiado no ano",
          conta: elegivel
            ? `${BRL(impSem)} − ${BRL(impCom)}`
            : "não se aplica: precisa declarar no completo e contribuir para o INSS",
          valor: BRL(eco, 2),
        },
      ],
    };
  },

  /* ── Investimentos ─────────────────────────────────── */
  ativos: (v) => {
    const n = nMes(v.pz);
    const aliq = aliqIR(n);
    const ia = iMes(v.a);
    const ib = iMes(v.b);
    const brutoA = v.v0 * Math.pow(1 + ia, n);
    const brutoB = v.v0 * Math.pow(1 + ib, n);
    const impA = v.ta === "sim" ? (brutoA - v.v0) * aliq : 0;
    const impB = v.tb === "sim" ? (brutoB - v.v0) * aliq : 0;
    const linhas: string[][] = [];
    for (let m = 1; m <= n; m++) {
      if (m % 12 === 0 || m === n) {
        linhas.push([
          `ano ${Math.ceil(m / 12)}`,
          BRL(v.v0 * Math.pow(1 + ia, m)),
          BRL(v.v0 * Math.pow(1 + ib, m)),
        ]);
      }
    }
    return {
      passos: [
        {
          rotulo: "Alíquota de imposto para esse prazo",
          conta: `${n} meses: ${n <= 6 ? "até 6 meses" : n <= 12 ? "de 7 a 12 meses" : n <= 24 ? "de 13 a 24 meses" : "mais de 24 meses"}`,
          valor: NUM(aliq * 100, 1) + "%",
        },
        {
          rotulo: "Investimento A — bruto",
          conta: `${BRL(v.v0)} × (1 + ${NUM(ia, 6)})^${n}`,
          valor: BRL(brutoA, 2),
        },
        {
          rotulo: "Investimento A — imposto sobre o lucro",
          conta:
            v.ta === "sim"
              ? `(${BRL(brutoA)} − ${BRL(v.v0)}) × ${NUM(aliq * 100, 1)}%`
              : "isento",
          valor: BRL(impA, 2),
        },
        {
          rotulo: "Investimento B — bruto",
          conta: `${BRL(v.v0)} × (1 + ${NUM(ib, 6)})^${n}`,
          valor: BRL(brutoB, 2),
        },
        {
          rotulo: "Investimento B — imposto sobre o lucro",
          conta:
            v.tb === "sim"
              ? `(${BRL(brutoB)} − ${BRL(v.v0)}) × ${NUM(aliq * 100, 1)}%`
              : "isento",
          valor: BRL(impB, 2),
        },
      ],
      serie: {
        colunas: ["Período", "Investimento A (bruto)", "Investimento B (bruto)"],
        linhas,
        resumo: "Um ponto por ano, antes do imposto.",
      },
    };
  },

  /* ── Imposto e herança ─────────────────────────────── */
  irpf: (v) => {
    /* Ano-calendário 2026, Lei 15.270/2025. */
    const LIM_SIMPL = 17640;
    const LIM_DEP = 2275.08;
    const LIM_EDU = 3561.5;
    const simpl = Math.min(v.renda * 0.2, LIM_SIMPL);
    const tetoEdu = LIM_EDU * (1 + v.dep);
    const tetoPgbl = v.renda * 0.12;
    const dDep = v.dep * LIM_DEP;
    const dEdu = Math.min(v.edu, tetoEdu);
    const dPgbl = Math.min(v.pgbl, tetoPgbl);
    return {
      passos: [
        {
          rotulo: "Desconto simplificado",
          conta: `o menor entre ${BRL(v.renda)} × 20% e o teto de ${BRL(LIM_SIMPL, 2)}`,
          valor: BRL(simpl, 2),
        },
        {
          rotulo: "Dependentes",
          conta: `${NUM(v.dep, 0)} × ${BRL(LIM_DEP, 2)}`,
          valor: BRL(dDep, 2),
        },
        {
          rotulo: "Educação, respeitado o teto",
          conta: `o menor entre ${BRL(v.edu)} e ${BRL(LIM_EDU, 2)} × ${NUM(1 + v.dep, 0)} pessoas`,
          valor: BRL(dEdu, 2),
        },
        {
          rotulo: "PGBL, respeitado o teto",
          conta: `o menor entre ${BRL(v.pgbl)} e ${BRL(v.renda)} × 12%`,
          valor: BRL(dPgbl, 2),
        },
        {
          rotulo: "Soma das deduções da declaração completa",
          conta: `${BRL(dDep)} + ${BRL(dEdu)} + ${BRL(v.sau)} de saúde + ${BRL(v.inss)} de INSS + ${BRL(dPgbl)}`,
          valor: BRL(dDep + dEdu + v.sau + v.inss + dPgbl, 2),
        },
        {
          rotulo: "Imposto pela simplificada",
          conta: `tabela por faixas sobre ${BRL(v.renda)} − ${BRL(simpl)} = ${BRL(v.renda - simpl)}`,
          valor: BRL(irpfAnual(v.renda, v.renda - simpl), 2),
        },
        {
          rotulo: "Imposto pela completa",
          conta: `tabela por faixas sobre ${BRL(v.renda)} − ${BRL(dDep + dEdu + v.sau + v.inss + dPgbl)} = ${BRL(v.renda - (dDep + dEdu + v.sau + v.inss + dPgbl))}`,
          valor: BRL(irpfAnual(v.renda, v.renda - (dDep + dEdu + v.sau + v.inss + dPgbl)), 2),
        },
      ],
    };
  },

  inventario: (v) => {
    const it = (v.pat * v.al) / 100;
    const cu = v.pat * 0.03;
    return {
      passos: [
        {
          rotulo: "Imposto de herança do seu estado",
          conta: `${BRL(v.pat)} × ${NUM(v.al, 1)}%`,
          valor: BRL(it, 2),
        },
        {
          rotulo: "Cartório e advogado",
          conta: `${BRL(v.pat)} × 3%`,
          valor: BRL(cu, 2),
        },
        {
          rotulo: "Total que a família precisa ter em dinheiro",
          conta: `${BRL(it)} + ${BRL(cu)}`,
          valor: BRL(it + cu, 2),
        },
      ],
    };
  },
};
