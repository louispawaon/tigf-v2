import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useRef } from 'react'
import type { ReactElement } from 'react'
import type { Entry } from '../db'
import { getHistoryEntries } from '../db'

interface HistorySidebarProps {
  isOpen: boolean
  onClose: () => void
  onEntrySelect: (entry: Entry) => void
}

const fullDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})
const timeFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

interface HistoryGroup {
  dayKey: string
  label: string
  entries: Entry[]
}

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

function getDayKey(value: Date): string {
  return `${value.getFullYear()}-${value.getMonth()}-${value.getDate()}`
}

function groupEntriesByDay(entries: Entry[]): HistoryGroup[] {
  const grouped: HistoryGroup[] = []
  const groupMap = new Map<string, HistoryGroup>()

  entries.forEach((entry) => {
    const dayKey = getDayKey(entry.createdAt)
    const existingGroup = groupMap.get(dayKey)
    if (existingGroup) {
      existingGroup.entries.push(entry)
      return
    }

    const nextGroup: HistoryGroup = {
      dayKey,
      label: getDateLabel(entry.createdAt),
      entries: [entry],
    }
    groupMap.set(dayKey, nextGroup)
    grouped.push(nextGroup)
  })

  return grouped
}

export function HistorySidebar({
  isOpen,
  onClose,
  onEntrySelect,
}: HistorySidebarProps): ReactElement | null {
  const panelRef = useRef<HTMLElement | null>(null)
  const entries = useLiveQuery(() => getHistoryEntries(), [])
  const groupedEntries = groupEntriesByDay(entries ?? [])

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
        {groupedEntries.map((group) => (
          <section key={group.dayKey} className="history-day-group">
            <h3 className="history-day-title">{group.label}</h3>
            {group.entries.map((entry) => (
              <article key={entry.id} className="history-entry">
                <button
                  type="button"
                  className="history-entry-button"
                  onClick={() => onEntrySelect(entry)}
                >
                  <div className="history-entry-header">
                    <time className="history-entry-time" dateTime={entry.updatedAt.toISOString()}>
                      {timeFormatter.format(entry.updatedAt)}
                    </time>
                  </div>
                  <p className="history-entry-preview">{getPreviewText(entry.body)}</p>
                </button>
              </article>
            ))}
          </section>
        ))}
        <p className="history-end-marker">Entries End Here</p>
      </div>
    </aside>
  )
}
