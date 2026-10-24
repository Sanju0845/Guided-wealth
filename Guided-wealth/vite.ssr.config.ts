// Config for the build-time prerender SSR bundle ONLY (vite build --ssr).
// Mirrors vite.config.ts but disables public-dir copying — the prerender
// script reads dist/index.html as its template, so the Node bundle does not
// need favicon/assets/, and copying it caused Windows file-lock failures.
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    copyPublicDir: false,
    ssr: 'src/seo/prerender-entry.tsx',
    outDir: 'dist-ssr',
    emptyOutDir: true,
    minify: false,
  },
});
