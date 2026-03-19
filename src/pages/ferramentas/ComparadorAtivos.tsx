import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, formatCurrencyInput, parseCurrency } from "@/lib/formatters";
import {
  ArrowLeft,
  BarChart3,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  Info,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type TipoAtivo = "pre" | "pos" | "hibrido";
type TipoTaxa = "anual" | "mensal";

interface AtivoConfig {
  nome: string;
  tipo: TipoAtivo;
  taxa: string;
  tipoTaxa: TipoTaxa;
  indexador: string;
  percentualIndexador: string;
}

interface IndexadorData {
  nome: string;
  sigla: string;
  valorAnual: number | null;
  valorMensal: number | null;
  fonte: string;
  atualizadoEm: string;
  editavel: boolean;
  valorCustom: string;
}

// ─── Indexadores disponíveis ──────────────────────────────────────────────────

const INDEXADORES_INICIAIS: Record<string, IndexadorData> = {
  CDI: {
    nome: "CDI",
    sigla: "CDI",
    valorAnual: null,
    valorMensal: null,
    fonte: "Banco Central",
    atualizadoEm: "—",
    editavel: false,
    valorCustom: "",
  },
  SELIC: {
    nome: "SELIC",
    sigla: "SELIC",
    valorAnual: null,
    valorMensal: null,
    fonte: "Banco Central",
    atualizadoEm: "—",
    editavel: false,
    valorCustom: "",
  },
  IPCA: {
    nome: "IPCA",
    sigla: "IPCA",
    valorAnual: null,
    valorMensal: null,
    fonte: "IBGE / BCB",
    atualizadoEm: "—",
    editavel: false,
    valorCustom: "",
  },
  "IGP-M": {
    nome: "IGP-M",
    sigla: "IGP-M",
    valorAnual: null,
    valorMensal: null,
    fonte: "FGV / BCB",
    atualizadoEm: "—",
    editavel: false,
    valorCustom: "",
  },
  "USD/BRL": {
    nome: "Dólar (USD/BRL)",
    sigla: "USD/BRL",
    valorAnual: null,
    valorMensal: null,
    fonte: "Banco Central",
    atualizadoEm: "—",
    editavel: false,
    valorCustom: "",
  },
  "EUR/BRL": {
    nome: "Euro (EUR/BRL)",
    sigla: "EUR/BRL",
    valorAnual: null,
    valorMensal: null,
    fonte: "Banco Central",
    atualizadoEm: "—",
    editavel: false,
    valorCustom: "",
  },
  IBOV: {
    nome: "Ibovespa (IBOV)",
    sigla: "IBOV",
    valorAnual: null,
    valorMensal: null,
    fonte: "B3",
    atualizadoEm: "—",
    editavel: true,
    valorCustom: "",
  },
  IBrX: {
    nome: "IBrX 100",
    sigla: "IBrX",
    valorAnual: null,
    valorMensal: null,
    fonte: "B3",
    atualizadoEm: "—",
    editavel: true,
    valorCustom: "",
  },
  IFIX: {
    nome: "IFIX",
    sigla: "IFIX",
    valorAnual: null,
    valorMensal: null,
    fonte: "B3",
    atualizadoEm: "—",
    editavel: true,
    valorCustom: "",
  },
  "IMA-B": {
    nome: "IMA-B",
    sigla: "IMA-B",
    valorAnual: null,
    valorMensal: null,
    fonte: "ANBIMA",
    atualizadoEm: "—",
    editavel: true,
    valorCustom: "",
  },
  "IMA-S": {
    nome: "IMA-S",
    sigla: "IMA-S",
    valorAnual: null,
    valorMensal: null,
    fonte: "ANBIMA",
    atualizadoEm: "—",
    editavel: true,
    valorCustom: "",
  },
  "IRF-M": {
    nome: "IRF-M",
    sigla: "IRF-M",
    valorAnual: null,
    valorMensal: null,
    fonte: "ANBIMA",
    atualizadoEm: "—",
    editavel: true,
    valorCustom: "",
  },
  IDA: {
    nome: "IDA (ANBIMA)",
    sigla: "IDA",
    valorAnual: null,
    valorMensal: null,
    fonte: "ANBIMA",
    atualizadoEm: "—",
    editavel: true,
    valorCustom: "",
  },
  "S&P 500": {
    nome: "S&P 500",
    sigla: "S&P 500",
    valorAnual: null,
    valorMensal: null,
    fonte: "NYSE",
    atualizadoEm: "—",
    editavel: true,
    valorCustom: "",
  },
  "MSCI World": {
    nome: "MSCI World",
    sigla: "MSCI World",
    valorAnual: null,
    valorMensal: null,
    fonte: "MSCI",
    atualizadoEm: "—",
    editavel: true,
    valorCustom: "",
  },
};

// ─── Helpers de cálculo ───────────────────────────────────────────────────────

function taxaDiariaParaAnual(diaria: number): number {
  return (Math.pow(1 + diaria / 100, 252) - 1) * 100;
}

function taxaMensalParaAnual(mensal: number): number {
  return (Math.pow(1 + mensal / 100, 12) - 1) * 100;
}

function taxaAnualParaMensal(anual: number): number {
  return (Math.pow(1 + anual / 100, 1 / 12) - 1) * 100;
}

function calcularMontante(
  principal: number,
  taxaAnualPct: number,
  meses: number,
  imposto: number
): { bruto: number; liquido: number; rendimentoBruto: number; rendimentoLiquido: number } {
  const taxaMensal = taxaAnualParaMensal(taxaAnualPct) / 100;
  const montanteBruto = principal * Math.pow(1 + taxaMensal, meses);
  const rendimentoBruto = montanteBruto - principal;
  const rendimentoLiquido = rendimentoBruto * (1 - imposto / 100);
  const montanteLiquido = principal + rendimentoLiquido;
  return {
    bruto: montanteBruto,
    liquido: montanteLiquido,
    rendimentoBruto,
    rendimentoLiquido,
  };
}

function gerarDadosGrafico(
  principal: number,
  taxaAnualA: number,
  taxaAnualB: number,
  meses: number,
  impostoA: number,
  impostoB: number
) {
  const taxaMensalA = taxaAnualParaMensal(taxaAnualA) / 100;
  const taxaMensalB = taxaAnualParaMensal(taxaAnualB) / 100;
  const data = [];

  for (let m = 0; m <= meses; m++) {
    const brutoA = principal * Math.pow(1 + taxaMensalA, m);
    const brutoB = principal * Math.pow(1 + taxaMensalB, m);
    const rendA = brutoA - principal;
    const rendB = brutoB - principal;
    const liqA = principal + rendA * (1 - impostoA / 100);
    const liqB = principal + rendB * (1 - impostoB / 100);

    const label =
      m === 0
        ? "Início"
        : m % 12 === 0
        ? `${m / 12}a`
        : meses <= 24
        ? `${m}m`
        : null;

    if (label !== null) {
      data.push({
        label,
        "Ativo A (líq.)": Math.round(liqA),
        "Ativo B (líq.)": Math.round(liqB),
        "Ativo A (bruto)": Math.round(brutoA),
        "Ativo B (bruto)": Math.round(brutoB),
      });
    }
  }
  return data;
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function ComparadorAtivos() {
  const [indexadores, setIndexadores] = useState<Record<string, IndexadorData>>(
    INDEXADORES_INICIAIS
  );
  const [carregando, setCarregando] = useState(false);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<string>("—");

  // Parâmetros gerais
  const [valorInvestido, setValorInvestido] = useState("");
  const [prazoMeses, setPrazoMeses] = useState("12");
  const [viewGrafico, setViewGrafico] = useState<"area" | "bar">("area");

  // Ativo A
  const [ativoA, setAtivoA] = useState<AtivoConfig>({
    nome: "Ativo A",
    tipo: "pre",
    taxa: "",
    tipoTaxa: "anual",
    indexador: "CDI",
    percentualIndexador: "100",
  });
  const [impostoA, setImpostoA] = useState("15");

  // Ativo B
  const [ativoB, setAtivoB] = useState<AtivoConfig>({
    nome: "Ativo B",
    tipo: "pos",
    taxa: "",
    tipoTaxa: "anual",
    indexador: "CDI",
    percentualIndexador: "110",
  });
  const [impostoB, setImpostoB] = useState("15");

  const [resultado, setResultado] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  // ── Buscar indexadores do BCB ──────────────────────────────────────────────

  const buscarIndexadores = useCallback(async () => {
    setCarregando(true);
    const now = new Date().toLocaleString("pt-BR");

    const bcbFetch = async (codigo: number) => {
      try {
        const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${codigo}/dados/ultimos/1?formato=json`;
        const res = await fetch(url);
        const data = await res.json();
        return parseFloat(data[0]?.valor ?? "0");
      } catch {
        return null;
      }
    };

    // CDI diário → anual
    const cdiDiario = await bcbFetch(12);
    // SELIC diário → anual
    const selicDiario = await bcbFetch(11);
    // IPCA mensal (últimos 12 meses para acumulado)
    let ipcaAnual: number | null = null;
    let ipcaMensal: number | null = null;
    try {
      const res = await fetch(
        "https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/12?formato=json"
      );
      const data = await res.json();
      ipcaMensal = parseFloat(data[data.length - 1]?.valor ?? "0");
      ipcaAnual =
        (data.reduce(
          (acc: number, d: any) => acc * (1 + parseFloat(d.valor) / 100),
          1
        ) -
          1) *
        100;
    } catch {}

    // IGP-M mensal (últimos 12)
    let igpmAnual: number | null = null;
    let igpmMensal: number | null = null;
    try {
      const res = await fetch(
        "https://api.bcb.gov.br/dados/serie/bcdata.sgs.189/dados/ultimos/12?formato=json"
      );
      const data = await res.json();
      igpmMensal = parseFloat(data[data.length - 1]?.valor ?? "0");
      igpmAnual =
        (data.reduce(
          (acc: number, d: any) => acc * (1 + parseFloat(d.valor) / 100),
          1
        ) -
          1) *
        100;
    } catch {}

    // USD/BRL variação 12 meses
    let usdAnual: number | null = null;
    let usdMensal: number | null = null;
    try {
      const res = await fetch(
        "https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados/ultimos/13?formato=json"
      );
      const data = await res.json();
      if (data.length >= 2) {
        const primeiro = parseFloat(data[0].valor);
        const ultimo = parseFloat(data[data.length - 1].valor);
        usdAnual = ((ultimo / primeiro - 1) * 100);
        usdMensal = taxaAnualParaMensal(usdAnual);
      }
    } catch {}

    // EUR/BRL variação 12 meses
    let eurAnual: number | null = null;
    let eurMensal: number | null = null;
    try {
      const res = await fetch(
        "https://api.bcb.gov.br/dados/serie/bcdata.sgs.21619/dados/ultimos/13?formato=json"
      );
      const data = await res.json();
      if (data.length >= 2) {
        const primeiro = parseFloat(data[0].valor);
        const ultimo = parseFloat(data[data.length - 1].valor);
        eurAnual = ((ultimo / primeiro - 1) * 100);
        eurMensal = taxaAnualParaMensal(eurAnual);
      }
    } catch {}

    setIndexadores((prev) => ({
      ...prev,
      CDI: {
        ...prev.CDI,
        valorAnual: cdiDiario !== null ? taxaDiariaParaAnual(cdiDiario) : null,
        valorMensal:
          cdiDiario !== null
            ? taxaAnualParaMensal(taxaDiariaParaAnual(cdiDiario))
            : null,
        atualizadoEm: now,
      },
      SELIC: {
        ...prev.SELIC,
        valorAnual:
          selicDiario !== null ? taxaDiariaParaAnual(selicDiario) : null,
        valorMensal:
          selicDiario !== null
            ? taxaAnualParaMensal(taxaDiariaParaAnual(selicDiario))
            : null,
        atualizadoEm: now,
      },
      IPCA: {
        ...prev.IPCA,
        valorAnual: ipcaAnual,
        valorMensal: ipcaMensal,
        atualizadoEm: now,
      },
      "IGP-M": {
        ...prev["IGP-M"],
        valorAnual: igpmAnual,
        valorMensal: igpmMensal,
        atualizadoEm: now,
      },
      "USD/BRL": {
        ...prev["USD/BRL"],
        valorAnual: usdAnual,
        valorMensal: usdMensal,
        atualizadoEm: now,
      },
      "EUR/BRL": {
        ...prev["EUR/BRL"],
        valorAnual: eurAnual,
        valorMensal: eurMensal,
        atualizadoEm: now,
      },
    }));

    setUltimaAtualizacao(now);
    setCarregando(false);
  }, []);

  useEffect(() => {
    buscarIndexadores();
  }, [buscarIndexadores]);

  // ── Calcular taxa efetiva do ativo ────────────────────────────────────────

  function calcularTaxaEfetivaAnual(ativo: AtivoConfig): number | null {
    const taxaNum = parseFloat(ativo.taxa.replace(",", "."));

    if (ativo.tipo === "pre") {
      if (isNaN(taxaNum)) return null;
      return ativo.tipoTaxa === "anual"
        ? taxaNum
        : taxaMensalParaAnual(taxaNum);
    }

    const idx = indexadores[ativo.indexador];
    const valorIdx =
      idx?.valorCustom
        ? parseFloat(idx.valorCustom.replace(",", "."))
        : idx?.valorAnual;

    if (valorIdx === null || valorIdx === undefined) return null;

    if (ativo.tipo === "pos") {
      const pct = parseFloat(ativo.percentualIndexador.replace(",", ".")) / 100;
      return valorIdx * pct;
    }

    if (ativo.tipo === "hibrido") {
      if (isNaN(taxaNum)) return null;
      const spread = ativo.tipoTaxa === "anual" ? taxaNum : taxaMensalParaAnual(taxaNum);
      return (1 + valorIdx / 100) * (1 + spread / 100) * 100 - 100;
    }

    return null;
  }

  // ── Comparar ──────────────────────────────────────────────────────────────

  const comparar = () => {
    const principal = parseCurrency(valorInvestido);
    const meses = parseInt(prazoMeses) || 12;
    const impA = parseFloat(impostoA.replace(",", ".")) || 0;
    const impB = parseFloat(impostoB.replace(",", ".")) || 0;

    const taxaA = calcularTaxaEfetivaAnual(ativoA);
    const taxaB = calcularTaxaEfetivaAnual(ativoB);

    if (!principal || taxaA === null || taxaB === null) return;

    const resA = calcularMontante(principal, taxaA, meses, impA);
    const resB = calcularMontante(principal, taxaB, meses, impB);

    setResultado({ taxaA, taxaB, resA, resB, principal, meses, impA, impB });
    setChartData(gerarDadosGrafico(principal, taxaA, taxaB, meses, impA, impB));
  };

  // ── Helpers de UI ─────────────────────────────────────────────────────────

  const fmtPct = (v: number | null, d = 2) =>
    v === null ? "—" : `${v.toFixed(d)}%`;

  const INDEXADORES_LISTA = Object.keys(indexadores);

  const getValorIndexador = (sigla: string) => {
    const idx = indexadores[sigla];
    if (!idx) return null;
    if (idx.valorCustom) return parseFloat(idx.valorCustom.replace(",", "."));
    return idx.valorAnual;
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/ferramentas">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-yellow-400" /> Comparador de Ativos
          </h1>
          <p className="text-muted-foreground">
            Compare dois investimentos lado a lado e descubra qual rende mais no seu prazo.
          </p>
        </div>
      </div>

      {/* Painel de Indexadores */}
      <Card className="bg-card/50 border-white/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-yellow-400 flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5" /> Indexadores de Referência
            </CardTitle>
            <div className="flex items-center gap-3">
              {ultimaAtualizacao !== "—" && (
                <span className="text-xs text-muted-foreground">
                  Atualizado: {ultimaAtualizacao}
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={buscarIndexadores}
                disabled={carregando}
                className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 text-xs"
              >
                <RefreshCw
                  className={`h-3 w-3 mr-1 ${carregando ? "animate-spin" : ""}`}
                />
                {carregando ? "Buscando..." : "Atualizar"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">
                    Indexador
                  </th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">
                    a.a.
                  </th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">
                    a.m.
                  </th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">
                    Fonte
                  </th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">
                    Valor manual (a.a. %)
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.values(indexadores).map((idx) => (
                  <tr
                    key={idx.sigla}
                    className="border-b border-white/5 hover:bg-white/2"
                  >
                    <td className="py-2 px-3 font-medium text-white">
                      {idx.nome}
                    </td>
                    <td className="py-2 px-3 text-right">
                      {idx.valorCustom ? (
                        <span className="text-yellow-400">
                          {parseFloat(idx.valorCustom.replace(",", ".")).toFixed(2)}%
                        </span>
                      ) : idx.valorAnual !== null ? (
                        <span className="text-green-400">
                          {fmtPct(idx.valorAnual)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-right text-muted-foreground">
                      {idx.valorCustom ? (
                        fmtPct(
                          taxaAnualParaMensal(
                            parseFloat(idx.valorCustom.replace(",", "."))
                          ),
                          4
                        )
                      ) : idx.valorMensal !== null ? (
                        fmtPct(idx.valorMensal, 4)
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-2 px-3 text-xs text-muted-foreground">
                      {idx.fonte}
                    </td>
                    <td className="py-2 px-3">
                      <Input
                        type="number"
                        placeholder={
                          idx.editavel ? "Ex: 12,5" : "Auto"
                        }
                        value={idx.valorCustom}
                        onChange={(e) =>
                          setIndexadores((prev) => ({
                            ...prev,
                            [idx.sigla]: {
                              ...prev[idx.sigla],
                              valorCustom: e.target.value,
                            },
                          }))
                        }
                        className="bg-background/50 border-white/10 h-7 text-xs w-28"
                        step="0.01"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
            <Info className="h-3 w-3" />
            CDI, SELIC, IPCA, IGP-M, USD e EUR são buscados automaticamente do Banco Central.
            Os demais podem ser preenchidos manualmente. O campo manual sobrescreve o valor automático.
          </p>
        </CardContent>
      </Card>

      {/* Parâmetros gerais */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">
              Parâmetros Gerais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Valor Investido (R$)</Label>
              <Input
                type="text"
                placeholder="R$ 0,00"
                value={valorInvestido}
                onChange={(e) =>
                  setValorInvestido(formatCurrencyInput(e.target.value))
                }
                className="bg-background/50 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Prazo de Aplicação (meses)</Label>
              <Input
                type="number"
                placeholder="Ex: 24"
                value={prazoMeses}
                onChange={(e) => setPrazoMeses(e.target.value)}
                className="bg-background/50 border-white/10"
                min={1}
                max={600}
              />
            </div>
          </CardContent>
        </Card>

        {/* Ativo A */}
        <AtivoForm
          titulo="Ativo A"
          cor="text-blue-400"
          corBorda="border-blue-500/30"
          ativo={ativoA}
          setAtivo={setAtivoA}
          imposto={impostoA}
          setImposto={setImpostoA}
          indexadoresList={INDEXADORES_LISTA}
          getValorIndexador={getValorIndexador}
        />
      </div>

      {/* Ativo B */}
      <AtivoForm
        titulo="Ativo B"
        cor="text-purple-400"
        corBorda="border-purple-500/30"
        ativo={ativoB}
        setAtivo={setAtivoB}
        imposto={impostoB}
        setImposto={setImpostoB}
        indexadoresList={INDEXADORES_LISTA}
        getValorIndexador={getValorIndexador}
      />

      {/* Botão comparar */}
      <Button
        onClick={comparar}
        className="w-full h-14 text-lg font-bold bg-yellow-500 hover:bg-yellow-400 text-black"
      >
        <BarChart3 className="h-5 w-5 mr-2" /> Comparar Ativos
      </Button>

      {/* Resultado */}
      {resultado && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          {/* Resumo */}
          <div className="grid md:grid-cols-2 gap-6">
            <ResultadoCard
              titulo={ativoA.nome || "Ativo A"}
              cor="blue"
              taxaEfetiva={resultado.taxaA}
              montanteBruto={resultado.resA.bruto}
              montanteLiquido={resultado.resA.liquido}
              rendimentoBruto={resultado.resA.rendimentoBruto}
              rendimentoLiquido={resultado.resA.rendimentoLiquido}
              principal={resultado.principal}
              imposto={resultado.impA}
              melhor={resultado.resA.liquido >= resultado.resB.liquido}
            />
            <ResultadoCard
              titulo={ativoB.nome || "Ativo B"}
              cor="purple"
              taxaEfetiva={resultado.taxaB}
              montanteBruto={resultado.resB.bruto}
              montanteLiquido={resultado.resB.liquido}
              rendimentoBruto={resultado.resB.rendimentoBruto}
              rendimentoLiquido={resultado.resB.rendimentoLiquido}
              principal={resultado.principal}
              imposto={resultado.impB}
              melhor={resultado.resB.liquido > resultado.resA.liquido}
            />
          </div>

          {/* Tabela comparativa */}
          <Card className="bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-base">
                Comparativo Detalhado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 px-3 text-muted-foreground">
                        Métrica
                      </th>
                      <th className="text-right py-2 px-3 text-blue-400">
                        {ativoA.nome || "Ativo A"}
                      </th>
                      <th className="text-right py-2 px-3 text-purple-400">
                        {ativoB.nome || "Ativo B"}
                      </th>
                      <th className="text-right py-2 px-3 text-muted-foreground">
                        Diferença
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        label: "Taxa efetiva a.a.",
                        a: `${resultado.taxaA.toFixed(4)}%`,
                        b: `${resultado.taxaB.toFixed(4)}%`,
                        diff:
                          resultado.taxaA > resultado.taxaB
                            ? `+${(resultado.taxaA - resultado.taxaB).toFixed(4)}% (A)`
                            : `+${(resultado.taxaB - resultado.taxaA).toFixed(4)}% (B)`,
                      },
                      {
                        label: "Taxa efetiva a.m.",
                        a: `${taxaAnualParaMensal(resultado.taxaA).toFixed(4)}%`,
                        b: `${taxaAnualParaMensal(resultado.taxaB).toFixed(4)}%`,
                        diff: "—",
                      },
                      {
                        label: "Montante bruto",
                        a: formatCurrency(resultado.resA.bruto),
                        b: formatCurrency(resultado.resB.bruto),
                        diff:
                          resultado.resA.bruto > resultado.resB.bruto
                            ? `+${formatCurrency(resultado.resA.bruto - resultado.resB.bruto)} (A)`
                            : `+${formatCurrency(resultado.resB.bruto - resultado.resA.bruto)} (B)`,
                      },
                      {
                        label: "Imposto estimado",
                        a: formatCurrency(
                          resultado.resA.rendimentoBruto * (resultado.impA / 100)
                        ),
                        b: formatCurrency(
                          resultado.resB.rendimentoBruto * (resultado.impB / 100)
                        ),
                        diff: "—",
                      },
                      {
                        label: "Montante líquido",
                        a: formatCurrency(resultado.resA.liquido),
                        b: formatCurrency(resultado.resB.liquido),
                        diff:
                          resultado.resA.liquido > resultado.resB.liquido
                            ? `+${formatCurrency(resultado.resA.liquido - resultado.resB.liquido)} (A)`
                            : `+${formatCurrency(resultado.resB.liquido - resultado.resA.liquido)} (B)`,
                      },
                      {
                        label: "Rendimento líquido",
                        a: formatCurrency(resultado.resA.rendimentoLiquido),
                        b: formatCurrency(resultado.resB.rendimentoLiquido),
                        diff: "—",
                      },
                      {
                        label: "Rentabilidade total líquida",
                        a: `${((resultado.resA.rendimentoLiquido / resultado.principal) * 100).toFixed(2)}%`,
                        b: `${((resultado.resB.rendimentoLiquido / resultado.principal) * 100).toFixed(2)}%`,
                        diff: "—",
                      },
                    ].map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-white/5 hover:bg-white/2"
                      >
                        <td className="py-2 px-3 text-muted-foreground">
                          {row.label}
                        </td>
                        <td className="py-2 px-3 text-right text-blue-300">
                          {row.a}
                        </td>
                        <td className="py-2 px-3 text-right text-purple-300">
                          {row.b}
                        </td>
                        <td className="py-2 px-3 text-right text-yellow-400 text-xs">
                          {row.diff}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico */}
          <Card className="bg-card/50 border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <CardTitle className="text-white text-base">
                  Evolução Patrimonial (Líquido)
                </CardTitle>
                <div className="flex p-1 bg-card/50 border border-white/10 rounded-lg">
                  <button
                    onClick={() => setViewGrafico("area")}
                    className={`px-4 py-1 rounded-md text-xs font-medium transition-all ${
                      viewGrafico === "area"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    Área
                  </button>
                  <button
                    onClick={() => setViewGrafico("bar")}
                    className={`px-4 py-1 rounded-md text-xs font-medium transition-all ${
                      viewGrafico === "bar"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    Barras
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                {viewGrafico === "area" ? (
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorB" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#c084fc" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#c084fc" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="label" tick={{ fill: "#6b7280", fontSize: 11 }} />
                    <YAxis
                      tick={{ fill: "#6b7280", fontSize: 11 }}
                      tickFormatter={(v) =>
                        v >= 1000000
                          ? `R$ ${(v / 1000000).toFixed(1)}M`
                          : `R$ ${(v / 1000).toFixed(0)}k`
                      }
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#0f1f14",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                      }}
                      formatter={(value: any) => formatCurrency(value)}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="Ativo A (líq.)"
                      stroke="#60a5fa"
                      fill="url(#colorA)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="Ativo B (líq.)"
                      stroke="#c084fc"
                      fill="url(#colorB)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                ) : (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="label" tick={{ fill: "#6b7280", fontSize: 11 }} />
                    <YAxis
                      tick={{ fill: "#6b7280", fontSize: 11 }}
                      tickFormatter={(v) =>
                        v >= 1000000
                          ? `R$ ${(v / 1000000).toFixed(1)}M`
                          : `R$ ${(v / 1000).toFixed(0)}k`
                      }
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#0f1f14",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                      }}
                      formatter={(value: any) => formatCurrency(value)}
                    />
                    <Legend />
                    <Bar dataKey="Ativo A (líq.)" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Ativo B (líq.)" fill="#c084fc" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="bg-card border border-white/10 rounded-xl p-6 space-y-4">
            <p className="text-sm font-semibold text-white">
              O que essa ferramenta não faz:
            </p>
            <p className="text-sm text-muted-foreground">
              Ela compara dois ativos com base nos números que você informa, mas não avalia{" "}
              <span className="text-white font-medium">
                se esses ativos fazem sentido para o seu perfil, prazo de vida, objetivos e
                tolerância a risco
              </span>
              . Um ativo que rende mais no papel pode ser o errado para o seu momento.
            </p>
            <p className="text-sm text-muted-foreground">
              Para saber qual investimento é o certo para{" "}
              <span className="text-white font-medium">
                a sua realidade, o seu objetivo e o seu momento de vida
              </span>
              , isso exige uma análise completa — não uma calculadora.
            </p>
            <Link href="/planos">
              <Button
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/10"
              >
                Quero saber qual investimento é certo para mim
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-componente: Formulário de Ativo ──────────────────────────────────────

function AtivoForm({
  titulo,
  cor,
  corBorda,
  ativo,
  setAtivo,
  imposto,
  setImposto,
  indexadoresList,
  getValorIndexador,
}: {
  titulo: string;
  cor: string;
  corBorda: string;
  ativo: AtivoConfig;
  setAtivo: (a: AtivoConfig) => void;
  imposto: string;
  setImposto: (v: string) => void;
  indexadoresList: string[];
  getValorIndexador: (s: string) => number | null;
}) {
  const valIdx = getValorIndexador(ativo.indexador);

  return (
    <Card className={`bg-card/50 border-white/10 ${corBorda}`}>
      <CardHeader className="pb-3">
        <CardTitle className={`${cor} text-base`}>{titulo}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Nome */}
        <div className="space-y-2">
          <Label>Nome do ativo (opcional)</Label>
          <Input
            placeholder={titulo}
            value={ativo.nome}
            onChange={(e) => setAtivo({ ...ativo, nome: e.target.value })}
            className="bg-background/50 border-white/10"
          />
        </div>

        {/* Tipo */}
        <div className="space-y-2">
          <Label>Tipo de rentabilidade</Label>
          <div className="flex p-1 bg-card/50 border border-white/10 rounded-lg w-full">
            {(
              [
                { v: "pre", l: "Pré-fixado" },
                { v: "pos", l: "Pós-fixado" },
                { v: "hibrido", l: "Híbrido" },
              ] as { v: TipoAtivo; l: string }[]
            ).map(({ v, l }) => (
              <button
                key={v}
                onClick={() => setAtivo({ ...ativo, tipo: v })}
                className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${
                  ativo.tipo === v
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Campos condicionais */}
        {ativo.tipo === "pre" && (
          <div className="space-y-2">
            <Label>Rentabilidade</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Ex: 12,5"
                value={ativo.taxa}
                onChange={(e) => setAtivo({ ...ativo, taxa: e.target.value })}
                className="bg-background/50 border-white/10 flex-1"
                step="0.01"
              />
              <div className="flex border border-white/10 rounded-lg overflow-hidden">
                {(["anual", "mensal"] as TipoTaxa[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setAtivo({ ...ativo, tipoTaxa: t })}
                    className={`px-3 py-2 text-xs font-medium transition-all ${
                      ativo.tipoTaxa === t
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-white bg-card/50"
                    }`}
                  >
                    {t === "anual" ? "a.a." : "a.m."}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {ativo.tipo === "pos" && (
          <>
            <div className="space-y-2">
              <Label>Indexador</Label>
              <select
                value={ativo.indexador}
                onChange={(e) => setAtivo({ ...ativo, indexador: e.target.value })}
                className="w-full bg-background/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white"
              >
                {indexadoresList.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {valIdx !== null && (
                <p className="text-xs text-muted-foreground">
                  {ativo.indexador} atual: {valIdx.toFixed(2)}% a.a.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>% do indexador</Label>
              <Input
                type="number"
                placeholder="Ex: 110"
                value={ativo.percentualIndexador}
                onChange={(e) =>
                  setAtivo({ ...ativo, percentualIndexador: e.target.value })
                }
                className="bg-background/50 border-white/10"
                step="0.1"
              />
              {valIdx !== null && ativo.percentualIndexador && (
                <p className="text-xs text-green-400">
                  Taxa efetiva:{" "}
                  {(
                    valIdx *
                    (parseFloat(ativo.percentualIndexador.replace(",", ".")) / 100)
                  ).toFixed(2)}
                  % a.a.
                </p>
              )}
            </div>
          </>
        )}

        {ativo.tipo === "hibrido" && (
          <>
            <div className="space-y-2">
              <Label>Indexador base</Label>
              <select
                value={ativo.indexador}
                onChange={(e) => setAtivo({ ...ativo, indexador: e.target.value })}
                className="w-full bg-background/50 border border-white/10 rounded-md px-3 py-2 text-sm text-white"
              >
                {indexadoresList.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {valIdx !== null && (
                <p className="text-xs text-muted-foreground">
                  {ativo.indexador} atual: {valIdx.toFixed(2)}% a.a.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Spread (taxa adicional)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Ex: 5"
                  value={ativo.taxa}
                  onChange={(e) => setAtivo({ ...ativo, taxa: e.target.value })}
                  className="bg-background/50 border-white/10 flex-1"
                  step="0.01"
                />
                <div className="flex border border-white/10 rounded-lg overflow-hidden">
                  {(["anual", "mensal"] as TipoTaxa[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setAtivo({ ...ativo, tipoTaxa: t })}
                      className={`px-3 py-2 text-xs font-medium transition-all ${
                        ativo.tipoTaxa === t
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-white bg-card/50"
                      }`}
                    >
                      {t === "anual" ? "a.a." : "a.m."}
                    </button>
                  ))}
                </div>
              </div>
              {valIdx !== null && ativo.taxa && (
                <p className="text-xs text-green-400">
                  Taxa efetiva estimada:{" "}
                  {(
                    (1 + valIdx / 100) *
                      (1 +
                        (ativo.tipoTaxa === "anual"
                          ? parseFloat(ativo.taxa.replace(",", "."))
                          : taxaMensalParaAnual(
                              parseFloat(ativo.taxa.replace(",", "."))
                            )) /
                          100) *
                      100 -
                    100
                  ).toFixed(2)}
                  % a.a.
                </p>
              )}
            </div>
          </>
        )}

        {/* Imposto */}
        <div className="space-y-2">
          <Label>Alíquota de imposto no resgate (%)</Label>
          <Input
            type="number"
            placeholder="Ex: 15"
            value={imposto}
            onChange={(e) => setImposto(e.target.value)}
            className="bg-background/50 border-white/10"
            step="0.5"
            min={0}
            max={100}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Sub-componente: Card de Resultado ────────────────────────────────────────

function ResultadoCard({
  titulo,
  cor,
  taxaEfetiva,
  montanteBruto,
  montanteLiquido,
  rendimentoBruto,
  rendimentoLiquido,
  principal,
  imposto,
  melhor,
}: {
  titulo: string;
  cor: "blue" | "purple";
  taxaEfetiva: number;
  montanteBruto: number;
  montanteLiquido: number;
  rendimentoBruto: number;
  rendimentoLiquido: number;
  principal: number;
  imposto: number;
  melhor: boolean;
}) {
  const corClasse = cor === "blue" ? "text-blue-400" : "text-purple-400";
  const bordaClasse = cor === "blue" ? "border-blue-500/30" : "border-purple-500/30";
  const bgMelhor =
    cor === "blue" ? "bg-blue-500/10" : "bg-purple-500/10";

  return (
    <Card
      className={`bg-card border ${bordaClasse} ${melhor ? "shadow-lg" : ""}`}
    >
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className={`font-bold text-lg ${corClasse}`}>{titulo}</h3>
          {melhor && (
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${bgMelhor} ${corClasse} border ${bordaClasse}`}
            >
              ✓ Melhor opção
            </span>
          )}
        </div>

        <div className="text-center py-2">
          <p className="text-xs text-muted-foreground mb-1">Taxa efetiva a.a.</p>
          <p className={`text-3xl font-bold ${corClasse}`}>
            {taxaEfetiva.toFixed(4)}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {taxaAnualParaMensal(taxaEfetiva).toFixed(4)}% a.m.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
          <div>
            <p className="text-xs text-muted-foreground">Montante bruto</p>
            <p className="font-semibold text-white">{formatCurrency(montanteBruto)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Montante líquido</p>
            <p className={`font-semibold ${corClasse}`}>
              {formatCurrency(montanteLiquido)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Rendimento bruto</p>
            <p className="font-semibold text-white">
              {formatCurrency(rendimentoBruto)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Imposto estimado</p>
            <p className="font-semibold text-red-400">
              {formatCurrency(rendimentoBruto * (imposto / 100))}
            </p>
          </div>
        </div>

        <div className={`p-3 rounded-lg ${bgMelhor} border ${bordaClasse}`}>
          <p className="text-xs text-muted-foreground">
            Rentabilidade total líquida:{" "}
            <span className={`font-bold ${corClasse}`}>
              {((rendimentoLiquido / principal) * 100).toFixed(2)}%
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}


