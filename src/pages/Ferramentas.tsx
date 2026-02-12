import { Button } from "@/components/ui/button";
import { Calculator, CreditCard, Home, LineChart, ShoppingBag, Wallet } from "lucide-react";
import { Link } from "wouter";

export default function Ferramentas() {
  const tools = [
    {
      name: "Comparador de Preços",
      description: "Descubra qual produto vale mais a pena levar (ex: embalagem econômica vs normal).",
      icon: ShoppingBag,
      link: "/ferramentas/comparador-precos",
      color: "text-blue-400"
    },
    {
      name: "Calculadora de Juros Reais",
      description: "Descubra os juros embutidos em parcelas 'sem juros' e veja se compensa pagar à vista.",
      icon: Calculator,
      link: "/ferramentas/calculadora-juros",
      color: "text-green-400"
    },
    {
      name: "Simulador Imobiliário",
      description: "Compare SAC vs Price e veja quanto você vai pagar de juros no final do financiamento.",
      icon: Home,
      link: "/ferramentas/simulador-imobiliario",
      color: "text-yellow-400"
    },
    {
      name: "Comparador de Cartões",
      description: "Coloque dois cartões lado a lado e decida qual oferece os melhores benefícios para você.",
      icon: CreditCard,
      link: "/ferramentas/comparador-cartoes",
      color: "text-purple-400"
    },
    {
      name: "Teste de Fluxo de Caixa",
      description: "Descubra para onde seu dinheiro está indo com este teste rápido e revelador.",
      icon: Wallet,
      link: "/ferramentas/fluxo-caixa",
      color: "text-red-400"
    },
    {
      name: "O Oráculo Financeiro",
      description: "Projete seu patrimônio futuro e veja como seus objetivos impactam sua liberdade financeira.",
      icon: LineChart,
      link: "/ferramentas/oraculo",
      color: "text-gold-400" // Custom gold color class needed or use text-yellow-500
    }
  ];

  return (
    <div className="space-y-12 pb-20">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Ferramentas <span className="gold-gradient-text">Gratuitas</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Calculadoras e simuladores para te ajudar a tomar decisões melhores agora mesmo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <Link key={index} href={tool.link}>
            <div className="group relative bg-card/40 border border-white/5 hover:border-primary/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-card/60 cursor-pointer h-full flex flex-col">
              <div className={`h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${tool.color}`}>
                <tool.icon className="h-6 w-6" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                {tool.name}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-6 flex-1">
                {tool.description}
              </p>

              <div className="flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-2 group-hover:translate-x-0">
                Acessar Ferramenta →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
