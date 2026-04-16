import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useRef } from 'react'
import type { ReactElement } from 'react'
import { getHistoryEntries } from '../db'
import { Drawer, DrawerContent } from './ui/drawer'

interface MobileHistoryDrawerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
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

export function MobileHistoryDrawer({
  isOpen,
  onOpenChange,
}: MobileHistoryDrawerProps): ReactElement {
  const entries = useLiveQuery(() => getHistoryEntries(), [])
  const focusTargetRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }
    focusTargetRef.current?.focus()
  }, [isOpen])

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange} direction="bottom">
      <DrawerContent className="mobile-history-drawer lg:hidden">
        <div
          ref={focusTargetRef}
          tabIndex={-1}
          className="mobile-history-drawer-body"
          aria-label="History drawer"
        >
          {(entries ?? []).map((entry) => (
            <article key={entry.id} className="history-entry">
              <h3 className="history-entry-date">{getDateLabel(entry.createdAt)}</h3>
              <p className="history-entry-preview">{getPreviewText(entry.body)}</p>
            </article>
          ))}
          <p className="history-end-marker">Entries End Here</p>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
