import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useRef } from 'react'
import type { ReactElement } from 'react'
import { getHistoryEntries } from '../db'

interface HistorySidebarProps {
  isOpen: boolean
  onClose: () => void
}

const fullDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

function toDayBoundary(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate())
}

function getDateLabel(value: Date): string {
  const today = toDayBoundary(new Date())
  const candidate = toDayBoundary(value)
  const deltaInMs = today.getTime() - candidate.getTime()
  const oneDayMs = 24 * 60 * 60 * 1000

  if (deltaInMs === 0) {
    return 'Today'
  }
  if (deltaInMs === oneDayMs) {
    return 'Yesterday'
  }
  return fullDateFormatter.format(value)
}

function getPreviewText(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) {
    return 'No entry body yet...'
  }
  return trimmed.replace(/\s+/g, ' ')
}

export function HistorySidebar({ isOpen, onClose }: HistorySidebarProps): ReactElement | null {
  const panelRef = useRef<HTMLElement | null>(null)
  const entries = useLiveQuery(() => getHistoryEntries(), [])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const onPointerDown = (event: MouseEvent): void => {
      const panel = panelRef.current
      if (!panel) {
        return
      }
      const target = event.target
      if (!(target instanceof Node)) {
        return
      }
      if (!panel.contains(target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    return (): void => {
      document.removeEventListener('mousedown', onPointerDown)
    }
  }, [isOpen, onClose])

  return (
    <aside
      ref={panelRef}
      className={`history-sidebar hidden lg:block ${isOpen ? 'is-open' : 'is-closed'}`}
      aria-label="History sidebar"
      aria-hidden={!isOpen}
    >
      <div className="history-sidebar-scroll">
        {(entries ?? []).map((entry) => (
          <article key={entry.id} className="history-entry">
            <h3 className="history-entry-date">{getDateLabel(entry.createdAt)}</h3>
            <p className="history-entry-preview">{getPreviewText(entry.body)}</p>
          </article>
        ))}
        <p className="history-end-marker">Entries End Here</p>
      </div>
    </aside>
  )
}
