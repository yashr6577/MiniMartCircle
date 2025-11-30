import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load all env vars (including VITE_API_URL) for current mode
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = env.VITE_API_URL || '/api';

  // Determine if the backend is a local instance (enables proxy rewrite)
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)/i.test(apiUrl);

  // If local, strip trailing /api for proxy target (calls go to /api/* locally)
  const proxy = isLocal
    ? {
        '/api': {
          target: apiUrl.replace(/\/api$/, ''),
          changeOrigin: true,
          secure: false,
        },
      }
    : undefined;

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy,
    },
  };
});
