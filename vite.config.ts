import { defineConfig } from 'vite';

export default defineConfig({
  // Use relative asset paths so the build works from subfolders on static hosts.
  base: './',
  css: {
    devSourcemap: true,
  },
  build: {
    sourcemap: true,
  },
});
