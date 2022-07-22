import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "lib/index.ts",
      name: "reactAuthRouter",
      fileName: "index",
      formats: ["es", "cjs", "umd"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react-router-dom"],
      output: {
        globals: {
          "react-router-dom": "reactRouterDom",
          react: "React",
        },
      },
    },
  },
});
