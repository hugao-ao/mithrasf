import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, formatCurrencyInput } from "@/lib/formatters";
import { ArrowLeft, Building2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function SimuladorImobiliario() {
  const [timeUnit, setTimeUnit] = useState<'years' | 'months'>('years');
  const [values, setValues] = useState({
    propertyValue: "",
    downPayment: "",
    interestRate: "",
    duration: ""
  });
  const [result, setResult] = useState<any>(null);

  const handleCurrencyChange = (field: string, value: string) => {
    const formatted = formatCurrencyInput(value);
    setValues({ ...values, [field]: formatted });
  };

  const calculate = () => {
    const pv = parseFloat(values.propertyValue.replace(/\./g, "").replace(",", "."));
    const entry = parseFloat(values.downPayment.replace(/\./g, "").replace(",", "."));
    const rateYear = parseFloat(values.interestRate.replace(",", "."));
    const duration = parseInt(values.duration);

    if (!pv || !rateYear || !duration) return;

    const loanAmount = pv - (entry || 0);
    const months = timeUnit === 'years' ? duration * 12 : duration;
    
    // CORREÇÃO: Cálculo da taxa mensal equivalente a partir da taxa anual efetiva
    // Fórmula: (1 + taxa_anual)^(1/12) - 1
    const rateMonth = Math.pow(1 + rateYear / 100, 1 / 12) - 1;

    // SAC Calculation
    const amortizationSAC = loanAmount / months;
    
    // Primeira parcela SAC: Amortização + Juros sobre Saldo Devedor Total
    const firstInstallmentSAC = amortizationSAC + (loanAmount * rateMonth);
    
    // Última parcela SAC: Amortização + Juros sobre Última Amortização
    const lastInstallmentSAC = amortizationSAC + (amortizationSAC * rateMonth);
    
    // Total Pago SAC (Soma de PA)
    const totalPaidSAC = (months * (firstInstallmentSAC + lastInstallmentSAC)) / 2;
    const totalInterestSAC = totalPaidSAC - loanAmount;

    // Price Calculation
    // Fórmula Price: PMT = PV * [i * (1+i)^n] / [(1+i)^n - 1]
    const installmentPrice = loanAmount * (rateMonth * Math.pow(1 + rateMonth, months)) / (Math.pow(1 + rateMonth, months) - 1);
    const totalPaidPrice = installmentPrice * months;
    const totalInterestPrice = totalPaidPrice - loanAmount;

    // Multiplicadores em relação ao valor TOTAL do imóvel
    // Ajuste: Considerar apenas o Total Pago no Financiamento / Valor do Imóvel
    // (Conforme solicitado pelo usuário: 398k / 200k = 1.99x)
    const multiplierSAC = totalPaidSAC / pv;
    const multiplierPrice = totalPaidPrice / pv;

    setResult({
      loanAmount,
      propertyValue: pv,
      sac: {
        first: firstInstallmentSAC,
        last: lastInstallmentSAC,
        total: totalPaidSAC,
        interest: totalInterestSAC,
        multiplier: multiplierSAC
      },
      price: {
        installment: installmentPrice,
        total: totalPaidPrice,
        interest: totalInterestPrice,
        multiplier: multiplierPrice
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/ferramentas">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Building2 className="h-8 w-8 text-yellow-400" /> Simulador Imobiliário
          </h1>
          <p className="text-muted-foreground">SAC ou Price? Veja quanto você vai pagar de verdade.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Inputs */}
        <Card className="bg-card/50 border-white/10 h-fit lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-yellow-400">Dados do Financiamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Valor do Imóvel (R$)</Label>
              <Input 
                placeholder="0,00" 
                value={values.propertyValue}
                onChange={(e) => handleCurrencyChange('propertyValue', e.target.value)}
                className="bg-background/50 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Valor da Entrada (R$)</Label>
              <Input 
                placeholder="0,00" 
                value={values.downPayment}
                onChange={(e) => handleCurrencyChange('downPayment', e.target.value)}
                className="bg-background/50 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Taxa de Juros Anual (%)</Label>
              <Input 
                type="number" 
                placeholder="Ex: 9.5" 
                value={values.interestRate}
                onChange={(e) => setValues({...values, interestRate: e.target.value})}
                className="bg-background/50 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Prazo</Label>
                <div className="flex gap-2 text-xs">
                  <button 
                    onClick={() => setTimeUnit('years')}
                    className={`px-2 py-1 rounded ${timeUnit === 'years' ? 'bg-yellow-500 text-black' : 'bg-white/10'}`}
                  >
                    Anos
                  </button>
                  <button 
                    onClick={() => setTimeUnit('months')}
                    className={`px-2 py-1 rounded ${timeUnit === 'months' ? 'bg-yellow-500 text-black' : 'bg-white/10'}`}
                  >
                    Meses
                  </button>
                </div>
              </div>
              <Input 
                type="number" 
                placeholder={timeUnit === 'years' ? "Ex: 30" : "Ex: 360"} 
                value={values.duration}
                onChange={(e) => setValues({...values, duration: e.target.value})}
                className="bg-background/50 border-white/10"
              />
            </div>
            <Button onClick={calculate} className="w-full h-12 font-bold bg-yellow-500 hover:bg-yellow-600 text-black mt-4">
              Simular Financiamento
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="lg:col-span-2 space-y-6 animate-in fade-in slide-in-from-bottom-4">
            
            {/* Financed Amount Highlight */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex justify-between items-center">
              <span className="text-muted-foreground">Valor Financiado (Imóvel - Entrada)</span>
              <span className="text-2xl font-bold text-white">{formatCurrency(result.loanAmount)}</span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* SAC Card */}
              <Card className="bg-card border-blue-500/30 shadow-lg shadow-blue-500/10">
                <CardHeader>
                  <CardTitle className="text-blue-400 text-center">Tabela SAC</CardTitle>
                  <p className="text-xs text-center text-muted-foreground">Parcelas decrescentes</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Primeira Parcela</p>
                    <p className="text-xl font-bold text-white">{formatCurrency(result.sac.first)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Última Parcela</p>
                    <p className="text-xl font-bold text-white">{formatCurrency(result.sac.last)}</p>
                  </div>
                  <div className="pt-4 border-t border-white/10 space-y-1">
                    <p className="text-sm text-muted-foreground">Total Pago (Financiamento)</p>
                    <p className="text-2xl font-bold text-red-400">{formatCurrency(result.sac.total)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Só de Juros</p>
                    <p className="text-lg font-bold text-red-400/80">{formatCurrency(result.sac.interest)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Price Card */}
              <Card className="bg-card border-purple-500/30 shadow-lg shadow-purple-500/10">
                <CardHeader>
                  <CardTitle className="text-purple-400 text-center">Tabela Price</CardTitle>
                  <p className="text-xs text-center text-muted-foreground">Parcelas fixas</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Valor da Parcela</p>
                    <p className="text-xl font-bold text-white">{formatCurrency(result.price.installment)}</p>
                  </div>
                  <div className="space-y-1 opacity-0">
                    <p className="text-sm text-muted-foreground">Placeholder</p>
                    <p className="text-xl font-bold text-white">-</p>
                  </div>
                  <div className="pt-4 border-t border-white/10 space-y-1">
                    <p className="text-sm text-muted-foreground">Total Pago (Financiamento)</p>
                    <p className="text-2xl font-bold text-red-400">{formatCurrency(result.price.total)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Só de Juros</p>
                    <p className="text-lg font-bold text-red-400/80">{formatCurrency(result.price.interest)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gatilho de Venda */}
            <div className="bg-card border border-white/10 rounded-xl p-6 space-y-4">
              <p className="text-sm font-semibold text-white">O que essa ferramenta não faz:</p>
              <p className="text-sm text-muted-foreground">
                Ela simula SAC e Price com base nos dados que você informou, mas não considera variáveis que mudam muito o resultado real: <span className="text-white font-medium">FGTS disponível, capacidade real de amortização antecipada, impacto no orçamento mensal e alternativas ao financiamento</span>. Por exemplo — dependendo da sua situação, alugar e investir a diferença pode gerar mais patrimônio do que comprar agora.
              </p>
              <p className="text-sm text-muted-foreground">
                Para saber se esse financiamento faz sentido para <span className="text-white font-medium">o seu momento financeiro</span>, isso exige uma análise completa.
              </p>
              <Link href="/planos">
                <Button variant="outline" className="w-full md:w-auto border-primary text-primary hover:bg-primary/10">
                  Quero analisar se comprar agora faz sentido para mim
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
