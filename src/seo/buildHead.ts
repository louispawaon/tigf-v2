import {
  HOME_META_DESCRIPTION,
  OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  PRIVACY_META_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
} from './constants'
import { homeSoftwareApplicationJsonLd, privacyWebPageJsonLd } from './jsonld'
import { absoluteUrl, getOgImageUrl } from './site'

function sharedOgImageMeta(siteOrigin: string) {
  const imageUrl = getOgImageUrl(siteOrigin)
  return [
    { property: 'og:image', content: imageUrl },
    { property: 'og:image:alt', content: OG_IMAGE_ALT },
    { property: 'og:image:width', content: String(OG_IMAGE_WIDTH) },
    { property: 'og:image:height', content: String(OG_IMAGE_HEIGHT) },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: imageUrl },
  ]
}

export function buildHomeHead(siteOrigin: string) {
  const title = `${SITE_NAME} — ${SITE_TAGLINE}`
  const url = absoluteUrl('/', siteOrigin)
  return {
    meta: [
      { title },
      { name: 'description', content: HOME_META_DESCRIPTION },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: HOME_META_DESCRIPTION },
      { property: 'og:url', content: url },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE_NAME },
      ...sharedOgImageMeta(siteOrigin),
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: HOME_META_DESCRIPTION },
      { 'script:ld+json': homeSoftwareApplicationJsonLd(siteOrigin) },
    ],
    links: [{ rel: 'canonical', href: url }],
  }
}

export function buildPrivacyHead(siteOrigin: string) {
  const title = `Privacy Policy | ${SITE_NAME}`
  const url = absoluteUrl('/privacy-policy', siteOrigin)
  return {
    meta: [
      { title },
      { name: 'description', content: PRIVACY_META_DESCRIPTION },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: PRIVACY_META_DESCRIPTION },
      { property: 'og:url', content: url },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE_NAME },
      ...sharedOgImageMeta(siteOrigin),
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: PRIVACY_META_DESCRIPTION },
      { 'script:ld+json': privacyWebPageJsonLd(siteOrigin) },
    ],
    links: [{ rel: 'canonical', href: url }],
  }
}
