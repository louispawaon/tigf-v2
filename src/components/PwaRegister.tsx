import { useEffect } from 'react'
import type { BeforeInstallPromptEvent } from '../types'
import { useAppStore } from '../store'

function isBeforeInstallPromptEvent(e: Event): e is BeforeInstallPromptEvent {
  return 'prompt' in e && typeof (e as Record<string, unknown>).prompt === 'function'
}

/**
 * TanStack Start does not use a static index.html, so `injectRegister` cannot
 * inject the SW script. Register on the client after mount instead.
 *
 * Also captures the `beforeinstallprompt` event for use in the install button.
 */
export function PwaRegister(): null {
  const setPwaPromptEvent = useAppStore((s) => s.setPwaPromptEvent)

  useEffect(() => {
    void import('virtual:pwa-register').then(({ registerSW }) => {
      registerSW({ immediate: true })
    })
  }, [])

  useEffect(() => {
    const handler = (e: Event): void => {
      e.preventDefault()
      if (isBeforeInstallPromptEvent(e)) {
        setPwaPromptEvent(e)
      }
    }
    window.addEventListener('beforeinstallprompt', handler)
    return (): void => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [setPwaPromptEvent])

  return null
}
