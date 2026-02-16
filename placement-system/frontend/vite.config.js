import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port:3000,
    proxy: {
      '/api': {
        target: 'https://smart-placement-system-3.onrender.com',
        changeOrigin: true,
      },
      '/media': {
        target: 'https://smart-placement-system-3.onrender.com',
        changeOrigin: true,
      },
    },
  },
});