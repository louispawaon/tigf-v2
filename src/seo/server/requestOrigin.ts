import { getRequestUrl } from '@tanstack/react-start/server'

import { getConfiguredPublicSiteUrl } from '../site'

/** Server route handlers only — resolves the caller’s deployed origin (Workers, proxies). */
export function getPublicSiteOriginFromRequest(): string {
  try {
    return getRequestUrl({ xForwardedHost: true, xForwardedProto: true }).origin
  } catch {
    return getConfiguredPublicSiteUrl()
  }
}
