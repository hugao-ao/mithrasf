import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, formatCurrencyInput } from "@/lib/formatters";
import { ArrowLeft, CheckCircle2, CreditCard, Trophy } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function ComparadorCartoes() {
  const [monthlySpend, setMonthlySpend] = useState("");
  const [dollarRate, setDollarRate] = useState("5,80");
  const [milesValue, setMilesValue] = useState("15,00"); // Preço do milheiro
  
  const [cardA, setCardA] = useState({ name: "", fee: "", points: "", cashback: "" });
  const [cardB, setCardB] = useState({ name: "", fee: "", points: "", cashback: "" });
  const [result, setResult] = useState<any>(null);

  const handleCurrencyChange = (value: string, setter: any, current?: any, field?: string) => {
    const formatted = formatCurrencyInput(value);
    if (current && field) {
      setter({ ...current, [field]: formatted });
    } else {
      setter(formatted);
    }
  };

  const compare = () => {
    if (!cardA.name || !cardB.name) return;

    const spend = parseFloat(monthlySpend.replace(/\./g, "").replace(",", ".") || "0");
    const dollar = parseFloat(dollarRate.replace(",", ".") || "1");
    const milePrice = parseFloat(milesValue.replace(/\./g, "").replace(",", ".") || "0") / 1000;

    const calculateReturn = (card: typeof cardA) => {
      const fee = parseFloat(card.fee.replace(/\./g, "").replace(",", ".") || "0") / 12; // Mensal
      const points = parseFloat(card.points.replace(",", ".") || "0");
      const cashback = parseFloat(card.cashback.replace(",", ".") || "0") / 100;

      // Retorno em Milhas (R$)
      const milesReturn = (spend / dollar) * points * milePrice;
      
      // Retorno em Cashback (R$)
      const cashbackReturn = spend * cashback;

      // Retorno Total Bruto (maior entre milhas e cashback)
      const grossReturn = Math.max(milesReturn, cashbackReturn);
      
      // Retorno Líquido (descontando anuidade)
      const netReturn = grossReturn - fee;

      return { netReturn, grossReturn, fee, isMiles: milesReturn > cashbackReturn };
    };

    const returnA = calculateReturn(cardA);
    const returnB = calculateReturn(cardB);

    setResult({
      winner: returnA.netReturn > returnB.netReturn ? cardA.name : returnB.netReturn > returnA.netReturn ? cardB.name : "Empate",
      returnA,
      returnB
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
            <CreditCard className="h-8 w-8 text-purple-400" /> Comparador de Cartões
          </h1>
          <p className="text-muted-foreground">Milhas ou Cashback? Veja qual coloca mais dinheiro no seu bolso.</p>
        </div>
      </div>

      {/* Configurações Gerais */}
      <Card className="bg-card/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-yellow-500 text-lg">Seu Perfil de Gastos</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Gasto Mensal na Fatura (R$)</Label>
            <Input 
              placeholder="0,00" 
              value={monthlySpend}
              onChange={(e) => handleCurrencyChange(e.target.value, setMonthlySpend)}
              className="bg-background/50 border-white/10"
            />
          </div>
          <div className="space-y-2">
            <Label>Cotação do Dólar (R$)</Label>
            <Input 
              placeholder="5,80" 
              value={dollarRate}
              onChange={(e) => setDollarRate(e.target.value)}
              className="bg-background/50 border-white/10"
            />
          </div>
          <div className="space-y-2">
            <Label>Valor do Milheiro (R$)</Label>
            <Input 
              placeholder="15,00" 
              value={milesValue}
              onChange={(e) => handleCurrencyChange(e.target.value, setMilesValue)}
              className="bg-background/50 border-white/10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Card A */}
        <Card className="bg-card/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-purple-400">Cartão A</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nome do Cartão</Label>
              <Input 
                placeholder="Ex: Nubank Ultravioleta" 
                value={cardA.name}
                onChange={(e) => setCardA({...cardA, name: e.target.value})}
                className="bg-background/50 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Anuidade (R$)</Label>
              <Input 
                placeholder="0,00" 
                value={cardA.fee}
                onChange={(e) => handleCurrencyChange(e.target.value, setCardA, cardA, 'fee')}
                className="bg-background/50 border-white/10"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pontos por Dólar</Label>
                <Input 
                  type="number" 
                  placeholder="Ex: 1.0" 
                  value={cardA.points}
                  onChange={(e) => setCardA({...cardA, points: e.target.value})}
                  className="bg-background/50 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label>Cashback (%)</Label>
                <Input 
                  type="number" 
                  placeholder="Ex: 1.0" 
                  value={cardA.cashback}
                  onChange={(e) => setCardA({...cardA, cashback: e.target.value})}
                  className="bg-background/50 border-white/10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card B */}
        <Card className="bg-card/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-blue-400">Cartão B</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nome do Cartão</Label>
              <Input 
                placeholder="Ex: C6 Carbon" 
                value={cardB.name}
                onChange={(e) => setCardB({...cardB, name: e.target.value})}
                className="bg-background/50 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Anuidade (R$)</Label>
              <Input 
                placeholder="0,00" 
                value={cardB.fee}
                onChange={(e) => handleCurrencyChange(e.target.value, setCardB, cardB, 'fee')}
                className="bg-background/50 border-white/10"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pontos por Dólar</Label>
                <Input 
                  type="number" 
                  placeholder="Ex: 2.5" 
                  value={cardB.points}
                  onChange={(e) => setCardB({...cardB, points: e.target.value})}
                  className="bg-background/50 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label>Cashback (%)</Label>
                <Input 
                  type="number" 
                  placeholder="Ex: 0" 
                  value={cardB.cashback}
                  onChange={(e) => setCardB({...cardB, cashback: e.target.value})}
                  className="bg-background/50 border-white/10"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button onClick={compare} className="w-full h-12 font-bold bg-purple-500 hover:bg-purple-600">
        Comparar Retorno Financeiro
      </Button>

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6">
          <Card className="bg-card border-purple-500/30 shadow-lg shadow-purple-500/10">
            <CardContent className="p-6 text-center space-y-6">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-white">
                {result.winner === "Empate" ? "Empate Técnico!" : `Vencedor: ${result.winner}`}
              </h2>
              <p className="text-muted-foreground">Considerando o retorno líquido (ganho - anuidade)</p>

              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className={`p-4 rounded-lg ${result.returnA.netReturn > result.returnB.netReturn ? 'bg-green-500/20 border border-green-500/30' : 'bg-white/5'}`}>
                  <p className="font-bold text-lg mb-1">{cardA.name}</p>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Retorno Mensal Líquido</p>
                    <p className={`text-2xl font-bold ${result.returnA.netReturn > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatCurrency(result.returnA.netReturn)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ({result.returnA.isMiles ? 'Via Milhas' : 'Via Cashback'})
                    </p>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${result.returnB.netReturn > result.returnA.netReturn ? 'bg-green-500/20 border border-green-500/30' : 'bg-white/5'}`}>
                  <p className="font-bold text-lg mb-1">{cardB.name}</p>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Retorno Mensal Líquido</p>
                    <p className={`text-2xl font-bold ${result.returnB.netReturn > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatCurrency(result.returnB.netReturn)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ({result.returnB.isMiles ? 'Via Milhas' : 'Via Cashback'})
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gatilho de Venda */}
          <div className="bg-card border border-primary/20 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-bold text-white text-lg">Sala VIP? Seguro Viagem? Upgrade de Cabine?</h3>
              <p className="text-muted-foreground">
                O retorno financeiro é só o começo. Existem dezenas de benefícios ocultos nos cartões Black que você pode estar perdendo.
              </p>
            </div>
            <Link href="/planos">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 whitespace-nowrap">
                Consultar Benefícios VIP
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
