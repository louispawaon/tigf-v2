/**
 * Canonical site origin for absolute URLs (canonical links, Open Graph, JSON-LD, sitemap).
 * Set `VITE_PUBLIC_SITE_URL` in production (e.g. `https://www.example.com`, no trailing slash).
 */
export function getPublicSiteUrl(): string {
  const raw = import.meta.env.VITE_PUBLIC_SITE_URL
  if (typeof raw === 'string' && raw.trim() !== '') {
    return raw.replace(/\/$/, '')
  }
  if (import.meta.env.DEV) {
    return 'http://localhost:3000'
  }
  throw new Error(
    'VITE_PUBLIC_SITE_URL must be set for production builds (canonical URLs, sitemap, and robots).',
  )
}

export function absoluteUrl(pathname: string): string {
  const base = getPublicSiteUrl()
  if (!pathname.startsWith('/')) {
    return `${base}/${pathname}`
  }
  return `${base}${pathname}`
}

/** Absolute URL for [`public/og.png`](/public/og.png) (Open Graph / Twitter Cards). */
export function getOgImageUrl(): string {
  return absoluteUrl('/og.png')
}
