function normalizePublicSiteOrigin(raw: string): string {
  const trimmed = raw.trim().replace(/\/$/, '')
  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }
  return `https://${trimmed}`
}

/** Env-based origin — fallback when the incoming request is unavailable (see `resolvePublicSiteOrigin`). */
export function getConfiguredPublicSiteUrl(): string {
  const raw = import.meta.env.VITE_PUBLIC_SITE_URL
  if (typeof raw === 'string' && raw.trim() !== '') {
    return normalizePublicSiteOrigin(raw)
  }
  if (import.meta.env.DEV) {
    return 'http://localhost:3000'
  }
  throw new Error(
    'VITE_PUBLIC_SITE_URL must be set for production builds (canonical URLs, sitemap, and robots).',
  )
}

export function absoluteUrl(pathname: string, siteOrigin: string): string {
  const base = siteOrigin.replace(/\/$/, '')
  if (!pathname.startsWith('/')) {
    return `${base}/${pathname}`
  }
  return `${base}${pathname}`
}

/** Absolute URL for [`public/og.png`](/public/og.png) (Open Graph / Twitter Cards). */
export function getOgImageUrl(siteOrigin: string): string {
  return absoluteUrl('/og.png', siteOrigin)
}
