import { getConfiguredPublicSiteUrl } from './site'

export async function resolvePublicSiteOrigin(): Promise<string> {
  if (!import.meta.env.SSR) {
    return typeof window !== 'undefined'
      ? window.location.origin
      : getConfiguredPublicSiteUrl()
  }
  try {
    const { getRequestUrl } = await import('@tanstack/react-start/server')
    return getRequestUrl({ xForwardedHost: true, xForwardedProto: true }).origin
  } catch {
    return getConfiguredPublicSiteUrl()
  }
}
