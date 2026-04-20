import path from 'node:path'

import { generateSW } from 'workbox-build'
import type { Plugin } from 'vite'
import { perEnvironmentPlugin } from 'vite'

import { getGenerateSwOptions } from './pwa-workbox.shared.ts'

/**
 * Runs `workbox-build.generateSW` after the **client** environment bundle is written.
 * vite-plugin-pwa skips this in TanStack Start because `closeBundle` is gated on `!build.ssr` (see vite-pwa #902).
 */
export function pwaClientGenerateSwPlugin(): Plugin {
  return perEnvironmentPlugin('tigf:pwa-client-generate-sw', (environment) => {
    if (environment.name !== 'client') {
      return false
    }

    return {
      name: 'tigf:pwa-client-generate-sw-impl',
      enforce: 'post',
      async closeBundle(): Promise<void> {
        const root = environment.getTopLevelConfig().root
        const outDir = environment.config.build.outDir
        const globDirectory = path.resolve(root, outDir)
        const swDest = path.join(globDirectory, 'sw.js')

        const result = await generateSW(
          getGenerateSwOptions({
            globDirectory,
            swDest,
          }),
        )

        environment.logger.info(
          `PWA: wrote ${path.relative(root, swDest)} (precached ${String(result.count)} entries, ${String(result.size)} bytes)`,
        )
      },
    }
  })
}
