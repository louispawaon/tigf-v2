import { createFileRoute } from '@tanstack/react-router'

import { getPublicSiteOriginFromRequest } from '../seo/server/requestOrigin'

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: (): Response => {
        const base = getPublicSiteOriginFromRequest()
        const body = `User-agent: *
Disallow:

Sitemap: ${base}/sitemap.xml
`
        return new Response(body, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
          },
        })
      },
    },
  },
})
