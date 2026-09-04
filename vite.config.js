import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'Repo90-main',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});