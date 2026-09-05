import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' hace que todas las rutas de los assets generados sean relativas.
// Esto es imprescindible para que el build funcione igual:
//  - servido en la raíz de un dominio
//  - servido en una subcarpeta (p. ej. GitHub Pages: usuario.github.io/repo/)
//  - empaquetado dentro de una app nativa con Capacitor (file:// en Android/iOS)
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
