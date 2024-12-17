import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import path from "path";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  plugins: [react(), wasm(), topLevelAwait()],
  build: {
    target: "esnext",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
