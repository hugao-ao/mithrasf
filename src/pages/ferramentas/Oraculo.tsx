import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, formatCurrencyInput, parseCurrency } from "@/lib/formatters";
import { ArrowLeft, CheckCircle2, LineChart, Plus, Trash2, Calculator, X, TrendingUp } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function Oraculo() {
  // --- Widget Quanto Rende ---
  const [rendaOpen, setRendaOpen] = useState(false);
  const [rendaValor, setRendaValor] = useState("");
  const [rendaTaxa, setRendaTaxa] = useState("");
  const [rendaTipoTaxa, setRendaTipoTaxa] = useState<'mensal' | 'anual'>('anual');

  const rendaResultado = useMemo(() => {
    const valor = parseCurrency(rendaValor);
    const taxa = parseFloat(rendaTaxa.replace(",", ".") || "0");
    if (!valor || !taxa) return null;
    let taxaMensal: number;
    if (rendaTipoTaxa === 'anual') {
      taxaMensal = Math.pow(1 + taxa / 100, 1 / 12) - 1;
    } else {
      taxaMensal = taxa / 100;
    }
    const rendimentoMensal = valor * taxaMensal;
    const rendimentoAnual = valor * (Math.pow(1 + taxaMensal, 12) - 1);
    const taxaMensalReal = taxaMensal * 100;
    const taxaAnualReal = (Math.pow(1 + taxaMensal, 12) - 1) * 100;
    return { rendimentoMensal, rendimentoAnual, taxaMensalReal, taxaAnualReal };
  }, [rendaValor, rendaTaxa, rendaTipoTaxa]);
  // --- Fim Widget ---

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
    // Use parseCurrency helper to ensure correct parsing (handles "R$ 1.000,00" -> 1000.00)
    const wealth = typeof currentWealth === 'string' ? parseCurrency(currentWealth) : 0;
    const contribution = typeof monthlyContribution === 'string' ? parseCurrency(monthlyContribution) : 0;
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
        const goalValue = typeof g.value === 'string' ? parseCurrency(g.value) : 0;
        
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

  return (
    <>
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
                <p className="text-sm text-muted-foreground">Acompanhe o crescimento do seu patrimônio ao longo do tempo.</p>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#EAB308" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis 
                        dataKey="label" 
                        stroke="#666" 
                        tick={{fill: '#666'}}
                        minTickGap={30}
                      />
                      <YAxis 
                        stroke="#666" 
                        tick={{fill: '#666'}}
                        tickFormatter={(value) => 
                          new Intl.NumberFormat('pt-BR', {
                            notation: "compact",
                            compactDisplay: "short"
                          }).format(value)
                        }
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#EAB308" 
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <p className="text-sm text-muted-foreground">Patrimônio Final</p>
                    <p className="text-2xl font-bold text-yellow-500">
                      {formatCurrency(chartData[chartData.length - 1].value)}
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Investido</p>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(
                        (typeof currentWealth === 'string' ? parseCurrency(currentWealth) : 0) + 
                        (typeof monthlyContribution === 'string' ? parseCurrency(monthlyContribution) : 0) * 
                        (timeUnit === 'years' ? parseInt(duration) * 12 : parseInt(duration))
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gatilho de Venda */}
            <div className="bg-card border border-white/10 rounded-xl p-6 space-y-4">
              <p className="text-sm font-semibold text-white">O que essa ferramenta não faz:</p>
              <p className="text-sm text-muted-foreground">
                Ela projeta um cenário com base nos números que você informou, mas não valida se esses números são realistas. Por exemplo — a taxa de juros que você usou é a que você <span className="text-white font-medium">realmente consegue</span> no seu perfil de investidor? Você está considerando o imposto de renda sobre os rendimentos? E o aporte mensal é sustentável ou é o valor que você <em>gostaria</em> de investir?
              </p>
              <p className="text-sm text-muted-foreground">
                Para transformar essa projeção em um plano real — com <span className="text-white font-medium">alocacao adequada, metas concretas e acompanhamento</span> — isso exige uma análise personalizada.
              </p>
              <Link href="/planos">
                <Button variant="outline" className="w-full md:w-auto border-primary text-primary hover:bg-primary/10">
                  Quero transformar essa projeção em um plano real
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>

      {/* Widget Flutuante: Quanto Rende? */}
      {/* Botão de abertura */}
      <button
        onClick={() => setRendaOpen(!rendaOpen)}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full font-bold text-sm shadow-2xl transition-all duration-300 ${
          rendaOpen
            ? "bg-yellow-500 text-black pr-3"
            : "bg-yellow-500 text-black hover:bg-yellow-400 hover:scale-105"
        }`}
        title="Calculadora rápida de rendimento"
      >
        {rendaOpen ? (
          <><X className="h-4 w-4" /> Fechar</>
        ) : (
          <><Calculator className="h-4 w-4" /> Quanto rende?</>
        )}
      </button>

      {/* Painel do widget */}
      {rendaOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 bg-[#111] border border-yellow-500/30 rounded-2xl shadow-2xl shadow-yellow-500/10 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-yellow-500" />
            <span className="text-yellow-500 font-bold text-sm">Calculadora de Rendimento</span>
          </div>

          <div className="p-4 space-y-4">
            {/* Valor */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Valor investido (R$)</Label>
              <Input
                placeholder="Ex: 100.000,00"
                value={rendaValor}
                onChange={(e) => setRendaValor(formatCurrencyInput(e.target.value))}
                className="bg-white/5 border-white/10 text-white h-9 text-sm"
              />
            </div>

            {/* Taxa + tipo */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Taxa de juros (%)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Ex: 12"
                  value={rendaTaxa}
                  onChange={(e) => setRendaTaxa(e.target.value)}
                  className="bg-white/5 border-white/10 text-white h-9 text-sm flex-1"
                />
                <div className="flex rounded-md overflow-hidden border border-white/10">
                  <button
                    onClick={() => setRendaTipoTaxa('anual')}
                    className={`px-2 py-1 text-xs font-medium transition-colors ${
                      rendaTipoTaxa === 'anual'
                        ? 'bg-yellow-500 text-black'
                        : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                    }`}
                  >
                    a.a.
                  </button>
                  <button
                    onClick={() => setRendaTipoTaxa('mensal')}
                    className={`px-2 py-1 text-xs font-medium transition-colors ${
                      rendaTipoTaxa === 'mensal'
                        ? 'bg-yellow-500 text-black'
                        : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                    }`}
                  >
                    a.m.
                  </button>
                </div>
              </div>
            </div>

            {/* Resultado */}
            {rendaResultado ? (
              <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Rende por mês</span>
                  <span className="text-yellow-500 font-bold text-base">{formatCurrency(rendaResultado.rendimentoMensal)}</span>
                </div>
                <div className="h-px bg-white/5" />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Rende por ano</span>
                  <span className="text-white font-semibold text-sm">{formatCurrency(rendaResultado.rendimentoAnual)}</span>
                </div>
                <div className="h-px bg-white/5" />
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Taxa mensal</p>
                    <p className="text-xs font-semibold text-white">{rendaResultado.taxaMensalReal.toFixed(4).replace('.', ',')}% a.m.</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Taxa anual</p>
                    <p className="text-xs font-semibold text-white">{rendaResultado.taxaAnualReal.toFixed(2).replace('.', ',')}% a.a.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/3 border border-white/5 rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground">Preencha o valor e a taxa para ver o resultado em tempo real.</p>
              </div>
            )}

            {/* Aviso discreto + CTA */}
            <div className="flex items-start justify-between gap-2 pt-1">
              <p className="text-[10px] text-muted-foreground/60 leading-tight">
                Valores brutos, sem descontar IR e IOF.
              </p>
              <Link href="/planos" onClick={() => setRendaOpen(false)}>
                <span className="text-[10px] text-yellow-500/70 hover:text-yellow-500 whitespace-nowrap cursor-pointer transition-colors">
                  Ver planos &rarr;
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
