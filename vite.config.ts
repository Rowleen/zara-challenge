import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

function normalizeApiBase(url: string) {
  return url.replace(/\/products\/?$/, "").replace(/\/$/, "");
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, "");
  const apiBase = normalizeApiBase(env.API_BASE_URL || "");
  const apiKey = env.API_KEY;

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(rootDir, "src"),
        "@styles": path.resolve(rootDir, "src/styles"),
        "@assets": path.resolve(rootDir, "src/assets"),
        "@components": path.resolve(rootDir, "src/components"),
        "@lib": path.resolve(rootDir, "src/lib"),
      },
    },
    server: {
      proxy: apiBase
        ? {
            "/api": {
              target: apiBase,
              changeOrigin: true,
              rewrite: (requestPath) => requestPath.replace(/^\/api/, ""),
              headers: apiKey ? { "x-api-key": apiKey } : undefined,
            },
          }
        : undefined,
    },
  };
});
