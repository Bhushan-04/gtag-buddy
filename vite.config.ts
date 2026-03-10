import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    strictPort: true,
    allowedHosts: [
      'uncopyrighted-hang-nonmaternal.ngrok-free.dev',
    ],
    hmr: {
      clientPort: 443,
      host: 'uncopyrighted-hang-nonmaternal.ngrok-free.dev',
      protocol: 'wss',
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
