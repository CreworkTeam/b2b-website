import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';
import path from 'path';
import sectionize from '@hbsnow/rehype-sectionize';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [tailwind(), react()],
  adapter: vercel(),
  vite: {
    build: {
      rollupOptions: {
        external: ['react-remove-scroll'],
      },
    },
  },
  markdown: {
    rehypePlugins: [sectionize],
  },
});
