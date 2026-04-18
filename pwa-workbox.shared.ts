import type { GenerateSWOptions } from 'workbox-build'

/** Match hashed files under `assets/` so precache skips unnecessary revision busting (same idea as vite-plugin-pwa). */
const DONT_CACHE_BUST_URLS_MATCHING = /^assets\//

function runtimeCaching(): GenerateSWOptions['runtimeCaching'] {
  return [
    {
      /** Same-origin document requests — cache SSR HTML after an online visit for offline reload. */
      urlPattern: ({ request }) => request.mode === 'navigate',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'tigf-pages',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 48,
          maxAgeSeconds: 60 * 60 * 24 * 7,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-css',
        expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-files',
        expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
  ]
}

/**
 * Options merged into {@link GenerateSWOptions} for production `generateSW`, excluding output paths.
 * Mirrors `registerType: 'autoUpdate'` (skipWaiting / clientsClaim).
 */
export function getSharedGenerateSwOptionsWithoutPaths(): Omit<
  GenerateSWOptions,
  'globDirectory' | 'swDest'
> {
  return {
    navigateFallback: null,
    globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
    navigateFallbackDenylist: [/^\/api\//],
    dontCacheBustURLsMatching: DONT_CACHE_BUST_URLS_MATCHING,
    offlineGoogleAnalytics: false,
    cleanupOutdatedCaches: true,
    skipWaiting: true,
    clientsClaim: true,
    runtimeCaching: runtimeCaching(),
  }
}

/** Full options for `workbox-build.generateSW` including client output paths. */
export function getGenerateSwOptions(paths: {
  globDirectory: string
  swDest: string
}): GenerateSWOptions {
  return {
    ...getSharedGenerateSwOptionsWithoutPaths(),
    globDirectory: paths.globDirectory,
    swDest: paths.swDest,
  }
}

/**
 * Same strategy as {@link getSharedGenerateSwOptionsWithoutPaths}, typed for `VitePWA({ workbox })`.
 * Keeps dev / manifest tooling aligned with the production Workbox build.
 */
export function getVitePwaWorkboxOptions(): Omit<
  GenerateSWOptions,
  'globDirectory' | 'swDest'
> {
  return getSharedGenerateSwOptionsWithoutPaths()
}
