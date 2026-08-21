import { porSlug } from "@/lib/ferramentas/catalogo";
import NotFound from "@/pages/NotFound";
import { useRoute } from "wouter";
import FerramentaGenerica from "./FerramentaGenerica";
import FluxoCaixa from "./FluxoCaixa";
import Oraculo from "./Oraculo";
import QualDivida from "./QualDivida";

/**
 * Uma rota só para as 22 ferramentas. As declarativas caem no motor genérico;
 * as três com tela própria têm componente dedicado.
 */
export default function RotaFerramenta() {
  const [, params] = useRoute("/ferramentas/:slug");
  const f = params?.slug ? porSlug(params.slug) : undefined;

  if (!f) return <NotFound />;

  if (f.custom === "fluxo") return <FluxoCaixa key={f.slug} f={f} />;
  if (f.custom === "dividas") return <QualDivida key={f.slug} f={f} />;
  if (f.custom === "oraculo") return <Oraculo key={f.slug} f={f} />;

  return <FerramentaGenerica key={f.slug} f={f} />;
}
