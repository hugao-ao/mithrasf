import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calculator, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function CalculadoraJuros() {
  const [values, setValues] = useState({
    parcelValue: "",
    installments: "",
    cashPrice: ""
  });
  const [result, setResult] = useState<any>(null);

  const calculateInterest = () => {
    const pmt = parseFloat(values.parcelValue.replace(",", "."));
    const n = parseInt(values.installments);
    const pv = parseFloat(values.cashPrice.replace(",", "."));

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
      totalPaid: totalPaid.toFixed(2),
      interestPaid: interestPaid.toFixed(2),
      isWorthCash: monthlyRate > 0.8 // Assuming 0.8% as a benchmark for safe investment return
    });
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
          <p className="text-muted-foreground">Descubra os juros escondidos no "parcelado sem juros".</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-card/50 border-white/10 h-fit">
          <CardHeader>
            <CardTitle className="text-green-400">Dados da Compra</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Valor da Parcela (R$)</Label>
              <Input 
                type="number" 
                placeholder="Ex: 100.00" 
                value={values.parcelValue}
                onChange={(e) => setValues({...values, parcelValue: e.target.value})}
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
            <div className="space-y-2">
              <Label>Preço à Vista com Desconto (R$)</Label>
              <Input 
                type="number" 
                placeholder="Ex: 1000.00" 
                value={values.cashPrice}
                onChange={(e) => setValues({...values, cashPrice: e.target.value})}
                className="bg-background/50 border-white/10"
              />
            </div>
            <Button onClick={calculateInterest} className="w-full h-12 font-bold bg-green-500 hover:bg-green-600 mt-4">
              Calcular Juros Reais
            </Button>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <Card className="bg-card border-green-500/30 shadow-lg shadow-green-500/10">
              <CardContent className="p-6 space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-muted-foreground">Taxa de Juros Mensal Encontrada</p>
                  <div className="text-5xl font-bold text-white">
                    {result.monthlyRate}% <span className="text-lg text-muted-foreground">a.m.</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <p className="text-xs text-muted-foreground">Total a Pagar Parcelado</p>
                    <p className="text-xl font-bold text-red-400">R$ {result.totalPaid}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Juros Pagos "de Graça"</p>
                    <p className="text-xl font-bold text-red-400">R$ {result.interestPaid}</p>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border ${result.isWorthCash ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
                  <h3 className={`font-bold mb-2 ${result.isWorthCash ? 'text-green-400' : 'text-yellow-400'}`}>
                    {result.isWorthCash ? '✅ Vale a pena pagar à vista!' : '⚠️ Talvez compense parcelar'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {result.isWorthCash 
                      ? `Se você tiver o dinheiro, pague à vista. O desconto equivale a um rendimento de ${result.monthlyRate}% ao mês, difícil de conseguir em investimentos seguros.`
                      : `A taxa de juros é baixa (${result.monthlyRate}%). Se você investir o dinheiro e render mais que isso, pode valer a pena parcelar.`}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Gatilho de Venda */}
            <div className="bg-card border border-primary/20 rounded-xl p-6 flex flex-col items-center text-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Pare de pagar juros sem saber!</h3>
                <p className="text-muted-foreground text-sm mt-2">
                  Pequenas taxas destroem grandes patrimônios. Quer aprender a identificar e fugir dessas armadilhas?
                </p>
              </div>
              <Link href="/planos">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                  Quero Blindar meu Patrimônio
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
