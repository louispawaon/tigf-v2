import type { CSSProperties, ReactElement } from 'react'
import type { FontPreset } from '../routes/__root'

interface BottomNavbarProps {
  activePreset: FontPreset
  onPresetChange: (fontPreset: FontPreset) => void
  onHistoryClick: () => void
  isHistoryActive: boolean
}

interface PresetOption {
  id: FontPreset
  label: string
  activeFontFamily: string
}

const PRESET_OPTIONS: PresetOption[] = [
  { id: 'calm', label: 'Calm', activeFontFamily: '"Lora", ui-serif, Georgia, serif' },
  {
    id: 'focus',
    label: 'Focus',
    activeFontFamily: '"Merriweather", ui-serif, Georgia, serif',
  },
  {
    id: 'night',
    label: 'Night',
    activeFontFamily: '"Playfair Display", ui-serif, Georgia, serif',
  },
]

function getOptionStyle(option: PresetOption, activePreset: FontPreset): CSSProperties {
  const isActive = option.id === activePreset
  return {
    fontFamily: isActive ? option.activeFontFamily : 'var(--font-body)',
    fontWeight: isActive ? 700 : 500,
    fontStyle: isActive ? 'italic' : 'normal',
  }
}

export function BottomNavbar({
  activePreset,
  onPresetChange,
  onHistoryClick,
  isHistoryActive,
}: BottomNavbarProps): ReactElement {
  return (
    <footer className="fixed inset-x-0 bottom-0 hidden bg-[oklch(var(--background))] px-[135px] py-4 md:block">
      <nav className="flex items-center justify-between text-[12px] leading-none tracking-[0.01em] text-[oklch(var(--foreground))]">
        <div className="flex items-center gap-2">
          {PRESET_OPTIONS.map((option, index) => (
            <div key={option.id} className="flex items-center gap-2">
              <button
                type="button"
                aria-pressed={option.id === activePreset}
                onClick={() => onPresetChange(option.id)}
                className="cursor-pointer transition-all duration-200 hover:opacity-80"
                style={getOptionStyle(option, activePreset)}
              >
                {option.label}
              </button>
              {index < PRESET_OPTIONS.length - 1 ? <span aria-hidden="true">•</span> : null}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onHistoryClick}
            className="cursor-pointer hover:opacity-80"
            style={{ fontWeight: isHistoryActive ? 700 : 500 }}
          >
            History
          </button>
          <span aria-hidden="true">•</span>
          <span className="font-medium">Privacy Policy</span>
        </div>
      </nav>
    </footer>
  )
}
