import type { CSSProperties, ReactElement } from 'react'
import type { FontPreset } from '../routes/__root'

interface MobileBottomNavbarProps {
  activePreset: FontPreset
  onCyclePreset: () => void
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

export function MobileBottomNavbar({
  activePreset,
  onCyclePreset,
  onHistoryClick,
}: MobileBottomNavbarProps): ReactElement {
  const nextModeLabel = NEXT_LABEL_BY_PRESET[activePreset]
  const activeModeLabel = MODE_LABEL_BY_PRESET[activePreset]

  return (
    <footer className="fixed bottom-4 left-1/2 z-40 w-max -translate-x-1/2 rounded-full bg-[oklch(var(--background))]/95 px-4 py-2 shadow-[0_8px_26px_rgba(0,0,0,0.12)] backdrop-blur-sm md:hidden">
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
          onClick={onHistoryClick}
          className="cursor-pointer font-medium transition-opacity duration-200 hover:opacity-80"
        >
          History
        </button>
      </nav>
    </footer>
  )
}
