import { CampoDinamico } from "@/components/ferramentas/Campos";
import { CascaFerramenta } from "@/components/ferramentas/CascaFerramenta";
import { PainelResultado } from "@/components/ferramentas/Resultado";
import {
  estaPronto,
  faltando,
  paraCalculo,
  valoresExemplo,
  valoresIniciais,
  type Ferramenta,
  type Valores,
} from "@/lib/ferramentas/tipos";
import { useMemo, useState } from "react";

/**
 * Motor declarativo: monta o formulário a partir de `campos` e recalcula a cada
 * tecla. Abre vazia — o resultado só aparece depois que os campos obrigatórios
 * forem preenchidos.
 */
export default function FerramentaGenerica({ f }: { f: Ferramenta }) {
  const campos = f.campos || {};
  const opcionais = f.opcionais || [];
  const [valores, setValores] = useState<Valores>(() => valoresIniciais(campos));

  const alterar = (chave: string, valor: any) =>
    setValores((v) => ({ ...v, [chave]: valor }));

  const pronto = estaPronto(campos, valores, opcionais);
  const faltam = faltando(campos, valores, opcionais);

  const resultado = useMemo(() => {
    if (!pronto || !f.calc) return null;
    try {
      return f.calc(paraCalculo(campos, valores));
    } catch {
      return null;
    }
  }, [f, campos, valores, pronto]);

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
        <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-white/15 bg-black/20 p-5">
          <p className="text-sm text-muted-foreground">
            {faltam === 1
              ? "Falta preencher um campo para ver o resultado."
              : `Faltam ${faltam} campos para ver o resultado.`}
          </p>
          <button
            type="button"
            onClick={() => setValores(valoresExemplo(campos))}
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Ver um exemplo preenchido
          </button>
        </div>
      )}
    </CascaFerramenta>
  );
}
