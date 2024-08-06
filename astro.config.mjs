import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  experimental: {
    actions: true,
  },
  integrations: [tailwind(), react()],
  adapter: vercel(),
  vite: {
    build: {
      rollupOptions: {
        external: [],
      },
    },
  },
});
