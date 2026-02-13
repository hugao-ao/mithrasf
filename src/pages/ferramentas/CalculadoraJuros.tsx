import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calculator, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { formatCurrency, parseCurrency } from "@/lib/formatters";

export default function CalculadoraJuros() {
  const [mode, setMode] = useState<'findRate' | 'findInstallment'>('findRate');
  
  const [values, setValues] = useState({
    parcelValue: "",
    installments: "",
    cashPrice: "",
    interestRate: ""
  });
  
  const [result, setResult] = useState<any>(null);

  const handleCurrencyInput = (field: string, value: string) => {
    const numericValue = value.replace(/\D/g, "");
    const formattedValue = (Number(numericValue) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    setValues({ ...values, [field]: formattedValue });
  };

  const calculate = () => {
    if (mode === 'findRate') {
      const pmt = parseCurrency(values.parcelValue);
      const n = parseInt(values.installments);
      const pv = parseCurrency(values.cashPrice);

      if (!pmt || !n || !pv) return;

      // Newton-Raphson method to find interest rate
      let rate = 0.01; // Initial guess 1%
      for (let i = 0; i < 20; i++) {
        const f = pmt * (1 - Math.pow(1 + rate, -n)) / rate - pv;
        const df = pmt * ((Math.pow(1 + rate, -n - 1) * n * rate - (1 - Math.pow(1 + rate, -n))) / (rate * rate));
        rate = rate - f / df;
      }

      const monthlyRate = rate * 100;
      const totalPaid = pmt * n;
      const interestPaid = totalPaid - pv;

      setResult({
        monthlyRate: monthlyRate.toFixed(2),
        totalPaid: formatCurrency(totalPaid),
        interestPaid: formatCurrency(interestPaid),
        isWorthCash: monthlyRate > 0.8
      });
    } else {
      // Find Installment Mode
      const pv = parseCurrency(values.cashPrice);
      const n = parseInt(values.installments);
      const rate = parseFloat(values.interestRate.replace(",", ".")) / 100;

      if (!pv || !n || !rate) return;

      const pmt = pv * (rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
      const totalPaid = pmt * n;
      const interestPaid = totalPaid - pv;

      setResult({
        installmentValue: formatCurrency(pmt),
        totalPaid: formatCurrency(totalPaid),
        interestPaid: formatCurrency(interestPaid)
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/ferramentas">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Calculator className="h-8 w-8 text-green-400" /> Calculadora de Juros Reais
          </h1>
          <p className="text-muted-foreground">Descubra os juros escondidos ou simule parcelas.</p>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex p-1 bg-card/50 border border-white/10 rounded-lg w-fit mx-auto">
        <button
          onClick={() => { setMode('findRate'); setResult(null); }}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
            mode === 'findRate' 
              ? 'bg-primary text-primary-foreground shadow-lg' 
              : 'text-muted-foreground hover:text-white'
          }`}
        >
          Descobrir Taxa de Juros
        </button>
        <button
          onClick={() => { setMode('findInstallment'); setResult(null); }}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
            mode === 'findInstallment' 
              ? 'bg-primary text-primary-foreground shadow-lg' 
              : 'text-muted-foreground hover:text-white'
          }`}
        >
          Calcular Parcela
        </button>
      </div>

      {/* Layout Container */}
      <div className={`grid gap-8 transition-all duration-500 ease-in-out ${result ? 'md:grid-cols-2' : 'md:grid-cols-1 max-w-xl mx-auto'}`}>
        
        {/* Input Form */}
        <Card className="bg-card/50 border-white/10 h-fit w-full">
          <CardHeader>
            <CardTitle className="text-green-400">
              {mode === 'findRate' ? 'Dados da Compra' : 'Simulação de Financiamento'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Valor à Vista (R$)</Label>
              <Input 
                type="text" 
                placeholder="R$ 0,00" 
                value={values.cashPrice}
                onChange={(e) => handleCurrencyInput('cashPrice', e.target.value)}
                className="bg-background/50 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label>Número de Parcelas</Label>
              <Input 
                type="number" 
                placeholder="Ex: 12" 
                value={values.installments}
                onChange={(e) => setValues({...values, installments: e.target.value})}
                className="bg-background/50 border-white/10"
              />
            </div>

            {mode === 'findRate' ? (
              <div className="space-y-2">
                <Label>Valor da Parcela (R$)</Label>
                <Input 
                  type="text" 
                  placeholder="R$ 0,00" 
                  value={values.parcelValue}
                  onChange={(e) => handleCurrencyInput('parcelValue', e.target.value)}
                  className="bg-background/50 border-white/10"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Taxa de Juros Mensal (%)</Label>
                <Input 
                  type="number" 
                  placeholder="Ex: 1.5" 
                  value={values.interestRate}
                  onChange={(e) => setValues({...values, interestRate: e.target.value})}
                  className="bg-background/50 border-white/10"
                />
              </div>
            )}

            <Button onClick={calculate} className="w-full h-12 font-bold bg-green-500 hover:bg-green-600 mt-4">
              {mode === 'findRate' ? 'Descobrir Taxa Real' : 'Calcular Valor da Parcela'}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 w-full">
            <Card className="bg-card border-green-500/30 shadow-lg shadow-green-500/10">
              <CardContent className="p-6 space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-muted-foreground">
                    {mode === 'findRate' ? 'Taxa de Juros Mensal Real' : 'Valor da Parcela Mensal'}
                  </p>
                  <div className="text-4xl font-bold text-white">
                    {mode === 'findRate' 
                      ? `${result.monthlyRate}% a.m.` 
                      : result.installmentValue}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <p className="text-xs text-muted-foreground">Total a Pagar</p>
                    <p className="text-xl font-bold text-red-400">{result.totalPaid}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Juros Totais</p>
                    <p className="text-xl font-bold text-red-400">{result.interestPaid}</p>
                  </div>
                </div>

                {mode === 'findRate' && (
                  <div className={`p-4 rounded-lg border ${result.isWorthCash ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
                    <h3 className={`font-bold mb-2 ${result.isWorthCash ? 'text-green-400' : 'text-yellow-400'}`}>
                      {result.isWorthCash ? '✅ Vale a pena pagar à vista!' : '⚠️ Talvez compense parcelar'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {result.isWorthCash 
                        ? `O desconto equivale a um rendimento de ${result.monthlyRate}% ao mês. Dificilmente um investimento seguro supera isso.`
                        : `A taxa de juros é baixa (${result.monthlyRate}%). Se você investir o dinheiro, pode render mais que isso.`}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Gatilho de Venda */}
            <div className="bg-card border border-primary/20 rounded-xl p-6 flex flex-col items-center text-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Quer aprender a identificar e fugir dessas armadilhas?</h3>
                <p className="text-muted-foreground text-sm mt-2">
                  Pequenas taxas destroem grandes patrimônios.
                </p>
              </div>
              <Link href="/planos">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                  Sim, quero blindar meu patrimônio
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
