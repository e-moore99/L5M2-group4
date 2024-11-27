import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: "./src/App.jsx", // entry point for the app
    },
  },
  server: {
    port: 5173, // default port unless overridden
  },
  optimizeDeps: {
    exclude: ["src/backend/*"], // ignore backend files
  },
});
