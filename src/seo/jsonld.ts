import {
  HOME_META_DESCRIPTION,
  PRIVACY_META_DESCRIPTION,
  SITE_NAME,
} from './constants'
import type { RecordObject } from './meta'
import { absoluteUrl, getOgImageUrl } from './site'

export function homeSoftwareApplicationJsonLd(siteOrigin: string): RecordObject {
  const url = absoluteUrl('/', siteOrigin)
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    description: HOME_META_DESCRIPTION,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web',
    image: getOgImageUrl(siteOrigin),
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    url,
  }
}

export function privacyWebPageJsonLd(siteOrigin: string): RecordObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Privacy Policy | ${SITE_NAME}`,
    description: PRIVACY_META_DESCRIPTION,
    image: getOgImageUrl(siteOrigin),
    url: absoluteUrl('/privacy-policy', siteOrigin),
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: absoluteUrl('/', siteOrigin),
    },
  }
}
