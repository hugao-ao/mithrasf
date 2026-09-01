import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
import { PLANOS, PRECO_DIAGNOSTICO } from "./src/lib/planos";

// Fix for environments where import.meta.dirname is not available (Node < 20)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Publica os planos como /planos.json junto com o site.
 *
 * A área logada (diagnóstico financeiro) lê esse arquivo para montar a tela de
 * adesão. Assim o preço e o escopo saem de um lugar só — este repositório —
 * e o resto acompanha sem precisar de outra publicação.
 *
 * O arquivo é gerado do próprio planos.ts a cada build; não existe cópia
 * manual para desencontrar.
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
