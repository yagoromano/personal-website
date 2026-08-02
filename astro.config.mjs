// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // Deploy target, used to build absolute canonical and Open Graph URLs.
  // Must match the hosting_url output in terraform/main.tf.
  site: 'https://yagoromano.web.app',
  integrations: [react()]
});