import { useEffect } from 'react'

/**
 * TanStack Start does not use a static index.html, so `injectRegister` cannot
 * inject the SW script. Register on the client after mount instead.
 */
export function PwaRegister() {
  useEffect(() => {
    void import('virtual:pwa-register').then(({ registerSW }) => {
      registerSW({ immediate: true })
    })
  }, [])
  return null
}
