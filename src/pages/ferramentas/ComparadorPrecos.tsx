import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function ComparadorPrecos() {
  const [prodA, setProdA] = useState({ price: "", quantity: "" });
  const [prodB, setProdB] = useState({ price: "", quantity: "" });
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const priceA = parseFloat(prodA.price.replace(",", "."));
    const qtyA = parseFloat(prodA.quantity.replace(",", "."));
    const priceB = parseFloat(prodB.price.replace(",", "."));
    const qtyB = parseFloat(prodB.quantity.replace(",", "."));

    if (!priceA || !qtyA || !priceB || !qtyB) return;

    const unitPriceA = priceA / qtyA;
    const unitPriceB = priceB / qtyB;

    let winner = "";
    let economy = 0;

    if (unitPriceA < unitPriceB) {
      winner = "A";
      economy = ((unitPriceB - unitPriceA) / unitPriceB) * 100;
    } else if (unitPriceB < unitPriceA) {
      winner = "B";
      economy = ((unitPriceA - unitPriceB) / unitPriceA) * 100;
    } else {
      winner = "Draw";
    }

    setResult({ winner, economy: economy.toFixed(1), unitPriceA, unitPriceB });
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
            <ShoppingBag className="h-8 w-8 text-blue-400" /> Comparador de Preços
          </h1>
          <p className="text-muted-foreground">Descubra qual embalagem vale mais a pena.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Produto A */}
        <Card className="bg-card/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-blue-400">Produto A</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Preço (R$)</Label>
              <Input 
                type="number" 
                placeholder="Ex: 15.90" 
                value={prodA.price}
                onChange={(e) => setProdA({...prodA, price: e.target.value})}
                className="bg-background/50 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Quantidade (ml, g, unidades)</Label>
              <Input 
                type="number" 
                placeholder="Ex: 500" 
                value={prodA.quantity}
                onChange={(e) => setProdA({...prodA, quantity: e.target.value})}
                className="bg-background/50 border-white/10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Produto B */}
        <Card className="bg-card/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-purple-400">Produto B</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Preço (R$)</Label>
              <Input 
                type="number" 
                placeholder="Ex: 25.90" 
                value={prodB.price}
                onChange={(e) => setProdB({...prodB, price: e.target.value})}
                className="bg-background/50 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Quantidade (ml, g, unidades)</Label>
              <Input 
                type="number" 
                placeholder="Ex: 900" 
                value={prodB.quantity}
                onChange={(e) => setProdB({...prodB, quantity: e.target.value})}
                className="bg-background/50 border-white/10"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Button onClick={calculate} className="w-full h-12 text-lg font-bold bg-blue-500 hover:bg-blue-600">
        Calcular Melhor Opção
      </Button>

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6">
          <Card className={`border-2 ${result.winner === 'Draw' ? 'border-gray-500' : 'border-green-500'} bg-green-500/10`}>
            <CardContent className="p-6 text-center space-y-4">
              {result.winner === 'Draw' ? (
                <h2 className="text-2xl font-bold text-white">Os dois têm o mesmo custo-benefício!</h2>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white">
                    O <span className={result.winner === 'A' ? 'text-blue-400' : 'text-purple-400'}>Produto {result.winner}</span> é a melhor escolha!
                  </h2>
                  <p className="text-lg text-green-400 font-semibold">
                    Você economiza {result.economy}% levando esta opção.
                  </p>
                </>
              )}
              
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground pt-4 border-t border-white/10">
                <div>Preço por unidade A: R$ {result.unitPriceA.toFixed(4)}</div>
                <div>Preço por unidade B: R$ {result.unitPriceB.toFixed(4)}</div>
              </div>
            </CardContent>
          </Card>

          {/* Gatilho de Venda */}
          <div className="bg-card border border-primary/20 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-bold text-white text-lg">Economizar no mercado é bom...</h3>
              <p className="text-muted-foreground">Mas saber investir essa economia é o que muda sua vida. Quer aprender a fazer seu dinheiro render mais?</p>
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
