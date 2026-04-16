import { useState } from 'react'
import type { CSSProperties, ReactElement } from 'react'
import type { FontPreset } from '../routes/__root'
import { useAppStore } from '../store'

interface MobileBottomNavbarProps {
  activePreset: FontPreset
  onCyclePreset: () => void
  onNewClick: () => void
  onHistoryClick: () => void
}

const ACTIVE_FONT_BY_PRESET: Record<FontPreset, string> = {
  calm: '"Lora", ui-serif, Georgia, serif',
  focus: '"Merriweather", ui-serif, Georgia, serif',
  night: '"Playfair Display", ui-serif, Georgia, serif',
}

const MODE_LABEL_BY_PRESET: Record<FontPreset, string> = {
  calm: 'Calm',
  focus: 'Focus',
  night: 'Night',
}

const NEXT_LABEL_BY_PRESET: Record<FontPreset, string> = {
  calm: 'Focus',
  focus: 'Night',
  night: 'Calm',
}

function getModeStyle(activePreset: FontPreset): CSSProperties {
  return {
    fontFamily: ACTIVE_FONT_BY_PRESET[activePreset],
    fontWeight: 700,
    fontStyle: 'italic',
  }
}

function isIosDevice(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

function isInStandaloneMode(): boolean {
  const nav = navigator as Navigator & { standalone?: boolean }
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    nav.standalone === true
  )
}

function IosInstallTip({ onDismiss }: { onDismiss: () => void }): ReactElement {
  return (
    <div
      role="tooltip"
      className="ios-install-tip fixed left-1/2 z-50 w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-2xl bg-[oklch(var(--background))]/95 px-4 py-3 backdrop-blur-sm"
      style={{ bottom: 'calc(3.5rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="flex items-start gap-3">
        <div className="flex flex-col gap-1 text-[12px] leading-snug text-[oklch(var(--foreground))]">
          <p className="font-semibold">Add to Home Screen</p>
          <p className="text-[oklch(var(--muted-foreground))]">
            Tap{' '}
            <span aria-label="Share button" className="inline-block align-middle">
              <ShareIcon />
            </span>{' '}
            then <strong>Add to Home Screen</strong>
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss install tip"
          className="mt-0.5 shrink-0 cursor-pointer text-[oklch(var(--muted-foreground))] transition-opacity hover:opacity-70"
        >
          <CloseIcon />
        </button>
      </div>
      <div className="ios-install-tip-arrow" aria-hidden="true" />
    </div>
  )
}

function ShareIcon(): ReactElement {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  )
}

function CloseIcon(): ReactElement {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

export function MobileBottomNavbar({
  activePreset,
  onCyclePreset,
  onNewClick,
  onHistoryClick,
}: MobileBottomNavbarProps): ReactElement {
  const nextModeLabel = NEXT_LABEL_BY_PRESET[activePreset]
  const activeModeLabel = MODE_LABEL_BY_PRESET[activePreset]

  const pwaPromptEvent = useAppStore((s) => s.pwaPromptEvent)
  const setPwaPromptEvent = useAppStore((s) => s.setPwaPromptEvent)
  const [isIosTipOpen, setIsIosTipOpen] = useState<boolean>(false)

  const showIosInstall = isIosDevice() && !isInStandaloneMode()
  const showInstallButton = pwaPromptEvent !== null || showIosInstall

  async function handleInstallClick(): Promise<void> {
    if (pwaPromptEvent !== null) {
      await pwaPromptEvent.prompt()
      const { outcome } = await pwaPromptEvent.userChoice
      if (outcome === 'accepted') {
        setPwaPromptEvent(null)
      }
      return
    }
    if (showIosInstall) {
      setIsIosTipOpen((prev) => !prev)
    }
  }

  return (
    <>
      {isIosTipOpen && (
        <IosInstallTip onDismiss={() => setIsIosTipOpen(false)} />
      )}
      <footer className="mobile-bottom-navbar fixed left-1/2 z-40 w-max -translate-x-1/2 rounded-full bg-[oklch(var(--background))]/95 px-4 py-2 backdrop-blur-sm md:hidden">
        <nav className="flex items-center gap-2 text-[12px] leading-none tracking-[0.01em] text-[oklch(var(--foreground))]">
          <button
            type="button"
            onClick={onCyclePreset}
            className="cursor-pointer transition-all duration-200 hover:opacity-80"
            style={getModeStyle(activePreset)}
            aria-label={`Current mode is ${activeModeLabel}. Tap to switch to ${nextModeLabel}.`}
          >
            {activeModeLabel}
          </button>
          <span aria-hidden="true">•</span>
          <button
            type="button"
            onClick={onNewClick}
            className="cursor-pointer font-medium transition-opacity duration-200 hover:opacity-80"
          >
            New
          </button>
          <span aria-hidden="true">•</span>
          <button
            type="button"
            onClick={onHistoryClick}
            className="cursor-pointer font-medium transition-opacity duration-200 hover:opacity-80"
          >
            History
          </button>
          {showInstallButton && (
            <>
              <span aria-hidden="true">•</span>
              <button
                type="button"
                onClick={() => void handleInstallClick()}
                className="cursor-pointer font-medium transition-opacity duration-200 hover:opacity-80"
                aria-label="Install app"
              >
                Install
              </button>
            </>
          )}
        </nav>
      </footer>
    </>
  )
}
