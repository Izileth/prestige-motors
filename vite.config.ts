import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  build: {
    outDir: 'build',
    ssr: true, 
    rollupOptions: {
      input: {
        server: 'src/entry-server.tsx', // Ponto de entrada do SSR
        client: 'index.html'
      }
    }
  }

});