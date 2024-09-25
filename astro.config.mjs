import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';
import sectionize from '@hbsnow/rehype-sectionize';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  output: 'server',
  site: 'https://www.creworklabs.com',
  integrations: [tailwind(), react(), sitemap()],
  adapter: vercel(),
  vite: {
    build: {
      rollupOptions: {
        external: [],
      },
    },
  },
  markdown: {
    rehypePlugins: [sectionize],
  },
});
