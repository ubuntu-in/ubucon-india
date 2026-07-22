// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  // Served as a GitHub Pages project page under the org's custom domain.
  // ubucon.org lives in a separate repo; this repo is /india.
  site: 'https://ubucon.org',
  base: '/india',
  integrations: [svelte()],
  vite: {
    css: {
      preprocessorOptions: {
        // Resolve bare `@import "vanilla-framework"`. Vanilla 4 is @import-based;
        // silence the Dart Sass @import deprecation noise until Vanilla ships @use.
        scss: {
          loadPaths: ['node_modules'],
          // Vanilla 4 still uses @import + global sass functions; noise, not our bug.
          silenceDeprecations: ['import', 'global-builtin'],
        },
      },
    },
  },
});
