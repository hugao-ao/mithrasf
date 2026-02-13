import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, formatCurrencyInput } from "@/lib/formatters";
import { ArrowLeft, CheckCircle2, CreditCard, Plane, Trophy } from "lucide-react";
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
      // Gasto / Dólar * Pontos * Preço Milha
      const milesGenerated = (spend / dollar) * points;
      const milesReturn = milesGenerated * milePrice;
      
      // Retorno em Cashback (R$)
      const cashbackReturn = spend * cashback;

      // Retorno Total Bruto (maior entre milhas e cashback)
      const grossReturn = Math.max(milesReturn, cashbackReturn);
      
      // Retorno Líquido (descontando anuidade)
      const netReturn = grossReturn - fee;

      return { 
        netReturn, 
        grossReturn, 
        fee, 
        isMiles: milesReturn > cashbackReturn,
        details: {
          milesGenerated,
          milesReturn,
          cashbackReturn
        }
      };
    };

    const returnA = calculateReturn(cardA);
    const returnB = calculateReturn(cardB);

    setResult({
      winner: returnA.netReturn > returnB.netReturn ? cardA.name : returnB.netReturn > returnA.netReturn ? cardB.name : "Empate",
      returnA,
      returnB,
      params: { spend, dollar, milePrice }
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
                {[result.returnA, result.returnB].map((ret, idx) => (
                  <div key={idx} className={`p-4 rounded-lg text-left transition-all duration-300 ${ret.netReturn === Math.max(result.returnA.netReturn, result.returnB.netReturn) ? 'bg-green-500/20 border border-green-500/30' : 'bg-white/5'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-lg">{idx === 0 ? cardA.name : cardB.name}</p>
                    </div>
                    
                    <div className="space-y-1 mb-4">
                      <p className="text-sm text-muted-foreground">Retorno Mensal Líquido</p>
                      <p className={`text-2xl font-bold ${ret.netReturn > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(ret.netReturn)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ({ret.isMiles ? 'Melhor via Milhas' : 'Melhor via Cashback'})
                      </p>
                    </div>

                    {/* Memória de Cálculo Fixa */}
                    <div className="mt-3 pt-3 border-t border-white/10 text-xs space-y-2">
                      <p className="font-bold text-muted-foreground mb-2">Memória de Cálculo:</p>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gasto Mensal:</span>
                        <span>{formatCurrency(result.params.spend)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cotação Dólar:</span>
                        <span>R$ {result.params.dollar.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Milhas Geradas:</span>
                        <span>{ret.details.milesGenerated.toFixed(0)} ({formatCurrency(ret.details.milesReturn)})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cashback:</span>
                        <span>{formatCurrency(ret.details.cashbackReturn)}</span>
                      </div>
                      <div className="flex justify-between text-red-400">
                        <span>Anuidade Mensal:</span>
                        <span>-{formatCurrency(ret.fee)}</span>
                      </div>
                      <div className="flex justify-between font-bold pt-2 border-t border-white/10">
                        <span>Resultado Final:</span>
                        <span className={ret.netReturn > 0 ? 'text-green-400' : 'text-red-400'}>
                          {formatCurrency(ret.netReturn)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dica sobre Potencial das Milhas */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-4 items-start text-left mt-6">
                <Plane className="h-6 w-6 text-blue-400 shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-blue-400 mb-1">O Poder das Milhas vai além do dinheiro</h4>
                  <p className="text-sm text-muted-foreground">
                    O cálculo acima considera a venda das milhas. Porém, o maior potencial está no uso estratégico: 
                    aproveitar promoções de transferência bonificada e emitir passagens ou diárias pode fazer seu retorno 
                    valer <strong>muito mais</strong> do que a conversão direta em dinheiro.
                  </p>
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
              <h3 className="font-bold text-white text-lg">Será que você consegue um cartão ainda melhor?</h3>
              <p className="text-muted-foreground">
                Você pode estar deixando de ganhar muito mais milhas ou cashback. Quer um especialista para analisar seu perfil e te ajudar a conseguir os melhores cartões do mercado?
              </p>
            </div>
            <Link href="/planos">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 whitespace-nowrap">
                Falar com Consultor
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
