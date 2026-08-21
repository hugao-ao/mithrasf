import { AREAS, FERRAMENTAS } from "@/lib/ferramentas/catalogo";
import type { Ferramenta } from "@/lib/ferramentas/tipos";
import { Link } from "wouter";

/**
 * Vitrine agrupada pelas áreas que o plano cobre. O card cresce por escala — não
 * por altura — para a grade não pular quando o mouse passa. Em telas de toque,
 * onde não existe hover, a descrição já aparece.
 */
function Card({ f }: { f: Ferramenta }) {
  const Icone = f.icone;
  return (
    <Link href={`/ferramentas/${f.slug}`}>
      <div
        className="group relative flex h-auto min-h-[176px] cursor-pointer flex-col gap-2.5 rounded-2xl border border-white/5 bg-card/50 p-5 transition-[transform,border-color,background-color,box-shadow] duration-300 ease-out hover:z-10 hover:border-primary/40 hover:bg-card hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.75)] focus-visible:border-primary/40 focus-visible:outline-none can-hover:h-44 can-hover:hover:scale-[1.055]"
        tabIndex={0}
      >
        {f.nova && (
          <span className="absolute right-3.5 top-3.5 rounded-full border border-primary/35 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-primary">
            nova
          </span>
        )}

        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 transition-colors duration-300 group-hover:bg-primary/10">
          <Icone className="h-5 w-5 text-primary" />
        </span>

        <h3 className="text-[0.98rem] font-bold leading-tight tracking-tight text-white">
          {f.nome}
        </h3>

        <p className="text-[0.8rem] leading-snug text-muted-foreground transition-[opacity,transform] duration-300 can-hover:translate-y-1 can-hover:opacity-0 can-hover:group-hover:translate-y-0 can-hover:group-hover:opacity-100 can-hover:group-focus-visible:translate-y-0 can-hover:group-focus-visible:opacity-100">
          {f.desc}
        </p>
      </div>
    </Link>
  );
}

export default function Ferramentas() {
  const porArea = AREAS.map((area) => ({
    area,
    itens: FERRAMENTAS.filter((f) => f.area === area),
  })).filter((g) => g.itens.length > 0);

  return (
    <div className="space-y-12 pb-20">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-white md:text-5xl">
          Ferramentas <span className="gold-gradient-text">Gratuitas</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Vinte e duas calculadoras, todas em até seis perguntas. Passe o mouse para ver o que cada
          uma faz.
        </p>
      </div>

      <div className="space-y-10">
        {porArea.map(({ area, itens }) => (
          <section key={area} className="space-y-4">
            <div className="flex items-center gap-3.5">
              <span className="whitespace-nowrap text-xs font-bold uppercase tracking-[0.15em] text-primary">
                {area}
              </span>
              <span className="h-px flex-1 bg-white/5" />
              <span className="text-xs tabular-nums text-muted-foreground">{itens.length}</span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {itens.map((f) => (
                <Card key={f.slug} f={f} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
