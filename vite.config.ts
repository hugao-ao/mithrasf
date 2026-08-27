import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";

import { PLANOS, PRECO_DIAGNOSTICO, BENEFICIOS_COMUNS } from "./src/lib/planos";

// Fix for environments where import.meta.dirname is not available (Node < 20)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Publica /planos.json junto com o site, gerado do próprio src/lib/planos.ts.
 *
 * Existe para o diagnóstico financeiro (repositório siteteste) ler os planos
 * daqui em vez de manter a própria cópia — as duas já divergiram uma vez, com
 * o Nível IV cobrando R$ 299,90 lá e R$ 179,90 aqui. Publicou o site, a tela
 * de adesão acompanha, sem ninguém precisar lembrar de atualizar os dois.
 *
 * Se este arquivo parar de ser gerado, o diagnóstico continua funcionando com
 * a última versão que baixou — mas volta a envelhecer em silêncio.
 */
function publicarPlanosJson(): Plugin {
  return {
    name: "publicar-planos-json",
    apply: "build",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "planos.json",
        source: JSON.stringify(
          {
            gerado_em: new Date().toISOString(),
            preco_diagnostico: PRECO_DIAGNOSTICO,
            beneficios_comuns: BENEFICIOS_COMUNS,
            planos: PLANOS,
          },
          null,
          2,
        ),
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), publicarPlanosJson()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  root: __dirname, // Define a raiz como a pasta atual
  build: {
    outDir: "dist", // Simplifica a saída para 'dist'
    emptyOutDir: true,
  },
});
