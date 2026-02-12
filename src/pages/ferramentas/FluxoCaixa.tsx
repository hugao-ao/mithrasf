import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2, Wallet } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function FluxoCaixa() {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState({
    income: "",
    fixedExpenses: "",
    variableExpenses: "",
    investments: ""
  });
  const [result, setResult] = useState<any>(null);

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
    else calculate();
  };

  const calculate = () => {
    const income = parseFloat(values.income.replace(",", ".") || "0");
    const fixed = parseFloat(values.fixedExpenses.replace(",", ".") || "0");
    const variable = parseFloat(values.variableExpenses.replace(",", ".") || "0");
    const invest = parseFloat(values.investments.replace(",", ".") || "0");

    const totalExpenses = fixed + variable + invest;
    const balance = income - totalExpenses;
    const yearlyLoss = balance * 12;

    setResult({
      income,
      totalExpenses,
      balance,
      yearlyLoss
    });
    setStep(5);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/ferramentas">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Wallet className="h-8 w-8 text-red-400" /> Onde está seu dinheiro?
          </h1>
          <p className="text-muted-foreground">Um teste rápido para descobrir para onde seu salário está indo.</p>
        </div>
      </div>

      {step < 5 ? (
        <Card className="bg-card/50 border-white/10">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-muted-foreground">Passo {step} de 4</span>
              <div className="h-2 w-32 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-400 transition-all duration-500" 
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>
            </div>
            <CardTitle className="text-2xl text-white">
              {step === 1 && "Quanto você ganha por mês?"}
              {step === 2 && "Quanto são suas contas fixas?"}
              {step === 3 && "Quanto você gasta com lazer e variáveis?"}
              {step === 4 && "Quanto você investe por mês?"}
            </CardTitle>
            <p className="text-muted-foreground">
              {step === 1 && "Salário líquido + Renda extra (média)."}
              {step === 2 && "Aluguel, Condomínio, Luz, Internet, Escola, etc."}
              {step === 3 && "Cartão de crédito, iFood, Uber, Saídas, etc."}
              {step === 4 && "Aportes em poupança, tesouro, ações, etc."}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <Input 
              type="number" 
              placeholder="R$ 0,00" 
              className="text-2xl h-16 bg-background/50 border-white/10"
              autoFocus
              value={
                step === 1 ? values.income :
                step === 2 ? values.fixedExpenses :
                step === 3 ? values.variableExpenses :
                values.investments
              }
              onChange={(e) => {
                const val = e.target.value;
                if (step === 1) setValues({...values, income: val});
                if (step === 2) setValues({...values, fixedExpenses: val});
                if (step === 3) setValues({...values, variableExpenses: val});
                if (step === 4) setValues({...values, investments: val});
              }}
              onKeyDown={(e) => e.key === 'Enter' && nextStep()}
            />
            <Button onClick={nextStep} className="w-full h-12 text-lg font-bold bg-red-500 hover:bg-red-600">
              {step === 4 ? "Ver Resultado" : "Próximo"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6 animate-in fade-in zoom-in-95">
          <Card className={`border-2 ${result.balance >= 0 ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
            <CardContent className="p-8 text-center space-y-6">
              <h2 className="text-3xl font-bold text-white">
                {result.balance >= 0 ? "Sobrou dinheiro... mas onde ele está?" : "Você está no vermelho!"}
              </h2>
              
              <div className="py-6">
                <p className="text-muted-foreground mb-2">Diferença Mensal (Receitas - Despesas)</p>
                <p className={`text-5xl font-bold ${result.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  R$ {result.balance.toFixed(2)}
                </p>
              </div>

              {result.balance > 0 && (
                <div className="bg-black/20 p-4 rounded-xl">
                  <p className="text-lg text-white mb-2">
                    Em um ano, você deixa de ver a cor de:
                  </p>
                  <p className="text-3xl font-bold text-yellow-400">
                    R$ {result.yearlyLoss.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Se esse dinheiro não está investido, ele simplesmente sumiu.
                  </p>
                </div>
              )}

              {result.balance < 0 && (
                <div className="bg-black/20 p-4 rounded-xl">
                  <p className="text-lg text-white mb-2">
                    Em um ano, seu rombo será de:
                  </p>
                  <p className="text-3xl font-bold text-red-500">
                    R$ {Math.abs(result.yearlyLoss).toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Isso provavelmente vai virar dívida de cartão de crédito com juros altíssimos.
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
              <h3 className="font-bold text-white text-lg">
                {result.balance >= 0 ? "Vamos dar um destino para esse dinheiro?" : "Vamos estancar esse sangramento agora?"}
              </h3>
              <p className="text-muted-foreground text-sm mt-2">
                {result.balance >= 0 
                  ? "Dinheiro parado perde valor. Aprenda a investir e multiplicar esse excedente."
                  : "Viver no vermelho é estressante e perigoso. Vamos organizar suas contas e te tirar dessa."}
              </p>
            </div>
            <Link href="/planos">
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                Falar com Consultor
              </Button>
            </Link>
          </div>
          
          <Button variant="ghost" onClick={() => {setStep(1); setValues({income:"", fixedExpenses:"", variableExpenses:"", investments:""})}} className="w-full">
            Refazer Teste
          </Button>
        </div>
      )}
    </div>
  );
}
