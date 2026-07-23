// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  site: 'https://in.ubucon.org',
  base: '/',
  integrations: [svelte()],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: ['node_modules'],
          // vanilla still depends on old ways including @import
          silenceDeprecations: ['import', 'global-builtin', 'if-function'],
        },
      },
    },
  },
});
