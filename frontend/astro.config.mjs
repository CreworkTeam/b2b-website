import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import sectionize from '@hbsnow/rehype-sectionize';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { remarkReadingTime } from './remark-reading-time.mjs';
import { ensureLocalAssets } from './src/utils/init-local-assets.mjs';

function localAssetsPlugin() {
  return {
    name: 'local-assets-plugin',
    async buildStart() {
      await ensureLocalAssets();
    },
  };
}

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  output: 'server',
  site: 'https://www.creworklabs.com',
  integrations: [react(), sitemap()],
  adapter: vercel({
    runtime: 'nodejs20.x',
  }),
  vite: {
    
    plugins: [tailwindcss(), localAssetsPlugin()],
    server: {
      allowedHosts: [
        'monkhood-petticoat-ramble.ngrok-free.dev',
        'moonrise-constant-washtub.ngrok-free.dev',
      ],
    },
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    build: {
      rollupOptions: {
        external: [],
      },
    },
  },
  markdown: {
    rehypePlugins: [sectionize],
    remarkPlugins: [remarkReadingTime],
  },
});
