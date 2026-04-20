export const SITE_NAME = "Today I'm Grateful For" as const

export const SITE_SHORT_NAME = 'TIGF' as const

/** Shared with PWA manifest — keep in sync with meta descriptions where relevant. */
export const SITE_TAGLINE = 'What are you grateful for today?' as const

export const HOME_META_DESCRIPTION =
  'A free, local-first gratitude journal that works offline. Write privately in your browser — entries stay on your device.' as const

export const PRIVACY_META_DESCRIPTION =
  "Privacy policy for Today I'm Grateful For (TIGF): local-only storage, no accounts, no analytics, and no server collection of journal content." as const

/** Pixel dimensions of [`public/og.png`](/public/og.png); keep in sync if the asset changes. */
export const OG_IMAGE_WIDTH = 1200 as const
export const OG_IMAGE_HEIGHT = 630 as const

/** Alt text for shared Open Graph / Twitter preview image. */
export const OG_IMAGE_ALT = `${SITE_NAME} — ${SITE_TAGLINE}` as const
