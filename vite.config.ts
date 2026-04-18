import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { cloudflare } from '@cloudflare/vite-plugin'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

import { getVitePwaWorkboxOptions } from './pwa-workbox.shared.ts'
import { pwaClientGenerateSwPlugin } from './vite-plugin-pwa-client-sw.ts'
import { SITE_NAME, SITE_TAGLINE } from './src/seo/constants.ts'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: ['favicon.ico', 'logo192.png', 'logo512.png', 'og.png'],
      manifest: {
        id: '/',
        name: SITE_NAME,
        short_name: 'TIGF',
        description: SITE_TAGLINE,
        theme_color: '#f8f9fa',
        background_color: '#f8f9fa',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'logo192.png', sizes: '192x192', type: 'image/png' },
          {
            src: 'logo512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'logo512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: getVitePwaWorkboxOptions(),
      devOptions: {
        enabled: true,
        // Dev SW runs from `dev-dist/` with almost no precacheable files; suppressWarnings
        // switches globPatterns to `[*.js]` and adds a tiny stub so Workbox does not warn.
        suppressWarnings: true,
      },
    }),
    pwaClientGenerateSwPlugin(),
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
  ],
})

export default config
