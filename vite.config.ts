import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  // @tiendanube/nexo is an old-style (UMD) bundle that expects a Node "global" variable
  define: {
    global: 'globalThis',
  },
});
