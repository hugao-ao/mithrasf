import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2, CreditCard, Trophy } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function ComparadorCartoes() {
  const [cardA, setCardA] = useState({ name: "", fee: "", points: "", lounge: "" });
  const [cardB, setCardB] = useState({ name: "", fee: "", points: "", lounge: "" });
  const [result, setResult] = useState<any>(null);

  const compare = () => {
    if (!cardA.name || !cardB.name) return;

    const feeA = parseFloat(cardA.fee.replace(",", ".") || "0");
    const feeB = parseFloat(cardB.fee.replace(",", ".") || "0");
    const pointsA = parseFloat(cardA.points.replace(",", ".") || "0");
    const pointsB = parseFloat(cardB.points.replace(",", ".") || "0");
    const loungeA = parseInt(cardA.lounge || "0");
    const loungeB = parseInt(cardB.lounge || "0");

    let scoreA = 0;
    let scoreB = 0;

    if (feeA < feeB) scoreA++; else if (feeB < feeA) scoreB++;
    if (pointsA > pointsB) scoreA++; else if (pointsB > pointsA) scoreB++;
    if (loungeA > loungeB) scoreA++; else if (loungeB > loungeA) scoreB++;

    setResult({
      winner: scoreA > scoreB ? cardA.name : scoreB > scoreA ? cardB.name : "Empate",
      scoreA,
      scoreB,
      details: {
        fee: feeA < feeB ? "A" : feeB < feeA ? "B" : "Draw",
        points: pointsA > pointsB ? "A" : pointsB > pointsA ? "B" : "Draw",
        lounge: loungeA > loungeB ? "A" : loungeB > loungeA ? "B" : "Draw"
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
            <CreditCard className="h-8 w-8 text-purple-400" /> Comparador de Cartões
          </h1>
          <p className="text-muted-foreground">Qual cartão merece espaço na sua carteira?</p>
        </div>
      </div>

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
                type="number" 
                placeholder="Ex: 588" 
                value={cardA.fee}
                onChange={(e) => setCardA({...cardA, fee: e.target.value})}
                className="bg-background/50 border-white/10"
              />
            </div>
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
              <Label>Acessos a Sala VIP (ano)</Label>
              <Input 
                type="number" 
                placeholder="Ex: 0" 
                value={cardA.lounge}
                onChange={(e) => setCardA({...cardA, lounge: e.target.value})}
                className="bg-background/50 border-white/10"
              />
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
                type="number" 
                placeholder="Ex: 1020" 
                value={cardB.fee}
                onChange={(e) => setCardB({...cardB, fee: e.target.value})}
                className="bg-background/50 border-white/10"
              />
            </div>
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
              <Label>Acessos a Sala VIP (ano)</Label>
              <Input 
                type="number" 
                placeholder="Ex: 4" 
                value={cardB.lounge}
                onChange={(e) => setCardB({...cardB, lounge: e.target.value})}
                className="bg-background/50 border-white/10"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Button onClick={compare} className="w-full h-12 font-bold bg-purple-500 hover:bg-purple-600">
        Comparar Cartões
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

              <div className="grid grid-cols-3 gap-4 text-sm pt-4 border-t border-white/10">
                <div className={`p-3 rounded-lg ${result.details.fee === 'A' ? 'bg-purple-500/20 text-purple-300' : result.details.fee === 'B' ? 'bg-blue-500/20 text-blue-300' : 'bg-white/5'}`}>
                  <p className="font-bold mb-1">Menor Anuidade</p>
                  {result.details.fee === 'A' ? cardA.name : result.details.fee === 'B' ? cardB.name : "Igual"}
                </div>
                <div className={`p-3 rounded-lg ${result.details.points === 'A' ? 'bg-purple-500/20 text-purple-300' : result.details.points === 'B' ? 'bg-blue-500/20 text-blue-300' : 'bg-white/5'}`}>
                  <p className="font-bold mb-1">Mais Pontos</p>
                  {result.details.points === 'A' ? cardA.name : result.details.points === 'B' ? cardB.name : "Igual"}
                </div>
                <div className={`p-3 rounded-lg ${result.details.lounge === 'A' ? 'bg-purple-500/20 text-purple-300' : result.details.lounge === 'B' ? 'bg-blue-500/20 text-blue-300' : 'bg-white/5'}`}>
                  <p className="font-bold mb-1">Mais Salas VIP</p>
                  {result.details.lounge === 'A' ? cardA.name : result.details.lounge === 'B' ? cardB.name : "Igual"}
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
              <h3 className="font-bold text-white text-lg">Cartão é só a ponta do iceberg.</h3>
              <p className="text-muted-foreground">
                Existem estratégias para viajar de graça e ter renda extra com milhas. Quer aprender como?
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
