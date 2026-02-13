import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, formatCurrencyInput } from "@/lib/formatters";
import { ArrowLeft, CheckCircle2, Plus, Trash2, Wallet } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

type Item = {
  id: number;
  name: string;
  value: string;
};

export default function FluxoCaixa() {
  const [step, setStep] = useState(1);
  const [incomes, setIncomes] = useState<Item[]>([]);
  const [investments, setInvestments] = useState<Item[]>([]);
  const [fixedExpenses, setFixedExpenses] = useState<Item[]>([]);
  const [variableExpenses, setVariableExpenses] = useState<Item[]>([]);
  
  const [newItem, setNewItem] = useState({ name: "", value: "" });
  const [result, setResult] = useState<any>(null);

  const handleCurrencyChange = (value: string) => {
    const formatted = formatCurrencyInput(value);
    setNewItem({ ...newItem, value: formatted });
  };

  const addItem = (list: Item[], setList: any) => {
    if (newItem.name && newItem.value) {
      setList([...list, { id: Date.now(), ...newItem }]);
      setNewItem({ name: "", value: "" });
    }
  };

  const removeItem = (id: number, list: Item[], setList: any) => {
    setList(list.filter(item => item.id !== id));
  };

  const getTotal = (list: Item[]) => {
    return list.reduce((acc, item) => {
      const val = parseFloat(item.value.replace(/\./g, "").replace(",", ".") || "0");
      return acc + val;
    }, 0);
  };

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
      setNewItem({ name: "", value: "" });
    } else {
      calculate();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setNewItem({ name: "", value: "" });
    }
  };

  const calculate = () => {
    const totalIncome = getTotal(incomes);
    const totalInvest = getTotal(investments);
    const totalFixed = getTotal(fixedExpenses);
    const totalVariable = getTotal(variableExpenses);

    const totalExpenses = totalFixed + totalVariable + totalInvest;
    const balance = totalIncome - totalExpenses;
    const yearlyLoss = balance * 12;

    setResult({
      totalIncome,
      totalInvest,
      totalFixed,
      totalVariable,
      totalExpenses,
      balance,
      yearlyLoss
    });
    setStep(5);
  };

  const renderStep = (
    title: string, 
    description: string, 
    list: Item[], 
    setList: any, 
    placeholderName: string,
    colorClass: string
  ) => (
    <Card className="bg-card/50 border-white/10">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-muted-foreground">Passo {step} de 4</span>
          <div className="h-2 w-32 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${colorClass}`} 
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <CardTitle className="text-2xl text-white">{title}</CardTitle>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className={`text-2xl font-bold ${colorClass.replace('bg-', 'text-')}`}>
              {formatCurrency(getTotal(list))}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Item Form */}
        <div className="grid grid-cols-[1fr,1fr,auto] gap-4 items-end">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input 
              placeholder={placeholderName}
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="bg-background/50 border-white/10"
              onKeyDown={(e) => e.key === 'Enter' && addItem(list, setList)}
            />
          </div>
          <div className="space-y-2">
            <Label>Valor (R$)</Label>
            <Input 
              placeholder="0,00"
              value={newItem.value}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="bg-background/50 border-white/10"
              onKeyDown={(e) => e.key === 'Enter' && addItem(list, setList)}
            />
          </div>
          <Button onClick={() => addItem(list, setList)} size="icon" className={colorClass}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* List */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
          {list.length === 0 && (
            <p className="text-center text-muted-foreground py-8 italic">Nenhum item adicionado ainda.</p>
          )}
          {list.map((item) => (
            <div key={item.id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg animate-in fade-in slide-in-from-bottom-2">
              <span className="font-medium">{item.name}</span>
              <div className="flex items-center gap-4">
                <span>{item.value}</span>
                <button 
                  onClick={() => removeItem(item.id, list, setList)}
                  className="text-muted-foreground hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          {step > 1 && (
            <Button onClick={prevStep} variant="outline" className="w-1/3 h-12 text-lg font-bold border-white/10 hover:bg-white/5">
              Voltar
            </Button>
          )}
          <Button onClick={nextStep} className={`flex-1 h-12 text-lg font-bold ${colorClass} hover:opacity-90`}>
            {step === 4 ? "Ver Resultado Completo" : "Próximo Passo"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/ferramentas">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Wallet className="h-8 w-8 text-blue-400" /> Raio-X do Orçamento
          </h1>
          <p className="text-muted-foreground">Mapeie cada centavo e descubra a verdade sobre suas finanças.</p>
        </div>
      </div>

      {step === 1 && renderStep(
        "Suas Fontes de Renda", 
        "Adicione salários, aluguéis, dividendos e renda extra.", 
        incomes, setIncomes, 
        "Ex: Salário Mensal",
        "bg-green-500"
      )}

      {step === 2 && renderStep(
        "Seus Investimentos Mensais", 
        "Quanto você guarda ou investe todo mês?", 
        investments, setInvestments, 
        "Ex: Aporte Tesouro Direto",
        "bg-blue-500"
      )}

      {step === 3 && renderStep(
        "Despesas Fixas (Obrigatórias)", 
        "Contas que chegam todo mês e são essenciais.", 
        fixedExpenses, setFixedExpenses, 
        "Ex: Aluguel / Condomínio",
        "bg-yellow-500"
      )}

      {step === 4 && renderStep(
        "Despesas Variáveis (Estilo de Vida)", 
        "Gastos com lazer, compras, delivery e supérfluos.", 
        variableExpenses, setVariableExpenses, 
        "Ex: iFood / Uber",
        "bg-red-500"
      )}

      {step === 5 && result && (
        <div className="space-y-6 animate-in fade-in zoom-in-95">
          <Card className={`border-2 ${result.balance >= 0 ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
            <CardContent className="p-8 text-center space-y-6">
              <h2 className="text-3xl font-bold text-white">
                {result.balance >= 0 ? "Você está no Azul!" : "Alerta Vermelho!"}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 py-6">
                <div className="space-y-2 text-left">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Renda Total</span>
                    <span className="text-green-400 font-bold">{formatCurrency(result.totalIncome)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Investimentos</span>
                    <span className="text-blue-400 font-bold">-{formatCurrency(result.totalInvest)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Despesas Fixas</span>
                    <span className="text-yellow-400 font-bold">-{formatCurrency(result.totalFixed)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Despesas Variáveis</span>
                    <span className="text-red-400 font-bold">-{formatCurrency(result.totalVariable)}</span>
                  </div>
                  <div className="h-px bg-white/10 my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Saldo Final</span>
                    <span className={result.balance >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {formatCurrency(result.balance)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center bg-black/20 p-4 rounded-xl">
                  <p className="text-lg text-white mb-2">
                    {result.balance >= 0 ? "Potencial Anual Acumulado" : "Rombo Anual Projetado"}
                  </p>
                  <p className={`text-4xl font-bold ${result.balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {formatCurrency(Math.abs(result.yearlyLoss))}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {result.balance >= 0 
                      ? "Isso é o que você acumula em 1 ano mantendo esse ritmo."
                      : "Se nada mudar, esse é o tamanho da sua dívida em 1 ano."}
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
                {result.balance >= 0 
                  ? "Você tem dinheiro sobrando, mas onde ele está?" 
                  : "Alerta Vermelho! Você está sangrando financeiramente."}
              </h3>
              <p className="text-muted-foreground text-sm mt-2">
                {result.balance >= 0 
                  ? `Você tem ${formatCurrency(result.balance)} que deveriam estar construindo sua liberdade, mas onde eles estão? Se você não vê esse dinheiro, você está queimando patrimônio.`
                  : `Você está perdendo ${formatCurrency(Math.abs(result.balance))} por mês. Isso destrói qualquer plano de futuro. É uma emergência.`}
              </p>
            </div>
            <Link href="/planos">
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                Sim, quero um especialista
              </Button>
            </Link>
          </div>
          
          <Button variant="ghost" onClick={() => {
            setStep(1); 
            setIncomes([]); 
            setInvestments([]); 
            setFixedExpenses([]); 
            setVariableExpenses([]);
          }} className="w-full">
            Refazer Raio-X
          </Button>
        </div>
      )}
    </div>
  );
}
