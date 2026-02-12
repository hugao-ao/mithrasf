import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, formatCurrencyInput } from "@/lib/formatters";
import { ArrowLeft, CheckCircle2, LineChart, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";

export default function Oraculo() {
  const [timeUnit, setTimeUnit] = useState<'years' | 'months'>('years');
  const [currentWealth, setCurrentWealth] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [duration, setDuration] = useState("10");
  const [goals, setGoals] = useState<{ name: string; value: string; time: string; isRecurring: boolean }[]>([]);
  const [newGoal, setNewGoal] = useState({ name: "", value: "", time: "", isRecurring: false });
  const [chartData, setChartData] = useState<any[]>([]);

  const handleCurrencyChange = (setter: any, value: string) => {
    const formatted = formatCurrencyInput(value);
    setter(formatted);
  };

  const handleGoalCurrencyChange = (value: string) => {
    const formatted = formatCurrencyInput(value);
    setNewGoal({ ...newGoal, value: formatted });
  };

  const addGoal = () => {
    if (newGoal.name && newGoal.value && newGoal.time) {
      setGoals([...goals, newGoal]);
      setNewGoal({ name: "", value: "", time: "", isRecurring: false });
    }
  };

  const removeGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const calculate = () => {
    const wealth = parseFloat(currentWealth.replace(/\./g, "").replace(",", ".") || "0");
    const contribution = parseFloat(monthlyContribution.replace(/\./g, "").replace(",", ".") || "0");
    const rate = parseFloat(interestRate.replace(",", ".") || "0");
    const time = parseInt(duration || "10");

    const monthlyRate = Math.pow(1 + rate / 100, 1 / 12) - 1;
    let current = wealth;
    const data = [];
    const totalMonths = timeUnit === 'years' ? time * 12 : time;

    // Add initial point
    data.push({ label: 'Início', value: wealth, withdrawn: 0 });

    for (let month = 1; month <= totalMonths; month++) {
      current = current * (1 + monthlyRate) + contribution;

      // Check for goals
      let withdrawn = 0;
      goals.forEach(g => {
        const goalTime = parseInt(g.time);
        const goalValue = parseFloat(g.value.replace(/\./g, "").replace(",", ".") || "0");
        
        const isGoalMonth = timeUnit === 'years' 
          ? (month % 12 === 0 && Math.floor(month / 12) === goalTime) // Year match
          : month === goalTime; // Month match

        if (isGoalMonth || (g.isRecurring && month % 12 === 0)) {
           // Simplified recurring logic: apply every year
           if (g.isRecurring || isGoalMonth) {
             current -= goalValue;
             withdrawn += goalValue;
           }
        }
      });

      // Only push data points for years to keep chart clean, or every month if short duration
      if (timeUnit === 'years' && month % 12 === 0) {
        data.push({ label: `Ano ${month/12}`, value: current, withdrawn });
      } else if (timeUnit === 'months') {
        data.push({ label: `Mês ${month}`, value: current, withdrawn });
      }
    }

    setChartData(data);
  };

  // Auto-calculate when inputs change
  useEffect(() => {
    const timer = setTimeout(() => {
      calculate();
    }, 500); // Debounce calculation
    return () => clearTimeout(timer);
  }, [currentWealth, monthlyContribution, interestRate, duration, goals, timeUnit]);

  // Simple SVG Chart Component (Mobile Friendly)
  const Chart = ({ data }: { data: any[] }) => {
    if (!data.length) return null;
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value)); // Handle negative values
    const range = maxValue - Math.min(0, minValue);
    
    return (
      <div className="w-full overflow-x-auto">
        <div className="h-[300px] min-w-[300px] w-full flex items-end gap-1 relative border-b border-white/10 pb-8 pt-4">
          {data.map((d, i) => {
            // Normalize height between 0 and 100%
            // Ensure minimum height of 2px so bar is visible even if value is 0
            let heightPercent = 0;
            if (range > 0) {
                heightPercent = ((d.value - Math.min(0, minValue)) / range) * 100;
            } else {
                // If range is 0 (all values equal), show 50% height
                heightPercent = 50;
            }
            
            // Ensure minimum visual height
            const visualHeight = Math.max(Math.abs(heightPercent), 2);
            
            return (
              <div key={i} className="flex-1 flex flex-col items-center group relative min-w-[10px]">
                <div 
                  className={`w-full max-w-[20px] rounded-t-sm transition-all duration-500 ${d.value < 0 ? 'bg-red-500' : 'bg-yellow-500'}`}
                  style={{ height: `${visualHeight}%` }}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 pointer-events-none border border-white/10 shadow-xl">
                    <p className="font-bold">{d.label}</p>
                    <p>Saldo: {formatCurrency(d.value)}</p>
                    {d.withdrawn > 0 && <p className="text-red-400">Saque: -{formatCurrency(d.withdrawn)}</p>}
                  </div>
                </div>
                {/* Show label only for some items to avoid clutter */}
                {(i % Math.ceil(data.length / 5) === 0 || i === data.length - 1) && (
                  <span className="text-[10px] text-muted-foreground mt-2 absolute -bottom-6 whitespace-nowrap">{d.label}</span>
                )}
              </div>
            );
          })}
        </div>
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
                  placeholder="0,00" 
                  value={currentWealth}
                  onChange={(e) => handleCurrencyChange(setCurrentWealth, e.target.value)}
                  className="bg-background/50 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label>Aporte Mensal (R$)</Label>
                <Input 
                  placeholder="0,00" 
                  value={monthlyContribution}
                  onChange={(e) => handleCurrencyChange(setMonthlyContribution, e.target.value)}
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
                <div className="flex justify-between items-center">
                  <Label>Projeção</Label>
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
                  placeholder={timeUnit === 'years' ? "Ex: 20" : "Ex: 240"} 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
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
                    placeholder="0,00" 
                    value={newGoal.value}
                    onChange={(e) => handleGoalCurrencyChange(e.target.value)}
                    className="bg-background/50 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{timeUnit === 'years' ? 'Ano' : 'Mês'}</Label>
                  <Input 
                    type="number" 
                    placeholder="Ex: 5" 
                    value={newGoal.time}
                    onChange={(e) => setNewGoal({...newGoal, time: e.target.value})}
                    className="bg-background/50 border-white/10"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="recurring"
                  checked={newGoal.isRecurring}
                  onChange={(e) => setNewGoal({...newGoal, isRecurring: e.target.checked})}
                  className="rounded border-white/10 bg-white/5"
                />
                <Label htmlFor="recurring" className="cursor-pointer">Repetir anualmente?</Label>
              </div>

              <Button onClick={addGoal} variant="secondary" className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Adicionar Objetivo
              </Button>

              {goals.length > 0 && (
                <div className="space-y-2 mt-4">
                  <Label>Objetivos Cadastrados:</Label>
                  {goals.map((g, i) => (
                    <div key={i} className="flex justify-between items-center text-sm bg-white/5 p-2 rounded">
                      <span>
                        {g.name} ({timeUnit === 'years' ? 'Ano' : 'Mês'} {g.time}) 
                        {g.isRecurring && ' (Anual)'}
                      </span>
                      <span className="text-red-400">
                        {g.isRecurring 
                          ? `-${g.value}/ano`
                          : `-${g.value}`
                        }
                      </span>
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
                <p className="text-sm text-muted-foreground">Toque nas barras para ver os valores.</p>
              </CardHeader>
              <CardContent>
                <Chart data={chartData} />
                
                <div className="grid md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
                  <div>
                    <p className="text-sm text-muted-foreground">Patrimônio Final</p>
                    <p className={`text-2xl font-bold ${chartData[chartData.length-1].value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatCurrency(chartData[chartData.length-1].value)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Renda Passiva Estimada (0.8% a.m.)</p>
                    <p className="text-2xl font-bold text-blue-400">
                      {formatCurrency(chartData[chartData.length-1].value * 0.008)} /mês
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Investido</p>
                    <p className="text-xl font-bold text-white">
                      {formatCurrency(
                        (parseFloat(currentWealth.replace(/\./g, "").replace(",", ".") || "0") + 
                        parseFloat(monthlyContribution.replace(/\./g, "").replace(",", ".") || "0") * 
                        (timeUnit === 'years' ? parseInt(duration) * 12 : parseInt(duration)))
                      )}
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
