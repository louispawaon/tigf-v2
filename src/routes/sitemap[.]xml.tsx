import { createFileRoute } from '@tanstack/react-router'

import { getPublicSiteUrl } from '../seo/site'

function escapeXml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: (): Response => {
        const base = getPublicSiteUrl()
        const home = escapeXml(`${base}/`)
        const privacy = escapeXml(`${base}/privacy-policy`)
        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${home}</loc></url>
  <url><loc>${privacy}</loc></url>
</urlset>`
        return new Response(body, {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
          },
        })
      },
    },
  },
})
