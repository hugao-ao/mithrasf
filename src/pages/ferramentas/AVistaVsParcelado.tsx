import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, TrendingUp, ShoppingCart, PiggyBank, Trophy, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { formatCurrency, parseCurrency } from "@/lib/formatters";

interface ResultData {
  // Cenário À Vista
  valorVista: number;
  descontoVista: number;
  descontoPercentual: number;
  // Cenário Parcelado
  valorParcela: number;
  numParcelas: number;
  totalParcelado: number;
  jurosEmbutidos: number;
  taxaMensalEmbutida: number;
  // Investimento
  taxaAnualInvest: number;
  taxaMensalInvest: number;
  // Resultado do investimento (se pagar à vista, perde o rendimento; se parcelar, investe a diferença)
  rendimentoSeParcelar: number;
  custoEfetivoVista: number;
  custoEfetivoParcelado: number;
  diferencaFinal: number;
  veredito: 'vista' | 'parcelado' | 'empate';
  // Tabela mês a mês
  tabelaMensal: Array<{
    mes: number;
    parcela: number;
    saldoInvestido: number;
    rendimentoMes: number;
  }>;
}

export default function AVistaVsParcelado() {
  const [values, setValues] = useState({
    valorVista: "",
    valorParcela: "",
    numParcelas: "",
    taxaAnual: "12",
  });

  const [result, setResult] = useState<ResultData | null>(null);
  const [showTable, setShowTable] = useState(false);

  const handleCurrencyInput = (field: string, value: string) => {
    const numericValue = value.replace(/\D/g, "");
    const formattedValue = (Number(numericValue) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    setValues({ ...values, [field]: formattedValue });
  };

  const calculate = () => {
    const valorVista = parseCurrency(values.valorVista);
    const valorParcela = parseCurrency(values.valorParcela);
    const numParcelas = parseInt(values.numParcelas);
    const taxaAnual = parseFloat(values.taxaAnual.replace(",", "."));

    if (!valorVista || !valorParcela || !numParcelas || !taxaAnual) return;

    const totalParcelado = valorParcela * numParcelas;
    const jurosEmbutidos = totalParcelado - valorVista;
    const descontoVista = totalParcelado - valorVista;
    const descontoPercentual = (descontoVista / totalParcelado) * 100;

    // Calcular taxa mensal embutida no parcelamento (Newton-Raphson)
    let taxaMensalEmbutida = 0;
    if (jurosEmbutidos > 0.01) {
      let rate = 0.01;
      for (let i = 0; i < 50; i++) {
        const f = valorParcela * (1 - Math.pow(1 + rate, -numParcelas)) / rate - valorVista;
        const df = valorParcela * ((Math.pow(1 + rate, -numParcelas - 1) * numParcelas * rate - (1 - Math.pow(1 + rate, -numParcelas))) / (rate * rate));
        if (Math.abs(df) < 1e-12) break;
        rate = rate - f / df;
        if (rate < 0) rate = 0.0001;
      }
      taxaMensalEmbutida = rate * 100;
    }

    // Taxa mensal de investimento
    const taxaMensalInvest = (Math.pow(1 + taxaAnual / 100, 1 / 12) - 1);

    // Cenário: Pagar parcelado e investir o valor à vista
    // Mês 0: Investe o valor à vista inteiro
    // Mês 1..N: Paga parcela (retira do investimento)
    let saldo = valorVista;
    const tabelaMensal: ResultData['tabelaMensal'] = [];

    for (let mes = 1; mes <= numParcelas; mes++) {
      const rendimentoMes = saldo * taxaMensalInvest;
      saldo = saldo + rendimentoMes - valorParcela;
      tabelaMensal.push({
        mes,
        parcela: valorParcela,
        saldoInvestido: saldo,
        rendimentoMes
      });
    }

    // O rendimento total ao parcelar é o saldo final (pode ser positivo ou negativo)
    const rendimentoSeParcelar = saldo;

    // Custo efetivo:
    // À vista: paga valorVista agora, não tem mais nada
    const custoEfetivoVista = valorVista;
    // Parcelado: paga totalParcelado ao longo do tempo, mas ganha rendimentoSeParcelar
    const custoEfetivoParcelado = totalParcelado - rendimentoSeParcelar;

    const diferencaFinal = custoEfetivoVista - custoEfetivoParcelado;
    // Se diferença > 0: parcelado é mais barato (custo efetivo menor)
    // Se diferença < 0: à vista é mais barato

    let veredito: 'vista' | 'parcelado' | 'empate';
    if (Math.abs(diferencaFinal) < 0.50) {
      veredito = 'empate';
    } else if (diferencaFinal > 0) {
      veredito = 'parcelado';
    } else {
      veredito = 'vista';
    }

    setResult({
      valorVista,
      descontoVista,
      descontoPercentual,
      valorParcela,
      numParcelas,
      totalParcelado,
      jurosEmbutidos,
      taxaMensalEmbutida,
      taxaAnualInvest: taxaAnual,
      taxaMensalInvest: taxaMensalInvest * 100,
      rendimentoSeParcelar,
      custoEfetivoVista,
      custoEfetivoParcelado,
      diferencaFinal,
      veredito,
      tabelaMensal
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/ferramentas">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <ShoppingCart className="h-8 w-8 text-emerald-400" /> À Vista ou Parcelado?
          </h1>
          <p className="text-muted-foreground">Descubra se compensa pagar à vista ou parcelar e investir a diferença.</p>
        </div>
      </div>

      {/* Layout */}
      <div className={`grid gap-8 transition-all duration-500 ease-in-out ${result ? 'lg:grid-cols-[1fr_1.5fr]' : 'max-w-xl mx-auto'}`}>
        
        {/* Input Form */}
        <Card className="bg-card/50 border-white/10 h-fit">
          <CardHeader>
            <CardTitle className="text-emerald-400">Dados da Compra</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Valor à Vista (R$)</Label>
              <Input
                type="text"
                placeholder="R$ 0,00"
                value={values.valorVista}
                onChange={(e) => handleCurrencyInput('valorVista', e.target.value)}
                className="bg-background/50 border-white/10"
              />
              <p className="text-xs text-muted-foreground">O preço se pagar tudo de uma vez.</p>
            </div>

            <div className="space-y-2">
              <Label>Valor da Parcela (R$)</Label>
              <Input
                type="text"
                placeholder="R$ 0,00"
                value={values.valorParcela}
                onChange={(e) => handleCurrencyInput('valorParcela', e.target.value)}
                className="bg-background/50 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label>Número de Parcelas</Label>
              <Input
                type="number"
                placeholder="Ex: 12"
                value={values.numParcelas}
                onChange={(e) => setValues({ ...values, numParcelas: e.target.value })}
                className="bg-background/50 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label>Taxa de Rendimento Anual do Investimento (%)</Label>
              <Input
                type="text"
                placeholder="Ex: 12"
                value={values.taxaAnual}
                onChange={(e) => setValues({ ...values, taxaAnual: e.target.value })}
                className="bg-background/50 border-white/10"
              />
              <p className="text-xs text-muted-foreground">Se parcelar, o valor à vista fica investido rendendo essa taxa.</p>
            </div>

            <Button onClick={calculate} className="w-full h-12 font-bold bg-emerald-500 hover:bg-emerald-600 mt-4">
              Comparar Cenários
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            
            {/* Veredito Principal */}
            <Card className={`border shadow-lg ${
              result.veredito === 'vista' 
                ? 'bg-blue-500/10 border-blue-500/30 shadow-blue-500/10' 
                : result.veredito === 'parcelado'
                  ? 'bg-emerald-500/10 border-emerald-500/30 shadow-emerald-500/10'
                  : 'bg-yellow-500/10 border-yellow-500/30 shadow-yellow-500/10'
            }`}>
              <CardContent className="p-6">
                <div className="text-center space-y-3">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                    result.veredito === 'vista'
                      ? 'bg-blue-500/20 text-blue-400'
                      : result.veredito === 'parcelado'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    <Trophy className="h-4 w-4" />
                    {result.veredito === 'vista' && 'PAGAR À VISTA É MAIS VANTAJOSO'}
                    {result.veredito === 'parcelado' && 'PARCELAR E INVESTIR É MAIS VANTAJOSO'}
                    {result.veredito === 'empate' && 'PRATICAMENTE EQUIVALENTE'}
                  </div>
                  
                  <p className="text-3xl font-bold text-white">
                    {result.veredito === 'empate' 
                      ? 'Diferença desprezível'
                      : `Economia de ${formatCurrency(Math.abs(result.diferencaFinal))}`
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {result.veredito === 'vista' && `Pagar à vista sai mais barato do que parcelar e investir a diferença a ${result.taxaAnualInvest}% a.a.`}
                    {result.veredito === 'parcelado' && `Parcelar e investir o valor à vista a ${result.taxaAnualInvest}% a.a. compensa os juros do parcelamento.`}
                    {result.veredito === 'empate' && `Com a taxa de ${result.taxaAnualInvest}% a.a., tanto faz pagar à vista ou parcelado.`}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Comparativo lado a lado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cenário À Vista */}
              <Card className={`bg-card/50 border-white/10 ${result.veredito === 'vista' ? 'ring-2 ring-blue-500/50' : ''}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-blue-400 text-base flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" /> Pagar à Vista
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Valor Pago</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(result.valorVista)}</p>
                  </div>
                  {result.descontoVista > 0.01 && (
                    <div>
                      <p className="text-xs text-muted-foreground">Desconto vs. Parcelado</p>
                      <p className="text-lg font-semibold text-green-400">
                        -{formatCurrency(result.descontoVista)} ({result.descontoPercentual.toFixed(1)}%)
                      </p>
                    </div>
                  )}
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-xs text-muted-foreground">Custo Efetivo Final</p>
                    <p className="text-xl font-bold text-white">{formatCurrency(result.custoEfetivoVista)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Cenário Parcelado */}
              <Card className={`bg-card/50 border-white/10 ${result.veredito === 'parcelado' ? 'ring-2 ring-emerald-500/50' : ''}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-emerald-400 text-base flex items-center gap-2">
                    <PiggyBank className="h-4 w-4" /> Parcelar + Investir
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Parcelado ({result.numParcelas}x de {formatCurrency(result.valorParcela)})</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(result.totalParcelado)}</p>
                  </div>
                  {result.jurosEmbutidos > 0.01 && (
                    <div>
                      <p className="text-xs text-muted-foreground">Juros Embutidos (taxa de {result.taxaMensalEmbutida.toFixed(2)}% a.m.)</p>
                      <p className="text-lg font-semibold text-red-400">+{formatCurrency(result.jurosEmbutidos)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground">Rendimento do Investimento ({result.taxaAnualInvest}% a.a.)</p>
                    <p className="text-lg font-semibold text-emerald-400">
                      {result.rendimentoSeParcelar >= 0 ? '+' : ''}{formatCurrency(result.rendimentoSeParcelar)}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-xs text-muted-foreground">Custo Efetivo Final</p>
                    <p className="text-xl font-bold text-white">{formatCurrency(result.custoEfetivoParcelado)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Premissas */}
            <Card className="bg-card/30 border-white/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    <span className="text-white font-medium">Premissa:</span> Ao parcelar, o valor de {formatCurrency(result.valorVista)} fica investido rendendo {result.taxaMensalInvest.toFixed(4)}% ao mês ({result.taxaAnualInvest}% a.a.). A cada mês, a parcela de {formatCurrency(result.valorParcela)} é retirada do investimento. Ao final de {result.numParcelas} meses, o saldo restante é {result.rendimentoSeParcelar >= 0 ? 'o lucro' : 'o prejuízo'} do cenário parcelado.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tabela Mês a Mês (toggle) */}
            <Card className="bg-card/50 border-white/10">
              <CardHeader className="cursor-pointer" onClick={() => setShowTable(!showTable)}>
                <CardTitle className="text-sm text-white flex items-center justify-between">
                  <span>Memória de Cálculo — Mês a Mês</span>
                  <span className="text-muted-foreground text-xs">{showTable ? '▲ Recolher' : '▼ Expandir'}</span>
                </CardTitle>
              </CardHeader>
              {showTable && (
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 px-2 text-muted-foreground font-medium">Mês</th>
                          <th className="text-right py-2 px-2 text-muted-foreground font-medium">Parcela Paga</th>
                          <th className="text-right py-2 px-2 text-muted-foreground font-medium">Rendimento</th>
                          <th className="text-right py-2 px-2 text-muted-foreground font-medium">Saldo Investido</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-white/5">
                          <td className="py-2 px-2 text-white">0</td>
                          <td className="py-2 px-2 text-right text-muted-foreground">—</td>
                          <td className="py-2 px-2 text-right text-muted-foreground">—</td>
                          <td className="py-2 px-2 text-right text-emerald-400 font-medium">{formatCurrency(result.valorVista)}</td>
                        </tr>
                        {result.tabelaMensal.map((row) => (
                          <tr key={row.mes} className="border-b border-white/5">
                            <td className="py-2 px-2 text-white">{row.mes}</td>
                            <td className="py-2 px-2 text-right text-red-400">-{formatCurrency(row.parcela)}</td>
                            <td className="py-2 px-2 text-right text-emerald-400">+{formatCurrency(row.rendimentoMes)}</td>
                            <td className={`py-2 px-2 text-right font-medium ${row.saldoInvestido >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {formatCurrency(row.saldoInvestido)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-muted-foreground">
                      <span className="text-white font-medium">Saldo final após {result.numParcelas} meses:</span>{' '}
                      <span className={result.rendimentoSeParcelar >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                        {formatCurrency(result.rendimentoSeParcelar)}
                      </span>
                      {' '}— Este é o valor que sobra (ou falta) no investimento após pagar todas as parcelas.
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Gatilho de Venda */}
            <div className="bg-card border border-white/10 rounded-xl p-6 space-y-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-white">Atenção: esta simulação não considera tudo.</p>
                  <p className="text-sm text-muted-foreground">
                    Ela mostra apenas o comparativo matemático entre pagar à vista e parcelar com investimento. Mas não avalia se essa compra <span className="text-white font-medium">cabe no seu orçamento</span>, se compromete sua <span className="text-white font-medium">reserva de emergência</span>, ou se é o melhor uso do seu dinheiro neste momento.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Para uma decisão realmente segura, é preciso considerar o contexto completo da sua vida financeira.
                  </p>
                </div>
              </div>
              <Link href="/planos">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 mt-2">
                  Quero tomar decisões financeiras com mais segurança
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
