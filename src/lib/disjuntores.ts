/**
 * Quadro de Disjuntores.
 *
 * O consultor liga e desliga a contratação de cada plano por uma tela na área
 * logada. Aqui a gente só lê: disjuntor desligado significa que o botão de
 * assinar não leva a lugar nenhum — abre um aviso de manutenção.
 *
 * Falha de leitura NÃO corta a venda. Se o Supabase não responder, tudo segue
 * liberado: uma oscilação de rede não pode derrubar a loja.
 */
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { Nivel } from "./planos";

/** A tabela usa nivel_1..nivel_5; o site usa I..V. */
const ID_POR_NIVEL: Record<Nivel, string> = {
  I: "nivel_1",
  II: "nivel_2",
  III: "nivel_3",
  IV: "nivel_4",
  V: "nivel_5",
};

export const ID_PLANO_REFERENCIA = "plano_referencia";

type Disjuntores = Record<string, boolean>;

export async function lerDisjuntores(): Promise<Disjuntores> {
  const { data, error } = await supabase
    .from("disjuntores_planos")
    .select("plano_id, contratacao_ativa");

  if (error || !data) return {};

  const mapa: Disjuntores = {};
  for (const linha of data) {
    mapa[linha.plano_id as string] = linha.contratacao_ativa !== false;
  }
  return mapa;
}

export function useDisjuntores() {
  const [mapa, setMapa] = useState<Disjuntores>({});

  useEffect(() => {
    let vivo = true;
    lerDisjuntores()
      .then((m) => {
        if (vivo) setMapa(m);
      })
      .catch(() => {
        /* sem disjuntores conhecidos = tudo liberado */
      });
    return () => {
      vivo = false;
    };
  }, []);

  /** Ausente ou true = liberado. Só um false explícito corta. */
  const liberado = (planoId: string) => mapa[planoId] !== false;

  return {
    liberado,
    liberadoPorNivel: (nivel: Nivel) => liberado(ID_POR_NIVEL[nivel]),
  };
}
