import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    headers: {
      'Content-Type': 'application/javascript',
    }
  },
  build: {
    outDir: 'dist',
  }
});
