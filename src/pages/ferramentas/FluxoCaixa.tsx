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
    const yearlyBalance = balance * 12;
    const yearlyIncome = totalIncome * 12;

    // Calcula a intensidade do alerta: |diferença anual| / entradas anuais
    const alertRatio = yearlyIncome > 0 ? Math.abs(yearlyBalance) / yearlyIncome : 0;

    setResult({
      totalIncome,
      totalInvest,
      totalFixed,
      totalVariable,
      totalExpenses,
      balance,
      yearlyLoss: yearlyBalance,
      yearlyIncome,
      alertRatio
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

      {step === 5 && result && (() => {
        // --- Lógica de alerta progressivo ---
        // alertRatio = |diferença anual| / entradas anuais
        const r = result.alertRatio; // 0 a 1+
        const isPositive = result.balance >= 0;

        // Classificação de intensidade (só aplica quando há diferença)
        // < 1% das entradas anuais: equilíbrio (elogio permitido)
        // 1% a 10%: atenção leve
        // 10% a 25%: alerta moderado
        // 25% a 50%: alerta sério
        // > 50%: crise
        const isEquilibrio = r < 0.01;
        const isLeve = r >= 0.01 && r < 0.10;
        const isModerado = r >= 0.10 && r < 0.25;
        const isSério = r >= 0.25 && r < 0.50;
        const isCrise = r >= 0.50;

        // Cores e títulos do card principal
        const cardBorder = isEquilibrio
          ? 'border-green-500 bg-green-500/10'
          : isLeve
          ? (isPositive ? 'border-green-500 bg-green-500/10' : 'border-yellow-500 bg-yellow-500/10')
          : isModerado
          ? 'border-orange-500 bg-orange-500/10'
          : isSério
          ? 'border-red-500 bg-red-500/10'
          : 'border-red-700 bg-red-700/10';

        const mainTitle = isEquilibrio
          ? (isPositive ? 'Seu orçamento está equilibrado.' : 'Quase no zero a zero.')
          : isLeve
          ? (isPositive ? 'Sobra pouca coisa — mas sobra.' : 'Pequeno vazamento no orçamento.')
          : isModerado
          ? (isPositive ? 'Sobra existe, mas some rápido.' : 'Seu orçamento está no vermelho.')
          : isSério
          ? (isPositive ? 'Sobra significativa sem destino.' : 'Descontrole financeiro sério.')
          : (isPositive ? 'Dinheiro sobrando sem trabalhar por você.' : 'Situação crítica. Isso não é sustentável.');

        const yearlyLabel = isPositive ? 'Potencial Anual Acumulado' : 'Rombo Anual Projetado';
        const yearlyColor = isEquilibrio || isLeve
          ? (isPositive ? 'text-green-500' : 'text-yellow-400')
          : isModerado
          ? 'text-orange-400'
          : 'text-red-500';
        const yearlySubtext = isPositive
          ? 'Isso é o que você acumula em 1 ano mantendo esse ritmo.'
          : 'Se nada mudar, esse é o tamanho da sua dívida em 1 ano.';

        // Mensagem de alerta progressiva
        const alertMsg = isEquilibrio
          ? null // sem alerta
          : isLeve && isPositive
          ? `Você tem ${formatCurrency(result.balance)}/mês sobrando, mas essa margem é pequena. Qualquer imprevisto pode virar dívida. Saber para onde esse dinheiro vai é o que separa quem acumula de quem fica no mesmo lugar.`
          : isLeve && !isPositive
          ? `Você está gastando ${formatCurrency(Math.abs(result.balance))}/mês a mais do que ganha. Parece pouco, mas em 1 ano já são ${formatCurrency(Math.abs(result.yearlyLoss))}. Pequenos vazamentos afundam qualquer plano.`
          : isModerado && isPositive
          ? `Você tem ${formatCurrency(result.balance)}/mês sobrando — mas onde esse dinheiro está? Se você não sabe responder, ele está desaparecendo. Dinheiro sem destino não constrói patrimônio.`
          : isModerado && !isPositive
          ? `Você está consumindo ${formatCurrency(Math.abs(result.balance))} a mais por mês. Em 1 ano: ${formatCurrency(Math.abs(result.yearlyLoss))} no buraco. Esse ritmo inviabiliza qualquer objetivo financeiro.`
          : isSério && isPositive
          ? `Você tem ${formatCurrency(result.balance)}/mês sem destino definido. Em 1 ano, são ${formatCurrency(result.yearlyLoss)} que deveriam estar trabalhando por você. Dinheiro parado ou gasto sem planejamento é patrimônio desperdiçado.`
          : isSério && !isPositive
          ? `Você está gastando ${formatCurrency(Math.abs(result.balance))} a mais por mês. Em 1 ano: ${formatCurrency(Math.abs(result.yearlyLoss))} de dívida acumulada. Esse nível de descontrole destrói reservas, crédito e qualquer chance de avançar.`
          : isPositive
          ? `Você tem ${formatCurrency(result.balance)}/mês sem destino — em 1 ano são ${formatCurrency(result.yearlyLoss)} evaporando. Nesse volume, a ausência de planejamento é o maior inimigo do seu patrimônio.`
          : `Você está gastando ${formatCurrency(Math.abs(result.balance))} a mais por mês. Em 1 ano: ${formatCurrency(Math.abs(result.yearlyLoss))} de rombo. Isso é uma emergência financeira. Cada mês sem ação aprofunda o buraco.`;

        // CTA do card de venda
        const ctaTitle = isEquilibrio
          ? 'Equilíbrio é o ponto de partida, não o destino.'
          : isLeve
          ? 'Essa ferramenta mostra o diagnóstico. O tratamento é outra coisa.'
          : isModerado
          ? 'Saber o número é o primeiro passo. O segundo é fazer algo com ele.'
          : isSério
          ? 'Esse nível de desequilíbrio não se resolve sozinho.'
          : 'Isso precisa de ação imediata, não de mais ferramentas.';

        const ctaBody = isEquilibrio
          ? `Essa ferramenta mostra que suas contas fecham, mas não analisa se você está investindo bem, se tem reserva de emergência adequada ou se seus objetivos são alcançáveis com esse ritmo. Para isso, é preciso ir além dos números.`
          : `Essa ferramenta mapeia o fluxo, mas não diz o que cortar, o que priorizar nem como reorganizar. Para transformar esse diagnóstico em um plano real de ação, é preciso uma análise personalizada.`;

        const ctaButton = isEquilibrio
          ? 'Quero ir além do equilíbrio e construir patrimônio'
          : isLeve
          ? 'Quero entender o que fazer com esse diagnóstico'
          : isModerado || isSério
          ? 'Quero um plano para reorganizar meu orçamento'
          : 'Quero resolver isso agora';

        return (
        <div className="space-y-6 animate-in fade-in zoom-in-95">
          <Card className={`border-2 ${cardBorder}`}>
            <CardContent className="p-8 text-center space-y-6">
              <h2 className="text-3xl font-bold text-white">{mainTitle}</h2>
              
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
                    <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
                      {formatCurrency(result.balance)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center bg-black/20 p-4 rounded-xl">
                  <p className="text-lg text-white mb-2">{yearlyLabel}</p>
                  <p className={`text-4xl font-bold ${yearlyColor}`}>
                    {formatCurrency(Math.abs(result.yearlyLoss))}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">{yearlySubtext}</p>
                </div>
              </div>

              {/* Mensagem de alerta progressiva */}
              {alertMsg && (
                <div className={`text-left p-4 rounded-xl border ${
                  isLeve ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-200'
                  : isModerado ? 'bg-orange-500/10 border-orange-500/30 text-orange-200'
                  : 'bg-red-500/10 border-red-500/30 text-red-200'
                } text-sm leading-relaxed`}>
                  {alertMsg}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Gatilho de Venda */}
          <div className="bg-card border border-white/10 rounded-xl p-6 space-y-4">
            <p className="text-sm font-semibold text-white">{ctaTitle}</p>
            <p className="text-sm text-muted-foreground">{ctaBody}</p>
            <p className="text-sm text-muted-foreground">
              O que essa ferramenta não faz: ela não analisa <span className="text-white font-medium">qual categoria cortar, como reorganizar prioridades nem se seus investimentos estão adequados ao seu perfil</span>. Para isso, é preciso ir além do mapeamento.
            </p>
            <Link href="/planos">
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                {ctaButton}
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
        );
      })()}
    </div>
  );
}
