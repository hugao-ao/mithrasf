import { Button } from "@/components/ui/button";
import type { Ferramenta } from "@/lib/ferramentas/tipos";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

/** Cabeçalho comum a todas as ferramentas: voltar, ícone, nome e a linha de "como funciona". */
export function CascaFerramenta({
  f,
  children,
}: {
  f: Ferramenta;
  children: React.ReactNode;
}) {
  const Icone = f.icone;
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 pb-20">
      <Link href="/ferramentas">
        <Button variant="ghost" className="-ml-2 w-fit gap-2 text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" />
          Todas as ferramentas
        </Button>
      </Link>

      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Icone className="h-6 w-6 text-primary" />
        </span>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-white md:text-3xl">
            {f.nome}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{f.como}</p>
        </div>
      </div>

      {children}
    </div>
  );
}
