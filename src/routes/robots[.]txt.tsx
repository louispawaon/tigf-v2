import { createFileRoute } from '@tanstack/react-router'

import { getPublicSiteUrl } from '../seo/site'

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: (): Response => {
        const base = getPublicSiteUrl()
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
