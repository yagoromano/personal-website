// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import { closeOnTabClose } from './close-on-tab-close.js';

// Force Chrome specifically rather than whatever the OS default browser is.
// Only takes effect if not already set in the real environment.
process.env.BROWSER ??= 'chrome';

// https://astro.build/config
export default defineConfig({
  // Deploy target, used to build absolute canonical and Open Graph URLs.
  // Must match the hosting_url output in terraform/main.tf.
  site: 'https://yagoromano.web.app',
  integrations: [react()],
  // Launch the system default browser to the dev server URL on `npm run dev`.
  server: { open: true },
  vite: { plugins: [closeOnTabClose()] },
});
