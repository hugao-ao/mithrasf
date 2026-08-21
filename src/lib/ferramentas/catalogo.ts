import {
  ArrowLeftRight,
  BarChart3,
  Briefcase,
  Calculator,
  Car,
  Coins,
  CreditCard,
  FileText,
  Flame,
  GraduationCap,
  Heart,
  Home,
  KeyRound,
  LineChart,
  Percent,
  Receipt,
  Scale,
  Shield,
  ShoppingBag,
  Target,
  Umbrella,
  Wallet,
} from "lucide-react";
import {
  aliqIR,
  BRL,
  fvSerie,
  iMes,
  NUM,
  nMes,
  pmtPrice,
  taxaDeParcelas,
  totJurosSac,
} from "./financas";
import { juro, money, opt, prazo, qtd, type Ferramenta } from "./tipos";

/** Ordem das seções na página de ferramentas. */
export const AREAS = [
  "Orçamento do dia a dia",
  "Dívidas",
  "Casa e crédito",
  "Carro e bens",
  "Proteção",
  "Objetivos",
  "Renda",
  "Aposentadoria",
  "Investimentos",
  "Imposto e herança",
];

export const FERRAMENTAS: Ferramenta[] = [
  /* ── Orçamento do dia a dia ─────────────────────────── */
  {
    id: "precos",
    slug: "comparador-precos",
    area: "Orçamento do dia a dia",
    nome: "Comparador de Preços",
    icone: ShoppingBag,
    desc: "Diz qual embalagem sai mais barata por unidade — seja grama, litro, folha ou unidade.",
    como: "Compare dois tamanhos do mesmo produto. A unidade é a que você quiser.",
    campos: {
      pa: money("Preço da embalagem A", 12.9),
      qa: qtd("Quantidade dela", 500),
      pb: money("Preço da embalagem B", 21.5),
      qb: qtd("Quantidade dela", 1000),
      un: opt(
        "Unidade que você está usando",
        "g",
        [
          ["un", "Unidades"],
          ["g", "Gramas"],
          ["kg", "Quilos"],
          ["ml", "Mililitros"],
          ["l", "Litros"],
          ["m", "Metros"],
          ["fl", "Folhas"],
        ],
        true,
      ),
    },
    calc: (v) => {
      const ua = v.qa > 0 ? v.pa / v.qa : 0;
      const ub = v.qb > 0 ? v.pb / v.qb : 0;
      const A = ua <= ub;
      const dif = Math.max(ua, ub) > 0 ? (Math.abs(ua - ub) / Math.max(ua, ub)) * 100 : 0;
      const rot: Record<string, string> = {
        un: "unidade",
        g: "grama",
        kg: "quilo",
        ml: "ml",
        l: "litro",
        m: "metro",
        fl: "folha",
      };
      const r = rot[v.un] || "unidade";
      return {
        tom: "is-good",
        k: "A mais barata é",
        val: A ? "Embalagem A" : "Embalagem B",
        sub: `Sai ${NUM(dif)}% mais em conta. A certa custa ${BRL(Math.min(ua, ub), 4)} por ${r}; a outra, ${BRL(Math.max(ua, ub), 4)}.`,
        rows: [
          ["Embalagem A · por " + r, BRL(ua, 4), A ? "hl" : "dim"],
          ["Embalagem B · por " + r, BRL(ub, 4), A ? "dim" : "hl"],
        ],
        nota: "Só vale se você usar tudo antes de estragar. Embalagem grande parada no armário é dinheiro parado.",
        gat: {
          titulo: "A conta está certa. O problema é que ela volta.",
          corpo:
            "Semana que vem é o plano de celular, o seguro do carro, a internet. Cada um vira uma pesquisa que você faz sozinho.",
          nivel: "A partir do Nível II, essa pesquisa passa a ser feita por nós.",
          botao: "Quero parar de pesquisar sozinho",
        },
      };
    },
  },
  {
    id: "fluxo",
    slug: "fluxo-caixa",
    area: "Orçamento do dia a dia",
    nome: "Raio-X do Fluxo de Caixa",
    icone: Wallet,
    custom: "fluxo",
    desc: "Você lança tudo que entra e tudo que sai, sem ver o placar. O resultado só aparece no fim.",
    como: "Quatro etapas. O saldo só aparece na última — de propósito.",
  },

  /* ── Dívidas ────────────────────────────────────────── */
  {
    id: "quitacao",
    slug: "qual-divida-primeiro",
    area: "Dívidas",
    nome: "Qual Dívida Matar Primeiro",
    icone: Flame,
    nova: true,
    custom: "dividas",
    desc: "Compara suas dívidas e diz qual queima mais dinheiro seu por mês. Se você não sabe os juros, ele descobre.",
    como: "Adicione suas dívidas. Não sabe a taxa? Informe as parcelas que a gente calcula.",
  },
  {
    id: "juros",
    slug: "calculadora-juros",
    area: "Dívidas",
    nome: "Calculadora de Juros Reais",
    icone: Percent,
    desc: 'Revela os juros escondidos naquele parcelamento que diz ser "sem juros".',
    como: "Compare o preço à vista com o total das parcelas.",
    campos: {
      av: money("Preço à vista", 2000),
      pc: money("Valor de cada parcela", 199),
      n: qtd("Quantas parcelas", 12, "x"),
    },
    calc: (v) => {
      const i = taxaDeParcelas(v.av, v.pc, v.n);
      const tot = v.pc * v.n;
      const ex = tot - v.av;
      return {
        tom: i > 0.005 ? "is-bad" : "is-good",
        k: "Juros escondidos",
        val: NUM(i * 100, 2) + "% ao mês",
        sub:
          i > 0.0001
            ? `Isso dá ${NUM((Math.pow(1 + i, 12) - 1) * 100, 1)}% ao ano. Você paga ${BRL(ex)} a mais do que o preço à vista.`
            : "Esse parcelamento é realmente sem juros. Nesse caso, parcelar é melhor que pagar à vista.",
        rows: [
          ["Preço à vista", BRL(v.av)],
          ["Total parcelado", BRL(tot)],
          ["Diferença", BRL(ex), "hl"],
        ],
        nota: 'Se o vendedor dá desconto à vista, o "sem juros" nunca foi sem juros — o juro estava embutido no preço.',
        gat: {
          titulo: "A taxa está calculada. A próxima proposta, não.",
          corpo:
            "Sempre aparece outra: o desconto à vista do vendedor, o parcelamento da viagem, o 12x que não é 12x.",
          nivel:
            "Com um plano, você manda a proposta no WhatsApp e recebe o cálculo pronto. Já no Nível I.",
          botao: "Quero conferir antes de assinar",
        },
      };
    },
  },
  {
    id: "parcela",
    slug: "simulador-parcela",
    area: "Dívidas",
    nome: "Simulador de Parcela",
    icone: Calculator,
    nova: true,
    desc: "Recebeu uma proposta de empréstimo? Confira se a parcela oferecida bate com os juros informados.",
    como: "Coloque o valor e a taxa. Se já tem uma proposta, compare com ela.",
    opcionais: ["of"],
    campos: {
      pv: money("Valor contratado", 10000),
      j: juro("Juros do empréstimo", 2.5, "mes"),
      pz: prazo("Prazo", 24, "meses"),
      sis: opt("Sistema", "price", [
        ["price", "Parcela fixa (Price)"],
        ["sac", "Parcela decrescente (SAC)"],
      ]),
      of: money("Parcela que te ofereceram (opcional)", 0, true),
    },
    calc: (v) => {
      const i = iMes(v.j);
      const n = nMes(v.pz);
      const pp = pmtPrice(v.pv, i, n);
      const am = v.pv / n;
      const s1 = am + v.pv * i;
      const sn = am + am * i;
      const price = v.sis === "price";
      const parcela = price ? pp : s1;
      const total = price ? pp * n : v.pv + totJurosSac(v.pv, i, n);
      const rows: Array<[string, string] | [string, string, "hl" | "dim"]> = price
        ? [
            ["Parcela fixa", BRL(pp), "hl"],
            ["Total pago", BRL(total)],
            ["Só de juros", BRL(total - v.pv)],
          ]
        : [
            ["Primeira parcela", BRL(s1), "hl"],
            ["Última parcela", BRL(sn)],
            ["Total pago", BRL(total)],
            ["Só de juros", BRL(total - v.pv)],
          ];
      let sub = `Com ${NUM(v.j.n, 2)}% ${v.j.u === "mes" ? "ao mês" : "ao ano"} em ${n} meses, a parcela ${price ? "fica em" : "começa em"} ${BRL(parcela)}.`;
      let tom: "" | "is-good" | "is-bad" = "";
      if (v.of > 0) {
        const iReal = taxaDeParcelas(v.pv, v.of, n);
        const dif = v.of - pp;
        rows.push(["Proposta que te ofereceram", BRL(v.of), "dim"]);
        rows.push(["Juros reais da proposta", NUM(iReal * 100, 2) + "% ao mês", "dim"]);
        tom = dif > 1 ? "is-bad" : "is-good";
        sub =
          dif > 1
            ? `A proposta te cobra ${BRL(dif)} a mais por parcela. A taxa real dela é ${NUM(iReal * 100, 2)}% ao mês, e não ${NUM(i * 100, 2)}%.`
            : `A proposta está ${BRL(Math.abs(dif))} abaixo do que a taxa informada daria. Taxa real dela: ${NUM(iReal * 100, 2)}% ao mês.`;
      }
      return {
        tom,
        k: v.of > 0 ? "Comparando com a proposta" : "Sua parcela",
        val: BRL(parcela),
        sub,
        rows,
        nota: "Bancos costumam somar IOF, seguro e tarifa de cadastro na parcela. Se a proposta veio maior que a conta, pergunte o que foi embutido.",
        gat: {
          titulo: "A parcela está conferida. A proposta inteira, não.",
          corpo:
            "Falta olhar IOF, seguro prestamista, tarifa de cadastro e se existe proposta melhor em outro banco.",
          nivel: "A partir do Nível II, a gente cota outros bancos para comparar.",
          botao: "Quero conferir a proposta inteira",
        },
      };
    },
  },
  {
    id: "avista",
    slug: "a-vista-vs-parcelado",
    area: "Dívidas",
    nome: "À Vista ou Parcelado?",
    icone: Scale,
    desc: "Diz se compensa pagar tudo agora ou parcelar e deixar seu dinheiro rendendo.",
    como: "Se o parcelamento for sem juros, o dinheiro rendendo pode ganhar.",
    campos: {
      av: money("Preço à vista", 2000),
      pc: money("Valor de cada parcela", 166.67),
      n: qtd("Quantas parcelas", 12, "x"),
      r: juro("Quanto seu dinheiro rende", 11, "ano"),
    },
    calc: (v) => {
      const i = iMes(v.r);
      let s = v.av;
      for (let k = 0; k < v.n; k++) s = s * (1 + i) - v.pc;
      const ganha = s > 0;
      return {
        tom: ganha ? "is-good" : "",
        k: ganha ? "Melhor parcelar" : "Melhor pagar à vista",
        val: BRL(Math.abs(s)),
        sub: ganha
          ? `Deixando os ${BRL(v.av)} rendendo e pagando as parcelas, sobram ${BRL(s)} no fim. Parcelar é de graça e ainda te dá isso.`
          : `Parcelar sai ${BRL(Math.abs(s))} mais caro no fim. Pague à vista se puder.`,
        rows: [
          ["Total das parcelas", BRL(v.pc * v.n)],
          ["Preço à vista", BRL(v.av)],
          [ganha ? "Você ganha" : "Você perde", BRL(Math.abs(s)), "hl"],
        ],
        nota: "Só faça isso se o dinheiro ficar realmente investido. Se ele for gasto no meio do caminho, você fica com a dívida e sem o dinheiro.",
        gat: {
          titulo: "A matemática está resolvida. A decisão, não.",
          corpo:
            "Pagar à vista pode ganhar na conta e ainda ser errado — se zerar sua reserva ou travar dinheiro que você vai precisar em três meses.",
          nivel: "Numa reunião isso se resolve em dez minutos, com os seus números na mesa.",
          botao: "Quero decidir com alguém olhando junto",
        },
      };
    },
  },

  /* ── Casa e crédito ─────────────────────────────────── */
  {
    id: "imobiliario",
    slug: "simulador-imobiliario",
    area: "Casa e crédito",
    nome: "Simulador Imobiliário",
    icone: Home,
    desc: "Compara os dois tipos de financiamento e mostra quanto de juros você paga no total.",
    como: "SAC começa mais caro e vai baixando. Price é sempre igual.",
    campos: {
      pv: money("Quanto vai financiar", 300000),
      pz: prazo("Prazo", 30, "anos"),
      j: juro("Juros do financiamento", 11, "ano"),
    },
    calc: (v) => {
      const n = nMes(v.pz);
      const i = iMes(v.j);
      const pp = pmtPrice(v.pv, i, n);
      const totP = pp * n;
      const am = v.pv / n;
      const p1 = am + v.pv * i;
      const totS = v.pv + totJurosSac(v.pv, i, n);
      return {
        k: "Diferença entre os dois",
        val: BRL(totP - totS, 0),
        sub: `No SAC você paga ${BRL(totP - totS, 0)} a menos de juros, mas a primeira parcela é ${BRL(p1 - pp)} mais alta. Se couber no bolso, SAC vence.`,
        rows: [
          ["SAC · 1ª parcela", BRL(p1)],
          ["SAC · última parcela", BRL(am + am * i)],
          ["SAC · total pago", BRL(totS, 0), "hl"],
          ["Price · parcela fixa", BRL(pp)],
          ["Price · total pago", BRL(totP, 0)],
        ],
        nota: "A maioria dos bancos oferece Price primeiro porque a parcela inicial parece menor. Pergunte pelo SAC.",
        gat: {
          titulo: "A simulação está feita. A negociação é que decide.",
          corpo:
            "Vai ter FGTS para encaixar, seguro embutido para questionar, portabilidade para avaliar — e um gerente com meta para bater do outro lado.",
          nivel:
            "A partir do Nível III, a gente entra nessa conversa junto com você. Sem comissão de ninguém.",
          botao: "Quero alguém do meu lado na negociação",
        },
      };
    },
  },
  {
    id: "casatotal",
    slug: "custo-casa-propria",
    area: "Casa e crédito",
    nome: "O Custo Real da Casa Própria",
    icone: KeyRound,
    nova: true,
    desc: "O preço do imóvel não é o que você precisa ter. Mostra tudo que aparece na hora da compra.",
    como: "Além da entrada, tem imposto, cartório e mudança.",
    opcionais: ["mv"],
    campos: {
      pr: money("Preço do imóvel", 400000),
      ent: qtd("Entrada exigida pelo banco", 20, "%"),
      mv: money("Móveis, reforma e mudança", 25000),
    },
    calc: (v) => {
      const ent = (v.pr * v.ent) / 100;
      const itbi = v.pr * 0.02;
      const cart = v.pr * 0.015;
      const tot = ent + itbi + cart + v.mv;
      return {
        tom: "is-bad",
        k: "Você precisa ter, na verdade",
        val: BRL(tot, 0),
        sub: `São ${BRL(tot - ent, 0)} além da entrada que ninguém conta. Quem junta só a entrada descobre isso na semana da assinatura.`,
        rows: [
          ["Entrada", BRL(ent, 0)],
          ["ITBI (imposto da prefeitura)", BRL(itbi, 0)],
          ["Cartório e registro", BRL(cart, 0)],
          ["Móveis, reforma e mudança", BRL(v.mv, 0)],
          ["Total necessário", BRL(tot, 0), "hl"],
        ],
        nota: "ITBI e cartório variam por cidade. Usei 2% e 1,5%, que é a média. Alguns municípios dão desconto no primeiro imóvel.",
        gat: {
          titulo: "O número está na mesa. Chegar nele é outra conversa.",
          corpo:
            "Dá para usar FGTS, negociar o ITBI, entrar em programa habitacional ou rever o valor do imóvel. Cada caminho muda esse total.",
          nivel: "A partir do Nível III, acompanhamos as tratativas com banco e corretor.",
          botao: "Quero montar esse plano com ajuda",
        },
      };
    },
  },
  {
    id: "consorcio",
    slug: "consorcio-ou-financiamento",
    area: "Casa e crédito",
    nome: "Consórcio ou Financiamento?",
    icone: FileText,
    nova: true,
    desc: "Põe os dois lado a lado com reajuste e TR, e deixa escolher entre parcela fixa ou decrescente.",
    como: "No consórcio você paga menos, mas espera para ter o bem.",
    opcionais: ["tr", "rj"],
    campos: {
      pr: money("Valor do bem", 300000),
      pz: prazo("Prazo", 15, "anos"),
      j: juro("Juros do financiamento", 11, "ano"),
      sis: opt("Sistema do financiamento", "price", [
        ["price", "Parcela fixa (Price)"],
        ["sac", "Parcela decrescente (SAC)"],
      ]),
      tx: qtd("Taxa de administração do consórcio", 18, "%"),
      tr: qtd("TR do financiamento — opcional", 0, "% ao ano"),
      rj: qtd("Reajuste anual do consórcio — opcional", 0, "% ao ano", true),
    },
    calc: (v) => {
      const n = nMes(v.pz);
      const i = iMes({ n: v.j.n + (v.tr || 0), u: v.j.u });
      const price = v.sis === "price";
      const pFin = price ? pmtPrice(v.pr, i, n) : v.pr / n + v.pr * i;
      const totFin = price ? pmtPrice(v.pr, i, n) * n : v.pr + totJurosSac(v.pr, i, n);
      const base = (v.pr * (1 + v.tx / 100)) / n;
      let totCons = 0;
      let pc = base;
      for (let k = 0; k < n; k++) {
        if (k > 0 && k % 12 === 0) pc *= 1 + (v.rj || 0) / 100;
        totCons += pc;
      }
      const dif = totFin - totCons;
      const cons = dif > 0;
      return {
        tom: cons ? "is-good" : "is-bad",
        k: cons ? "Consórcio sai mais barato em" : "Financiamento sai mais barato em",
        val: BRL(Math.abs(dif), 0),
        sub: `Parcela de ${BRL(base)} no consórcio contra ${BRL(pFin)} no financiamento${price ? "" : " (primeira, decrescente)"}. Mas no consórcio você só recebe o bem quando for sorteado ou der o lance.`,
        rows: [
          ["Financiamento · " + (price ? "parcela fixa" : "1ª parcela"), BRL(pFin)],
          ["Financiamento · total", BRL(totFin, 0)],
          ["Consórcio · 1ª parcela", BRL(base)],
          ["Consórcio · última parcela", BRL(pc)],
          ["Consórcio · total", BRL(totCons, 0), "hl"],
        ],
        nota: "TR e reajuste começam em zero. Coloque valores para ver o cenário com correção — a TR passa longos períodos zerada, mas o reajuste do consórcio acompanha a inflação do bem.",
        gat: {
          titulo: "A conta está feita. A carta de crédito é que tem letra miúda.",
          corpo:
            "Grupo, prazo, seguro obrigatório, regra de lance e reajuste anual mudam tudo — e variam de administradora para administradora.",
          nivel: "A partir do Nível II, a gente cota e compara as administradoras para você.",
          botao: "Quero comparar as opções reais",
        },
      };
    },
  },
  {
    id: "alugar",
    slug: "alugar-ou-comprar",
    area: "Casa e crédito",
    nome: "Alugar ou Comprar?",
    icone: ArrowLeftRight,
    nova: true,
    desc: "Compara cinco caminhos até a casa própria, com aluguel, imóvel e consórcio reajustando todo ano.",
    como: "Todos gastam o mesmo por mês. O que sobra vai para investimento.",
    opcionais: ["tr", "ent", "vz", "rjal", "rjco"],
    campos: {
      pr: money("Preço do imóvel", 400000),
      al: money("Aluguel de um imóvel parecido", 1800),
      ent: money("Quanto você tem hoje", 100000),
      pz: prazo("Por quanto tempo comparar", 20, "anos"),
      j: juro("Juros do financiamento", 11, "ano"),
      r: juro("Quanto seus investimentos rendem", 10, "ano"),
      tx: qtd("Taxa de administração do consórcio", 18, "%"),
      vz: qtd("Reajuste do imóvel", 5, "% ao ano"),
      rjal: qtd("Reajuste do aluguel", 4.5, "% ao ano"),
      rjco: qtd("Reajuste do consórcio", 4.5, "% ao ano"),
      tr: qtd("TR do financiamento — opcional", 0, "% ao ano", true),
    },
    calc: (v) => {
      const n = nMes(v.pz);
      const i = iMes({ n: v.j.n + (v.tr || 0), u: v.j.u });
      const ri = iMes(v.r);
      const fin = Math.max(v.pr - v.ent, 0);
      const pP = pmtPrice(fin, i, n);
      const amS = fin / n;
      const pS1 = amS + fin * i;
      const pC0 = (v.pr * (1 + v.tx / 100)) / n;
      const imovelFim = v.pr * Math.pow(1 + v.vz / 100, n / 12);
      const ano = (k: number) => Math.floor(k / 12);
      const alK = (k: number) => v.al * Math.pow(1 + (v.rjal || 0) / 100, ano(k));
      const coK = (k: number) => pC0 * Math.pow(1 + (v.rjco || 0) / 100, ano(k));
      const saK = (k: number) => amS + (fin - amS * k) * i;
      const valImovel = (k: number) => v.pr * Math.pow(1 + v.vz / 100, k / 12);

      /* Orçamento = a maior primeira parcela. Se um caminho encarecer depois, a
         diferença sai do investimento — que é o que acontece na vida real. */
      const orc = Math.max(pP, pS1, pC0 + v.al, v.al);
      const sim = (pagK: (k: number) => number, inicial: number, temImovel: boolean) => {
        let inv = inicial;
        for (let k = 0; k < n; k++) inv = inv * (1 + ri) + (orc - pagK(k));
        return inv + (temImovel ? imovelFim : 0);
      };

      /* Juntar e comprar à vista: aluga e investe até o caixa alcançar o imóvel. */
      let inv = v.ent;
      let comprou = -1;
      for (let k = 0; k < n; k++) {
        if (comprou < 0 && inv >= valImovel(k)) {
          inv -= valImovel(k);
          comprou = k;
        }
        inv = inv * (1 + ri) + (orc - (comprou < 0 ? alK(k) : 0));
      }

      const cen = [
        { n: "Financiar · parcela fixa", v: sim(() => pP, 0, true), p: BRL(pP) },
        {
          n: "Financiar · decrescente",
          v: sim(saK, 0, true),
          p: BRL(pS1) + " → " + BRL(amS + amS * i),
        },
        {
          n: "Consórcio + aluguel",
          v: sim((k) => coK(k) + alK(k), v.ent, true),
          p: BRL(pC0 + v.al) + " → " + BRL(coK(n - 1) + alK(n - 1)),
        },
        {
          n: "Alugar e investir sempre",
          v: sim(alK, v.ent, false),
          p: BRL(v.al) + " → " + BRL(alK(n - 1)),
        },
        {
          n: "Juntar e comprar à vista",
          v: inv + (comprou >= 0 ? imovelFim : 0),
          p: comprou >= 0 ? "compra no mês " + (comprou + 1) : "não chega no prazo",
        },
      ];
      cen.sort((a, b) => b.v - a.v);
      const top = cen[0];
      const last = cen[cen.length - 1];
      return {
        tom: "is-good",
        k: "Termina com mais patrimônio",
        val: top.n,
        sub: `Gastando ${BRL(orc)} por mês em qualquer caminho, esse termina com ${BRL(top.v - last.v, 0)} a mais que o pior. O imóvel sairia de ${BRL(v.pr, 0)} para ${BRL(imovelFim, 0)} e o aluguel, de ${BRL(v.al)} para ${BRL(alK(n - 1))}.`,
        rows: cen.map(
          (c, k) =>
            [c.n + " · " + c.p, BRL(c.v, 0), k === 0 ? "hl" : "dim"] as [
              string,
              string,
              "hl" | "dim",
            ],
        ),
        nota: "Alugar só ganha se você realmente investir a diferença todo mês, com o aluguel subindo todo ano. Na vida real quase ninguém investe — e é por isso que o financiamento costuma vencer na prática, mesmo perdendo na conta.",
        gat: {
          titulo: "Os cinco caminhos estão comparados. O seu ainda não foi escolhido.",
          corpo:
            "FGTS, programa habitacional, portabilidade e o momento da compra mudam esse ranking inteiro. E a estabilidade da sua renda muda mais ainda.",
          nivel: "A partir do Nível III, acompanhamos a decisão e as tratativas do começo ao fim.",
          botao: "Quero decidir isso com apoio",
        },
      };
    },
  },

  /* ── Carro e bens ───────────────────────────────────── */
  {
    id: "carro",
    slug: "custo-real-do-carro",
    area: "Carro e bens",
    nome: "O Custo Real do Carro",
    icone: Car,
    nova: true,
    desc: "Soma tudo que o carro come por mês, não só a parcela. O número costuma assustar.",
    como: "Junte parcela, combustível, seguro, IPVA e manutenção.",
    opcionais: ["pc"],
    campos: {
      pc: money("Parcela do financiamento", 1200),
      cb: money("Combustível por mês", 600),
      sg: money("Seguro por ano", 3200),
      ip: money("IPVA e licenciamento por ano", 1800),
      mn: money("Manutenção e pneus por ano", 2400),
    },
    calc: (v) => {
      const an = (v.sg + v.ip + v.mn) / 12;
      const real = v.pc + v.cb + an;
      return {
        tom: "is-bad",
        k: "Seu carro custa por mês",
        val: BRL(real),
        sub: `Você olha para a parcela de ${BRL(v.pc)}, mas o carro leva ${BRL(real)} todo mês. São ${BRL(real * 12, 0)} por ano.`,
        rows: [
          ["Parcela", BRL(v.pc)],
          ["Combustível", BRL(v.cb)],
          ["Seguro, IPVA e manutenção (por mês)", BRL(an)],
          ["Custo real por mês", BRL(real), "hl"],
        ],
        nota: "Ainda falta a desvalorização: um carro perde cerca de 10% do valor por ano, e isso não aparece em nenhum boleto.",
        gat: {
          titulo: "O custo está na mesa. O que fazer com ele, não.",
          corpo:
            "Trocar por um mais barato, quitar antes, mudar o seguro ou vender e usar aplicativo — cada opção muda seu orçamento inteiro.",
          nivel: "Leve esse número para a reunião. Reunião ilimitada desde o Nível I.",
          botao: "Quero ver o que fazer com esse número",
        },
      };
    },
  },
  {
    id: "cartoes",
    slug: "comparador-cartoes",
    area: "Carro e bens",
    nome: "Comparador de Cartões",
    icone: CreditCard,
    desc: "Soma cashback e milhas na mesma conta, desconta a anuidade e diz qual cartão sobra mais no ano.",
    como: "Cada cartão pode dar dinheiro de volta, pontos, ou os dois.",
    opcionais: ["a1", "c1", "p1", "a2", "c2", "p2"],
    campos: {
      g: money("Quanto você gasta no cartão por mês", 3000),
      dol: money("Cotação do dólar do seu cartão", 5.4),
      ml: money("Quanto vale o milheiro para você", 22, true),
      a1: money("Cartão A — anuidade por ano", 0),
      c1: qtd("Cartão A — cashback", 0.5, "%"),
      p1: qtd("Cartão A — pontos por dólar", 1, "pts"),
      a2: money("Cartão B — anuidade por ano", 600),
      c2: qtd("Cartão B — cashback", 0.2, "%"),
      p2: qtd("Cartão B — pontos por dólar", 2.2, "pts"),
    },
    calc: (v) => {
      const anual = v.g * 12;
      const usd = v.dol > 0 ? anual / v.dol : 0;
      const cash = (c: number) => (anual * c) / 100;
      const pts = (p: number) => usd * p;
      const milhas = (p: number) => (pts(p) / 1000) * v.ml;
      const r1 = cash(v.c1) + milhas(v.p1) - v.a1;
      const r2 = cash(v.c2) + milhas(v.p2) - v.a2;
      const A = r1 >= r2;
      const bloco = (nome: string, c: number, p: number, a: number, r: number, hl: boolean) =>
        [
          [nome + " · cashback " + NUM(c, 2) + "%", BRL(cash(c), 0), "dim"],
          [nome + " · milhas (" + NUM(pts(p), 0) + " pts/ano)", BRL(milhas(p), 0), "dim"],
          [nome + " · anuidade", a > 0 ? "− " + BRL(a, 0) : "sem anuidade", "dim"],
          [nome + " · sobra no ano", BRL(r, 0), hl ? "hl" : "dim"],
        ] as Array<[string, string, "hl" | "dim"]>;
      return {
        tom: "is-good",
        k: "Sobra mais no bolso",
        val: A ? "Cartão A" : "Cartão B",
        sub: `Somando dinheiro de volta e pontos e tirando a anuidade, ele te deixa ${BRL(Math.abs(r1 - r2), 0)} a mais por ano.`,
        rows: [
          ...bloco("A", v.c1, v.p1, v.a1, r1, A),
          ...bloco("B", v.c2, v.p2, v.a2, r2, !A),
        ],
        nota: "O milheiro só vale o que você consegue por ele: pontos expiram, programas mudam de regra e passagem em alta temporada some. Se você não vende nem usa os pontos, coloque zero no valor do milheiro e compare só pelo cashback.",
        gat: {
          titulo: "Os cartões estão comparados. Seu gasto real, não.",
          corpo:
            "Você troca de emprego, passa a viajar, o banco mexe no programa de pontos. A resposta de hoje não é a de daqui a um ano.",
          nivel: "A partir do Nível II, a gente refaz essa comparação sempre que a sua vida mudar.",
          botao: "Quero a resposta revisada quando mudar",
        },
      };
    },
  },

  /* ── Proteção ───────────────────────────────────────── */
  {
    id: "reserva",
    slug: "reserva-de-emergencia",
    area: "Proteção",
    nome: "Reserva de Emergência",
    icone: Shield,
    nova: true,
    desc: "Mostra quanto você precisa ter guardado, quanto tempo aguenta hoje e quando chega lá.",
    como: "Depende do seu gasto e de quão firme é a sua renda.",
    opcionais: ["ja", "ap"],
    campos: {
      g: money("Quanto você gasta por mês", 3500),
      t: opt("Como você trabalha", "clt", [
        ["clt", "Carteira assinada"],
        ["pj", "Autônomo ou PJ"],
        ["pub", "Servidor público"],
      ]),
      ja: money("Quanto já tem guardado", 4000),
      ap: money("Quanto consegue guardar por mês", 500),
    },
    calc: (v) => {
      const meses = v.t === "pj" ? 12 : v.t === "pub" ? 3 : 6;
      const alvo = v.g * meses;
      const falta = Math.max(alvo - v.ja, 0);
      const tempo = v.ap > 0 ? Math.ceil(falta / v.ap) : 0;
      const hoje = v.g > 0 ? v.ja / v.g : 0;
      return {
        tom: hoje >= meses ? "is-good" : hoje < 1 ? "is-bad" : "is-warn",
        k: "Sua reserva deveria ser",
        val: BRL(alvo, 0),
        sub:
          falta <= 0
            ? `Você já está protegido: aguenta ${NUM(hoje)} meses sem nenhuma renda entrar.`
            : `Hoje você aguenta ${NUM(hoje)} ${hoje === 1 ? "mês" : "meses"} sem renda. Faltam ${BRL(falta, 0)} — no seu ritmo, ${tempo > 0 ? tempo + " meses" : "nunca, porque você não está guardando nada"}.`,
        rows: [
          ["Você precisa de", meses + " meses de gasto"],
          ["Já tem", BRL(v.ja, 0)],
          ["Falta", BRL(falta, 0), "hl"],
          ["Chega lá em", tempo > 0 ? tempo + " meses" : "—"],
        ],
        nota: "Autônomo precisa do dobro porque a renda falha sem aviso. Reserva fica em lugar que você saca no mesmo dia, não em investimento travado.",
        gat: {
          titulo: "O alvo está definido. Chegar nele é que trava.",
          corpo:
            "Guardar todo mês é fácil de escrever e difícil de manter quando aparece o imprevisto — que é justamente o que a reserva existe para cobrir.",
          nivel:
            "Reunião e WhatsApp ilimitados desde o Nível I, para ajustar sempre que sair do trilho.",
          botao: "Quero alguém acompanhando isso comigo",
        },
      };
    },
  },
  {
    id: "capital",
    slug: "capital-segurado",
    area: "Proteção",
    nome: "Se Você Faltar, e a Família?",
    icone: Umbrella,
    nova: true,
    desc: "Calcula quanto sua família precisaria ter para manter a vida sem a sua renda.",
    como: "Quanto tempo eles precisariam se sustentar sem você.",
    opcionais: ["dv"],
    campos: {
      r: money("Quanto você leva para casa por mês", 5000),
      pz: prazo("Por quanto tempo eles dependeriam", 10, "anos"),
      dv: money("Dívidas que sobrariam", 80000),
    },
    calc: (v) => {
      const n = nMes(v.pz);
      const renda = v.r * n;
      const tot = renda + v.dv;
      return {
        tom: "is-bad",
        k: "Sua família precisaria de",
        val: BRL(tot, 0),
        sub: `${BRL(renda, 0)} para viver ${NUM(n / 12, 1)} anos no mesmo padrão, mais ${BRL(v.dv, 0)} para não herdar suas dívidas.`,
        rows: [
          ["Para manter o padrão", BRL(renda, 0)],
          ["Para quitar as dívidas", BRL(v.dv, 0)],
          ["Total necessário", BRL(tot, 0), "hl"],
        ],
        nota: "Isso é o valor que a família precisa ter, não o preço de um seguro. Parte pode já estar coberta pelo que você tem guardado ou pelo seguro do trabalho.",
        gat: {
          titulo: "O valor está calculado. Como cobrir ele é a questão.",
          corpo:
            "Pode vir de patrimônio, de seguro de vida, de previdência ou de uma mistura. Cada caminho tem custo e regra diferente.",
          nivel:
            "Análise de seguros está no escopo desde o Nível I — e não ganhamos comissão de nenhuma seguradora.",
          botao: "Quero ver como cobrir esse valor",
        },
      };
    },
  },

  /* ── Objetivos ──────────────────────────────────────── */
  {
    id: "meta",
    slug: "quanto-guardar-por-mes",
    area: "Objetivos",
    nome: "Quanto Guardar Por Mês",
    icone: Target,
    nova: true,
    desc: "Você diz o que quer e para quando. Ele diz quanto precisa guardar todo mês.",
    como: "Serve para viagem, entrada do imóvel, festa, qualquer coisa com data.",
    opcionais: ["ja"],
    campos: {
      alvo: money("Quanto custa", 30000),
      pz: prazo("Falta quanto tempo", 24, "meses"),
      ja: money("Quanto já tem para isso", 5000),
      r: juro("Quanto seu dinheiro rende", 11, "ano"),
    },
    calc: (v) => {
      const i = iMes(v.r);
      const n = nMes(v.pz);
      const fut = v.ja * Math.pow(1 + i, n);
      const falta = Math.max(v.alvo - fut, 0);
      const pmt = i <= 0 ? falta / n : (falta * i) / (Math.pow(1 + i, n) - 1);
      const sem = (v.alvo - v.ja) / n;
      return {
        tom: "is-good",
        k: "Guarde por mês",
        val: BRL(pmt),
        sub:
          falta <= 0
            ? "O que você já tem, rendendo, chega lá sozinho. Não precisa guardar mais nada."
            : `Em ${n} meses você chega nos ${BRL(v.alvo, 0)}. Deixando render, você guarda ${BRL(Math.max(sem - pmt, 0))} a menos por mês do que guardaria embaixo do colchão.`,
        rows: [
          ["Você quer", BRL(v.alvo, 0)],
          ["Já tem", BRL(v.ja, 0)],
          ["Guardando por mês", BRL(pmt), "hl"],
          ["Sem render nada seria", BRL(Math.max(sem, 0))],
        ],
        nota: "Se o valor por mês não couber no seu orçamento, só existem três saídas: adiar a data, baixar o alvo ou aumentar a renda.",
        gat: {
          titulo: "O valor por mês está claro. Encaixar ele no orçamento, não.",
          corpo:
            "Esse objetivo disputa espaço com a reserva, com a dívida e com a aposentadoria. Sozinho ele cabe; junto com os outros, quase nunca.",
          nivel: "Reunião ilimitada desde o Nível I para colocar todos os objetivos na mesma mesa.",
          botao: "Quero ver isso junto com o resto",
        },
      };
    },
  },
  {
    id: "curso",
    slug: "curso-se-paga",
    area: "Objetivos",
    nome: "Esse Curso Se Paga?",
    icone: GraduationCap,
    nova: true,
    desc: "Diz em quantos meses o aumento de salário cobre o que você gastou estudando.",
    como: "Compare o custo do curso com o quanto você espera ganhar depois.",
    campos: {
      c: money("Quanto custa o curso", 12000),
      hj: money("Quanto você ganha hoje por mês", 4000),
      dp: money("Quanto espera ganhar depois", 5500),
    },
    calc: (v) => {
      const g = v.dp - v.hj;
      const m = g > 0 ? Math.ceil(v.c / g) : 0;
      return {
        tom: g <= 0 ? "is-bad" : m <= 24 ? "is-good" : "is-warn",
        k: g <= 0 ? "Esse curso não se paga" : "Se paga em",
        val: g <= 0 ? "—" : m + (m === 1 ? " mês" : " meses"),
        sub:
          g <= 0
            ? "Sem aumento de renda, o curso é gasto e não investimento. Pode valer por outros motivos, mas não por dinheiro."
            : `Depois disso, os ${BRL(g)} a mais por mês são lucro. Em 5 anos, o curso terá te dado ${BRL(g * 60 - v.c, 0)} líquidos.`,
        rows: [
          ["Custo do curso", BRL(v.c, 0)],
          ["Aumento esperado", BRL(g) + " / mês"],
          ["Tempo para se pagar", g <= 0 ? "—" : m + " meses", "hl"],
        ],
        nota: "O aumento esperado é a parte que costuma estar errada. Confirme com gente que já fez o curso, não com quem vende o curso.",
        gat: {
          titulo: "A conta se paga. A premissa é que precisa passar por conferência.",
          corpo:
            "O aumento que você colocou é o que o mercado paga mesmo? Existe caminho mais barato para o mesmo salto?",
          nivel: "Traga isso para a reunião antes de assinar a matrícula. Nível I já cobre.",
          botao: "Quero conferir antes de me matricular",
        },
      };
    },
  },

  /* ── Renda ──────────────────────────────────────────── */
  {
    id: "cltpj",
    slug: "clt-ou-pj",
    area: "Renda",
    nome: "Seu CLT Vale Quanto em PJ?",
    icone: Briefcase,
    nova: true,
    desc: "Traduz seu salário de carteira assinada para o valor equivalente como PJ.",
    como: "Carteira assinada tem 13º, férias e FGTS que o PJ não tem.",
    opcionais: ["ben", "imp"],
    campos: {
      sal: money("Seu salário na carteira", 5000),
      ben: money("Vale-refeição, plano e outros por mês", 900),
      imp: qtd("Imposto que você pagaria como PJ", 10, "%"),
    },
    calc: (v) => {
      const extra = 1 / 12 + 1.3333 / 12 + 0.08;
      const clt = v.sal * (1 + extra) + v.ben;
      const pj = v.imp < 100 ? clt / (1 - v.imp / 100) : 0;
      return {
        k: "Como PJ, você precisa cobrar",
        val: BRL(pj, 0) + " / mês",
        sub: `Seu CLT de ${BRL(v.sal, 0)} vale ${BRL(clt, 0)} por mês quando você soma 13º, férias, FGTS e benefícios. Cobrando menos que ${BRL(pj, 0)}, você perdeu dinheiro.`,
        rows: [
          ["Salário", BRL(v.sal, 0)],
          ["13º, férias e FGTS", BRL(v.sal * extra, 0)],
          ["Benefícios", BRL(v.ben, 0)],
          ["Valor real do seu CLT", BRL(clt, 0)],
          ["Precisa cobrar como PJ", BRL(pj, 0), "hl"],
        ],
        nota: "E ainda falta o que o CLT te dá de graça: seguro-desemprego, estabilidade na doença e aviso prévio. Isso não entra na conta, mas entra na vida.",
        gat: {
          titulo: "O número mínimo está claro. A decisão é maior que ele.",
          corpo:
            "Vira reserva maior, INSS por conta, contador, férias não pagas e mês sem cliente. O número certo protege tudo isso.",
          nivel: "A partir do Nível III, acompanhamos a conversa com contador e com a empresa.",
          botao: "Quero fazer essa transição com apoio",
        },
      };
    },
  },

  /* ── Aposentadoria ──────────────────────────────────── */
  {
    id: "previdencia",
    slug: "previdencia-vale-a-pena",
    area: "Aposentadoria",
    nome: "A Previdência do Banco Vale?",
    icone: Coins,
    nova: true,
    desc: "Responde se o PGBL te dá desconto no imposto ou se o gerente está te empurrando o produto errado.",
    como: "PGBL só vale para quem declara no modelo completo.",
    campos: {
      comp: opt("Você declara imposto no modelo completo?", "sim", [
        ["sim", "Sim"],
        ["nao", "Não, ou sou isento"],
      ]),
      inss: opt("Contribui para o INSS?", "sim", [
        ["sim", "Sim"],
        ["nao", "Não"],
      ]),
      renda: money("Sua renda por ano", 96000),
      ap: money("Quanto pretende guardar por ano", 12000),
    },
    calc: (v) => {
      const vale = v.comp === "sim" && v.inss === "sim";
      const teto = v.renda * 0.12;
      const ded = Math.min(v.ap, teto);
      const eco = ded * 0.275;
      return {
        tom: vale ? "is-good" : "is-bad",
        k: vale ? "PGBL vale para você" : "PGBL não vale para você",
        val: vale ? BRL(eco, 0) + " / ano" : "VGBL, se algum",
        sub: vale
          ? `Guardando ${BRL(ded, 0)} em PGBL, você adia esse imposto todo ano. O limite é 12% da sua renda, ou ${BRL(teto, 0)}.`
          : v.comp !== "sim"
            ? "Quem declara no simplificado ou é isento não aproveita a dedução. Nesse caso o PGBL só atrapalha."
            : "Sem contribuir para o INSS, a dedução do PGBL não se aplica. Nesse caso, olhe VGBL ou investimento comum.",
        rows: [
          ["Limite dedutível (12%)", BRL(teto, 0)],
          ["Você guardaria", BRL(v.ap, 0)],
          [vale ? "Imposto adiado por ano" : "Vantagem fiscal", vale ? BRL(eco, 0) : "nenhuma", "hl"],
        ],
        nota: "Adiar imposto não é o mesmo que não pagar: no resgate ele volta. A vantagem é o dinheiro render enquanto isso.",
        gat: {
          titulo: "A resposta do PGBL está aqui. O produto certo, não.",
          corpo:
            "Taxa de administração, taxa de carregamento e tabela regressiva mudam o resultado mais que a escolha entre PGBL e VGBL.",
          nivel: "A partir do Nível II, a gente compara os planos disponíveis para você.",
          botao: "Quero comparar os planos de verdade",
        },
      };
    },
  },
  {
    id: "oraculo",
    slug: "oraculo",
    area: "Aposentadoria",
    nome: "O Oráculo Financeiro",
    icone: LineChart,
    custom: "oraculo",
    desc: "Projeta seu patrimônio em gráfico e deixa você encaixar objetivos que sacam dinheiro no meio do caminho.",
    como: "Veja a curva e adicione objetivos para ver o estrago de cada um.",
  },

  /* ── Investimentos ──────────────────────────────────── */
  {
    id: "ativos",
    slug: "comparador-ativos",
    area: "Investimentos",
    nome: "Comparador de Ativos",
    icone: BarChart3,
    desc: "Põe dois investimentos lado a lado e mostra com quanto cada um termina, já com imposto descontado.",
    como: "Compare o mesmo dinheiro no mesmo prazo, líquido de imposto.",
    campos: {
      v0: money("Quanto vai investir", 20000),
      pz: prazo("Por quanto tempo", 5, "anos"),
      a: juro("Investimento A rende", 10.5, "ano"),
      ta: opt("A paga imposto?", "sim", [
        ["sim", "Sim (CDB, Tesouro, fundo)"],
        ["nao", "Não (LCI, LCA, poupança)"],
      ]),
      b: juro("Investimento B rende", 12.2, "ano"),
      tb: opt("B paga imposto?", "sim", [
        ["sim", "Sim (CDB, Tesouro, fundo)"],
        ["nao", "Não (LCI, LCA, poupança)"],
      ]),
    },
    calc: (v) => {
      const n = nMes(v.pz);
      const aliq = aliqIR(n);
      const bruto = (j: any) => v.v0 * Math.pow(1 + iMes(j), n);
      const liq = (j: any, paga: string) => {
        const B = bruto(j);
        return paga === "sim" ? B - (B - v.v0) * aliq : B;
      };
      const fa = liq(v.a, v.ta);
      const fb = liq(v.b, v.tb);
      const A = fa >= fb;
      const impA = v.ta === "sim" ? (bruto(v.a) - v.v0) * aliq : 0;
      const impB = v.tb === "sim" ? (bruto(v.b) - v.v0) * aliq : 0;
      return {
        tom: "is-good",
        k: "Termina com mais",
        val: A ? "Investimento A" : "Investimento B",
        sub: `Diferença de ${BRL(Math.abs(fa - fb), 0)} depois do imposto, em ${NUM(n / 12, 1)} anos. A alíquota nesse prazo é ${NUM(aliq * 100, 1)}% sobre o lucro.`,
        rows: [
          ["A · bruto", BRL(bruto(v.a), 0), "dim"],
          ["A · imposto", impA > 0 ? "− " + BRL(impA, 0) : "isento", "dim"],
          ["A · líquido", BRL(fa, 0), A ? "hl" : "dim"],
          ["B · bruto", BRL(bruto(v.b), 0), "dim"],
          ["B · imposto", impB > 0 ? "− " + BRL(impB, 0) : "isento", "dim"],
          ["B · líquido", BRL(fb, 0), A ? "dim" : "hl"],
        ],
        nota: "A alíquota cai conforme o tempo: 22,5% até 6 meses, 20% até 1 ano, 17,5% até 2 anos e 15% depois disso. Por isso resgatar cedo custa caro.",
        gat: {
          titulo: "O rendimento está comparado. A carteira é outra história.",
          corpo:
            "Nenhum ativo é bom sozinho. Depende de quando você precisa do dinheiro, de quanto risco aguenta e do que já tem.",
          nivel:
            "Alocação de ativos está no escopo desde o Nível I, sem comissão sobre nada que indicamos.",
          botao: "Quero montar a carteira, não escolher um ativo",
        },
      };
    },
  },

  /* ── Imposto e herança ──────────────────────────────── */
  {
    id: "irpf",
    slug: "declaracao-simples-ou-completa",
    area: "Imposto e herança",
    nome: "Declaração: Simples ou Completa?",
    icone: Receipt,
    nova: true,
    desc: "Soma suas deduções aplicando o teto de cada uma e diz qual modelo deixa mais dinheiro com você.",
    como: "Cada dedução tem um limite. A ferramenta corta o que passa do teto.",
    opcionais: ["dep", "edu", "sau", "inss", "pgbl"],
    campos: {
      renda: money("Sua renda tributável no ano", 96000),
      dep: qtd("Quantos dependentes", 1, "pessoas"),
      edu: money("Educação no ano (você e dependentes)", 6000),
      sau: money("Saúde no ano (sem limite)", 4200),
      inss: money("INSS ou previdência oficial no ano", 7200),
      pgbl: money("PGBL no ano", 0, true),
    },
    calc: (v) => {
      const LIM_SIMPL = 16754.34;
      const LIM_DEP = 2275.08;
      const LIM_EDU = 3561.5;
      const simpl = Math.min(v.renda * 0.2, LIM_SIMPL);
      const tetoEdu = LIM_EDU * (1 + v.dep);
      const tetoPgbl = v.renda * 0.12;
      const dDep = v.dep * LIM_DEP;
      const dEdu = Math.min(v.edu, tetoEdu);
      const dPgbl = Math.min(v.pgbl, tetoPgbl);
      const total = dDep + dEdu + v.sau + v.inss + dPgbl;
      const completa = total > simpl;
      const dif = Math.abs(total - simpl);
      const cortes: string[] = [];
      if (v.edu > tetoEdu) cortes.push("educação (" + BRL(v.edu - tetoEdu, 0) + " acima do teto)");
      if (v.pgbl > tetoPgbl) cortes.push("PGBL (" + BRL(v.pgbl - tetoPgbl, 0) + " acima do teto)");
      return {
        tom: "is-good",
        k: "Escolha a declaração",
        val: completa ? "Completa" : "Simplificada",
        sub: completa
          ? `Suas deduções abatem ${BRL(dif, 0)} a mais que o desconto automático — cerca de ${BRL(dif * 0.275, 0)} a menos de imposto.`
          : `O desconto automático de ${BRL(simpl, 0)} é maior que suas deduções. A simplificada te dá ${BRL(dif, 0)} a mais de abatimento, sem trabalho nenhum.`,
        rows: [
          [
            "Desconto automático · 20%, teto " + BRL(LIM_SIMPL, 0),
            BRL(simpl, 0),
            completa ? "dim" : "hl",
          ],
          ["Dependentes · " + BRL(LIM_DEP, 2) + " cada", BRL(dDep, 0), "dim"],
          ["Educação · teto " + BRL(tetoEdu, 0), BRL(dEdu, 0), "dim"],
          ["Saúde · sem limite", BRL(v.sau, 0), "dim"],
          ["INSS · sem limite", BRL(v.inss, 0), "dim"],
          ["PGBL · teto 12% = " + BRL(tetoPgbl, 0), BRL(dPgbl, 0), "dim"],
          ["Soma das suas deduções", BRL(total, 0), completa ? "hl" : "dim"],
        ],
        nota: cortes.length
          ? "Cortei o que passou do limite: " +
            cortes.join(" e ") +
            ". Declarar acima do teto não aumenta a restituição e chama atenção da malha fina."
          : "Os tetos mudam todo ano. Estes são os mais recentes — na hora de declarar, confirme os valores vigentes.",
        gat: {
          titulo: "O modelo está escolhido. O que dá para abater, não.",
          corpo:
            "Muita gente deixa dinheiro na mesa por não saber o que pode entrar: pensão judicial, plano de saúde do dependente, despesa médica de anos anteriores.",
          nivel: "Otimização de imposto está no escopo desde o Nível I.",
          botao: "Quero revisar o que posso abater",
        },
      };
    },
  },
  {
    id: "inventario",
    slug: "custo-de-inventario",
    area: "Imposto e herança",
    nome: "O Custo de Deixar Para os Seus",
    icone: Heart,
    nova: true,
    desc: "Mostra quanto sua família gastaria em imposto e cartório para receber o que é seu.",
    como: "Herança tem imposto do estado e custas de cartório.",
    campos: {
      pat: money("Quanto você tem em bens e dinheiro", 500000),
      al: qtd("Imposto de herança do seu estado", 8, "%"),
    },
    calc: (v) => {
      const it = (v.pat * v.al) / 100;
      const cu = v.pat * 0.03;
      const tot = it + cu;
      return {
        tom: "is-bad",
        k: "Sua família precisaria pagar",
        val: BRL(tot, 0),
        sub: `E precisaria pagar em dinheiro, antes de receber qualquer bem. Se o patrimônio for um imóvel, alguém tem que tirar ${BRL(tot, 0)} do próprio bolso.`,
        rows: [
          ["Imposto de herança", BRL(it, 0)],
          ["Cartório e advogado", BRL(cu, 0)],
          ["Total, à vista", BRL(tot, 0), "hl"],
        ],
        nota: "O imposto varia de 2% a 8% conforme o estado. Em vários deles a alíquota subiu recentemente.",
        gat: {
          titulo: "O custo está calculado. Reduzir ele é que é o trabalho.",
          corpo:
            "Existem caminhos legais para diminuir isso e para deixar o dinheiro disponível na hora — doação em vida, seguro, holding familiar.",
          nivel: "Planejamento sucessório está no escopo desde o Nível I.",
          botao: "Quero organizar isso enquanto dá tempo",
        },
      };
    },
  },
];

export const porSlug = (slug: string): Ferramenta | undefined =>
  FERRAMENTAS.find((f) => f.slug === slug);
