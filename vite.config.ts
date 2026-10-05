import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, "");
  const bffPort = Number(env.PORT) || 3000;
  const bffOrigin =
    env.VITE_DEV_BFF_URL || `http://127.0.0.1:${bffPort}`;

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(rootDir, "src"),
        "@styles": path.resolve(rootDir, "src/styles"),
        "@assets": path.resolve(rootDir, "src/assets"),
        "@components": path.resolve(rootDir, "src/components"),
        "@lib": path.resolve(rootDir, "src/lib"),
        "@services": path.resolve(rootDir, "src/services"),
        "@test": path.resolve(rootDir, "src/test"),
        "@context": path.resolve(rootDir, "src/context"),
        "@hooks": path.resolve(rootDir, "src/hooks"),
        "@pages": path.resolve(rootDir, "src/pages"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: bffOrigin,
          changeOrigin: true,
        },
      },
    },
    test: {
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
      css: true,
      globals: true,
      exclude: ["**/node_modules/**", "**/e2e/**", "**/dist/**"],
    },
  };
});
