import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Questo 'base: "./"' è fondamentale: dice a Vite di usare percorsi relativi.
  // Permette all'app di funzionare anche se aperta direttamente come file locale (file://)
  // o se ospitata in una sottocartella.
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});