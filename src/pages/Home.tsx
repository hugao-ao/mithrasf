import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, CheckCircle2, MessageCircle, ShieldCheck, Target, TrendingUp, Wallet } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 lg:py-32 overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 text-primary text-sm font-medium bg-primary/5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Consultoria Financeira Direto ao Ponto
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-tight text-white">
              Realize seus objetivos <br />
              <span className="gold-gradient-text">sem virar expert</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              O mercado financeiro complica para te vender cursos caros e produtos ruins. Nós fazemos o oposto: te damos o caminho pronto, seguro e sem enrolação.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/planos">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-14 px-8 text-lg shadow-lg shadow-primary/10 font-semibold w-full sm:w-auto">
                  Ver Planos <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/ferramentas">
                <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 rounded-lg h-14 px-8 text-lg w-full sm:w-auto">
                  Testar Ferramentas Grátis
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex-1 relative w-full max-w-md lg:max-w-none mx-auto">
            <div className="relative z-10 emerald-card p-8 md:p-10 rotate-3 hover:rotate-0 transition-transform duration-500 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                    <span className="text-red-500 font-bold text-xl">✕</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Sem Cursos Intermináveis</h3>
                    <p className="text-sm text-muted-foreground">Você não precisa assistir 50h de aula para saber onde investir.</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                    <span className="text-red-500 font-bold text-xl">✕</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Sem "Gerentês"</h3>
                    <p className="text-sm text-muted-foreground">Zero conflito de interesse. Não ganhamos comissão sobre o que indicamos.</p>
                  </div>
                </div>

                <div className="h-px bg-border/50 my-4"></div>

                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Acesso Direto e Rápido</h3>
                    <p className="text-sm text-muted-foreground">Tem uma dúvida? Manda no WhatsApp e um especialista resolve.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* Tools Showcase Section */}
      <section className="py-12 md:py-20 bg-white/5 rounded-3xl my-12 border border-white/5">
        <div className="text-center mb-12 space-y-4 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Ferramentas Poderosas (e Gratuitas)</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comece a organizar sua vida agora mesmo. Nossas ferramentas mostram a verdade sobre o seu dinheiro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-8">
          {[
            {
              title: "Diagnóstico Financeiro",
              desc: "Descubra o 'rombo' oculto no seu orçamento anual.",
              icon: Wallet,
              link: "/ferramentas/fluxo-caixa"
            },
            {
              title: "O Oráculo",
              desc: "Simule seu patrimônio futuro e planeje sua liberdade.",
              icon: TrendingUp,
              link: "/ferramentas/oraculo"
            },
            {
              title: "Simulador Imóveis",
              desc: "Veja quanto você perde de juros no financiamento.",
              icon: Calculator,
              link: "/ferramentas/simulador-imobiliario"
            },
            {
              title: "Comparador Cartões",
              desc: "Milhas ou Cashback? Descubra qual vale mais.",
              icon: CheckCircle2,
              link: "/ferramentas/comparador-cartoes"
            }
          ].map((tool, i) => (
            <Link key={i} href={tool.link}>
              <div className="group h-full bg-background border border-white/10 p-6 rounded-xl hover:border-primary/50 transition-all cursor-pointer hover:-translate-y-1">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <tool.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{tool.title}</h3>
                <p className="text-sm text-muted-foreground">{tool.desc}</p>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <p className="text-sm text-muted-foreground mb-4">
            *Clientes Premium têm acesso a versões avançadas e personalizadas dessas ferramentas.
          </p>
          <Link href="/ferramentas">
            <Button variant="link" className="text-primary">Ver todas as ferramentas &rarr;</Button>
          </Link>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-12 md:py-20">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Simples assim:</h2>
          <p className="text-muted-foreground text-lg">O caminho mais curto entre seu desejo e a realização.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative px-4">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2 z-0"></div>

          {[
            {
              step: "1",
              title: "Tenho um Objetivo",
              desc: "Seja comprar um carro, investir ou organizar as contas.",
              icon: Target
            },
            {
              step: "2",
              title: "Falo com Consultor",
              desc: "Envio uma mensagem e recebo a estratégia pronta.",
              icon: MessageCircle
            },
            {
              step: "3",
              title: "Realizo com Segurança",
              desc: "Executo o plano sabendo que é a melhor opção para mim.",
              icon: ShieldCheck
            }
          ].map((item, i) => (
            <div key={i} className="relative z-10 emerald-card p-8 text-center hover:-translate-y-2 transition-transform duration-300 bg-background border border-primary/20">
              <div className="h-16 w-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-primary shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                {item.icon ? <item.icon className="h-8 w-8" /> : item.step}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="emerald-card p-8 md:p-12 relative overflow-hidden text-center border-primary/20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Pare de adiar seus sonhos por falta de orientação
            </h2>
            <p className="text-lg text-muted-foreground">
              Tenha a segurança de um especialista cuidando dos seus interesses, sem letras miúdas e sem cursos chatos.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/planos">
                <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg h-14 px-8 text-lg font-bold">
                  Escolher meu Plano
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-muted-foreground text-sm justify-center">
                <CheckCircle2 className="h-4 w-4 text-primary" /> A partir de R$ 29,90/mês
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
