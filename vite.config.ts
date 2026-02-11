import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

// Fix for environments where import.meta.dirname is not available (Node < 20)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
