import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 9000,
    headers: {
      "Cross-Origin-Opener-Policy-Report-Only": "same-origin",
      "Cross-Origin-Embedder-Policy-Report-Only": "require-corp",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods":
        "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
  },
  build: {
    sourcemap: true,
  },
});
