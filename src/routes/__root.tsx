import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactElement } from 'react'

import appCss from '../styles.css?url'
import { PwaRegister } from '../components/PwaRegister'
import { SITE_NAME } from '../seo/constants'

export type FontPreset = 'calm' | 'focus' | 'night'

interface FontPresetContextValue {
  fontPreset: FontPreset
  setFontPreset: (fontPreset: FontPreset) => void
}

const FONT_PRESET_STORAGE_KEY = 'font-preset'
const MODE_TRANSITION_CLASS_NAME = 'mode-transition'
const MODE_TRANSITION_DURATION_MS = 240

let modeTransitionTimeoutId: number | null = null

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('${FONT_PRESET_STORAGE_KEY}');var isValid=stored==='calm'||stored==='focus'||stored==='night';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var preset=isValid?stored:(prefersDark?'night':'calm');var root=document.documentElement;var resolvedTheme=preset==='night'?'dark':'light';root.setAttribute('data-font-preset',preset);root.classList.remove('light','dark');root.classList.add(resolvedTheme);root.style.colorScheme=resolvedTheme;}catch(e){}})();`

const FontPresetContext = createContext<FontPresetContextValue | null>(null)

function getInitialFontPreset(): FontPreset {
  if (typeof window === 'undefined') {
    return 'calm'
  }

  const storedPreset = window.localStorage.getItem(FONT_PRESET_STORAGE_KEY)
  if (storedPreset === 'calm' || storedPreset === 'focus' || storedPreset === 'night') {
    return storedPreset
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'calm'
}

function hasStoredFontPreset(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  const storedPreset = window.localStorage.getItem(FONT_PRESET_STORAGE_KEY)
  return storedPreset === 'calm' || storedPreset === 'focus' || storedPreset === 'night'
}

function applyFontPreset(fontPreset: FontPreset): void {
  const root = document.documentElement
  const resolvedTheme = fontPreset === 'night' ? 'dark' : 'light'
  root.classList.add(MODE_TRANSITION_CLASS_NAME)
  if (modeTransitionTimeoutId !== null) {
    window.clearTimeout(modeTransitionTimeoutId)
  }
  modeTransitionTimeoutId = window.setTimeout((): void => {
    root.classList.remove(MODE_TRANSITION_CLASS_NAME)
    modeTransitionTimeoutId = null
  }, MODE_TRANSITION_DURATION_MS)
  root.setAttribute('data-font-preset', fontPreset)
  root.classList.remove('light', 'dark')
  root.classList.add(resolvedTheme)
  root.style.colorScheme = resolvedTheme
}

function FontPresetProvider({ children }: { children: React.ReactNode }): ReactElement {
  const [fontPreset, setFontPresetState] = useState<FontPreset>(getInitialFontPreset)
  const [hasManualSelection, setHasManualSelection] = useState<boolean>(hasStoredFontPreset)

  useEffect(() => {
    applyFontPreset(fontPreset)
    if (hasManualSelection) {
      window.localStorage.setItem(FONT_PRESET_STORAGE_KEY, fontPreset)
    }
  }, [fontPreset, hasManualSelection])

  useEffect(() => {
    if (hasManualSelection) {
      return
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event: MediaQueryListEvent): void => {
      setFontPresetState(event.matches ? 'night' : 'calm')
    }
    media.addEventListener('change', onChange)
    return (): void => {
      media.removeEventListener('change', onChange)
    }
  }, [hasManualSelection])

  const value = useMemo<FontPresetContextValue>(() => {
    return {
      fontPreset,
      setFontPreset: (nextFontPreset: FontPreset): void => {
        setHasManualSelection(true)
        setFontPresetState(nextFontPreset)
      },
    }
  }, [fontPreset])

  return <FontPresetContext.Provider value={value}>{children}</FontPresetContext.Provider>
}

export function useFontPreset(): FontPresetContextValue {
  const context = useContext(FontPresetContext)
  if (!context) {
    throw new Error('useFontPreset must be used within FontPresetProvider')
  }
  return context
}

function NotFound(): ReactElement {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 text-center">
      <h1 className="font-heading max-w-[min(36rem,90vw)] text-balance text-[clamp(1.125rem,2.8vw,1.625rem)] font-normal leading-snug tracking-[0.08em] text-foreground [font-variant:small-caps]">
        you found a blank space in the internet.
      </h1>
    </main>
  )
}

export const Route = createRootRoute({
  notFoundComponent: NotFound,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover',
      },
      {
        title: SITE_NAME,
      },
      {
        name: 'theme-color',
        content: '#f8f9fa',
        media: '(prefers-color-scheme: light)',
      },
      {
        name: 'theme-color',
        content: '#161820',
        media: '(prefers-color-scheme: dark)',
      },
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes',
      },
      {
        name: 'apple-mobile-web-app-title',
        content: 'Grateful',
      },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'default',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'manifest',
        href: '/manifest.webmanifest',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '192x192',
        href: '/logo192.png',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }): ReactElement {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="bg-background font-sans text-foreground antialiased wrap-anywhere selection:bg-[rgba(79,184,178,0.24)]">
        <FontPresetProvider>{children}</FontPresetProvider>
        <PwaRegister />
        <Scripts />
      </body>
    </html>
  )
}
