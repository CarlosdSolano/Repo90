import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// Detecta si index.html está en la raíz o dentro de Repo90-main
const isNested = fs.existsSync(path.resolve(__dirname, 'Repo90-main/index.html'));
const rootDir = isNested ? path.resolve(__dirname, 'Repo90-main') : __dirname;

export default defineConfig({
  plugins: [react()],
  root: rootDir,
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
});