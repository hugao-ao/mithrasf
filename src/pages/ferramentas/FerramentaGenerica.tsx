import { CampoDinamico } from "@/components/ferramentas/Campos";
import { CascaFerramenta } from "@/components/ferramentas/CascaFerramenta";
import { PainelResultado } from "@/components/ferramentas/Resultado";
import { valoresIniciais, type Ferramenta, type Valores } from "@/lib/ferramentas/tipos";
import { useMemo, useState } from "react";

/**
 * Motor declarativo: monta o formulário a partir de `campos` e recalcula a cada
 * tecla. Já abre preenchida com números reais, para servir também em gravação.
 */
export default function FerramentaGenerica({ f }: { f: Ferramenta }) {
  const campos = f.campos || {};
  const [valores, setValores] = useState<Valores>(() => valoresIniciais(campos));

  const alterar = (chave: string, valor: any) =>
    setValores((v) => ({ ...v, [chave]: valor }));

  const resultado = useMemo(() => {
    try {
      return f.calc ? f.calc(valores) : null;
    } catch {
      return null;
    }
  }, [f, valores]);

  return (
    <CascaFerramenta f={f}>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {Object.entries(campos).map(([chave, campo]) => (
          <CampoDinamico
            key={chave}
            chave={chave}
            campo={campo}
            valores={valores}
            onChange={alterar}
          />
        ))}
      </div>

      {resultado ? (
        <PainelResultado r={resultado} />
      ) : (
        <p className="rounded-xl border border-white/10 bg-black/20 p-5 text-sm text-muted-foreground">
          Preencha os campos acima para ver o resultado.
        </p>
      )}
    </CascaFerramenta>
  );
}
