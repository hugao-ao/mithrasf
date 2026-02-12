import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2, LineChart, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Oraculo() {
  const [currentWealth, setCurrentWealth] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [years, setYears] = useState("10");
  const [goals, setGoals] = useState<{ name: string; value: string; year: string }[]>([]);
  const [newGoal, setNewGoal] = useState({ name: "", value: "", year: "" });
  const [chartData, setChartData] = useState<any[]>([]);

  const addGoal = () => {
    if (newGoal.name && newGoal.value && newGoal.year) {
      setGoals([...goals, newGoal]);
      setNewGoal({ name: "", value: "", year: "" });
    }
  };

  const removeGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const calculate = () => {
    const wealth = parseFloat(currentWealth.replace(",", ".") || "0");
    const contribution = parseFloat(monthlyContribution.replace(",", ".") || "0");
    const rate = parseFloat(interestRate.replace(",", ".") || "0");
    const duration = parseInt(years || "10");

    const monthlyRate = Math.pow(1 + rate / 100, 1 / 12) - 1;
    let current = wealth;
    const data = [];

    for (let year = 1; year <= duration; year++) {
      for (let month = 1; month <= 12; month++) {
        current = current * (1 + monthlyRate) + contribution;
      }

      // Check for goals in this year
      const yearGoals = goals.filter(g => parseInt(g.year) === year);
      let withdrawn = 0;
      yearGoals.forEach(g => {
        const val = parseFloat(g.value.replace(",", ".") || "0");
        current -= val;
        withdrawn += val;
      });

      data.push({ year, value: current, withdrawn });
    }

    setChartData(data);
  };

  // Simple SVG Chart Component
  const Chart = ({ data }: { data: any[] }) => {
    if (!data.length) return null;
    const maxValue = Math.max(...data.map(d => d.value));
    const height = 200;
    const width = 100; // percentage

    return (
      <div className="h-[250px] w-full flex items-end gap-1 relative border-b border-white/10 pb-6">
        {data.map((d, i) => {
          const barHeight = Math.max((d.value / maxValue) * height, 2);
          return (
            <div key={i} className="flex-1 flex flex-col items-center group relative">
              <div 
                className={`w-full max-w-[20px] rounded-t-sm transition-all duration-500 ${d.value < 0 ? 'bg-red-500' : 'bg-gold-500'}`}
                style={{ height: `${Math.abs(barHeight)}px` }}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 pointer-events-none">
                  Ano {d.year}: R$ {d.value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                  {d.withdrawn > 0 && <div className="text-red-400">Saque: -R$ {d.withdrawn.toLocaleString('pt-BR')}</div>}
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground mt-2 absolute -bottom-6">{d.year}</span>
            </div>
          );
        })}
      </div>
    );
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
            <LineChart className="h-8 w-8 text-yellow-500" /> O Oráculo Financeiro
          </h1>
          <p className="text-muted-foreground">Veja o futuro do seu dinheiro e como seus sonhos impactam sua liberdade.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Inputs */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-yellow-500">Parâmetros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Patrimônio Atual (R$)</Label>
                <Input 
                  type="number" 
                  placeholder="Ex: 10000" 
                  value={currentWealth}
                  onChange={(e) => setCurrentWealth(e.target.value)}
                  className="bg-background/50 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label>Aporte Mensal (R$)</Label>
                <Input 
                  type="number" 
                  placeholder="Ex: 500" 
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  className="bg-background/50 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label>Rentabilidade Anual (%)</Label>
                <Input 
                  type="number" 
                  placeholder="Ex: 10" 
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="bg-background/50 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label>Projeção (Anos)</Label>
                <Input 
                  type="number" 
                  placeholder="Ex: 20" 
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="bg-background/50 border-white/10"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-blue-400">Adicionar Objetivos (Saques)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome do Objetivo</Label>
                <Input 
                  placeholder="Ex: Trocar de Carro" 
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                  className="bg-background/50 border-white/10"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Valor (R$)</Label>
                  <Input 
                    type="number" 
                    placeholder="Ex: 50000" 
                    value={newGoal.value}
                    onChange={(e) => setNewGoal({...newGoal, value: e.target.value})}
                    className="bg-background/50 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ano (1-{years})</Label>
                  <Input 
                    type="number" 
                    placeholder="Ex: 5" 
                    value={newGoal.year}
                    onChange={(e) => setNewGoal({...newGoal, year: e.target.value})}
                    className="bg-background/50 border-white/10"
                  />
                </div>
              </div>
              <Button onClick={addGoal} variant="secondary" className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Adicionar Objetivo
              </Button>

              {goals.length > 0 && (
                <div className="space-y-2 mt-4">
                  <Label>Objetivos Cadastrados:</Label>
                  {goals.map((g, i) => (
                    <div key={i} className="flex justify-between items-center text-sm bg-white/5 p-2 rounded">
                      <span>{g.name} (Ano {g.year}): -R$ {g.value}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeGoal(i)} className="h-6 w-6 p-0 text-red-400">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Button onClick={calculate} className="w-full h-12 font-bold bg-yellow-500 hover:bg-yellow-600 text-black">
            Consultar o Oráculo
          </Button>
        </div>

        {/* Chart & Results */}
        {chartData.length > 0 && (
          <div className="lg:col-span-2 space-y-6 animate-in fade-in slide-in-from-right-4">
            <Card className="bg-card border-yellow-500/30 shadow-lg shadow-yellow-500/10">
              <CardHeader>
                <CardTitle className="text-yellow-500">Evolução Patrimonial</CardTitle>
                <p className="text-sm text-muted-foreground">Passe o mouse sobre as barras para ver os valores.</p>
              </CardHeader>
              <CardContent>
                <Chart data={chartData} />
                
                <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/10">
                  <div>
                    <p className="text-sm text-muted-foreground">Patrimônio Final</p>
                    <p className={`text-3xl font-bold ${chartData[chartData.length-1].value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      R$ {chartData[chartData.length-1].value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Investido (Aportes)</p>
                    <p className="text-xl font-bold text-white">
                      R$ {(parseFloat(currentWealth || "0") + parseFloat(monthlyContribution || "0") * parseInt(years || "0") * 12).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gatilho de Venda */}
            <div className="bg-card border border-primary/20 rounded-xl p-6 flex flex-col items-center text-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">
                  {chartData[chartData.length-1].value < 0 
                    ? "Cuidado! Seus sonhos custam mais do que seu dinheiro rende." 
                    : "Quer fazer essa curva subir mais rápido?"}
                </h3>
                <p className="text-muted-foreground text-sm mt-2">
                  Uma estratégia de investimentos personalizada pode aumentar sua rentabilidade e antecipar sua liberdade financeira em anos.
                </p>
              </div>
              <Link href="/planos">
                <Button variant="outline" className="w-full md:w-auto border-primary text-primary hover:bg-primary/10">
                  Quero Acelerar meu Patrimônio
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
