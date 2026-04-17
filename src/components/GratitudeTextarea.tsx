import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, KeyboardEvent, ReactElement, WheelEvent } from 'react'
import type { Entry } from '../db'

const savedDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const savedTimeFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})
const starterPromptText = "Today, I'm grateful for"
const touchHistoryBreakpoint = '(max-width: 1023px)'

interface GratitudeTextareaProps {
  value: string
  savedAt: Date | null
  pulseKey: number
  previousEntries: Entry[]
  selectedHistoryEntry: Entry | null
  newEntryNonce: number
  setValue: (nextValue: string) => void
  onEditorFocus: () => void
  onExitHistoryEntry: () => void
}

function autoGrow(textarea: HTMLTextAreaElement): void {
  textarea.style.height = 'auto'
  textarea.style.height = `${textarea.scrollHeight}px`
}

export function GratitudeTextarea({
  value,
  setValue,
  savedAt,
  pulseKey,
  previousEntries,
  selectedHistoryEntry,
  newEntryNonce,
  onEditorFocus,
  onExitHistoryEntry,
}: GratitudeTextareaProps): ReactElement {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [viewedEntryIndex, setViewedEntryIndex] = useState<number | null>(null)
  const [isTouchLayout, setIsTouchLayout] = useState<boolean>(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(touchHistoryBreakpoint)
    const updateLayout = (): void => {
      setIsTouchLayout(mediaQuery.matches)
    }
    updateLayout()
    mediaQuery.addEventListener('change', updateLayout)
    return (): void => {
      mediaQuery.removeEventListener('change', updateLayout)
    }
  }, [])

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) {
      return
    }
    autoGrow(textarea)
  }, [value])

  useEffect(() => {
    if (savedAt === null) {
      setViewedEntryIndex(null)
    }
  }, [savedAt])

  useEffect(() => {
    if (previousEntries.length === 0) {
      setViewedEntryIndex(null)
      return
    }
    if (viewedEntryIndex === null) {
      return
    }
    if (viewedEntryIndex >= previousEntries.length) {
      setViewedEntryIndex(previousEntries.length - 1)
    }
  }, [previousEntries, viewedEntryIndex])

  useEffect(() => {
    setViewedEntryIndex(null)
  }, [newEntryNonce])

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>): void {
    setValue(event.target.value)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>): void {
    if (event.key !== 'Tab' || event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) {
      return
    }
    if (value.trim().length > 0) {
      return
    }
    event.preventDefault()
    setValue(starterPromptText)
    requestAnimationFrame((): void => {
      const textarea = textareaRef.current
      if (!textarea) {
        return
      }
      const cursorPosition = starterPromptText.length
      textarea.setSelectionRange(cursorPosition, cursorPosition)
    })
  }

  function handleCanvasWheel(event: WheelEvent<HTMLElement>): void {
    if (selectedHistoryEntry !== null) {
      if (event.deltaY > 4) {
        event.preventDefault()
        onExitHistoryEntry()
      }
      return
    }

    if (previousEntries.length === 0) {
      return
    }

    if (event.deltaY < -4) {
      event.preventDefault()
      if (viewedEntryIndex === null) {
        setViewedEntryIndex(previousEntries.length - 1)
        return
      }
      setViewedEntryIndex(Math.max(0, viewedEntryIndex - 1))
      return
    }

    if (event.deltaY > 4 && viewedEntryIndex !== null) {
      event.preventDefault()
      const nextIndex = viewedEntryIndex + 1
      if (nextIndex >= previousEntries.length) {
        setViewedEntryIndex(null)
        return
      }
      setViewedEntryIndex(nextIndex)
    }
  }

  function handleEditorFocus(): void {
    onExitHistoryEntry()
    setViewedEntryIndex(null)
    onEditorFocus()
  }

  function handleTextareaRef(node: HTMLTextAreaElement | null): void {
    textareaRef.current = node
    if (!node) {
      return
    }
    autoGrow(node)
  }

  function formatSavedTimestamp(valueToFormat: Date): string {
    const formattedDate = savedDateFormatter.format(valueToFormat)
    const formattedTime = savedTimeFormatter.format(valueToFormat)
    return `${formattedDate} • ${formattedTime}`
  }

  const viewedEntry =
    selectedHistoryEntry ?? (viewedEntryIndex !== null ? previousEntries[viewedEntryIndex] : null)

  return (
    <section className="gratitude-container" onWheel={handleCanvasWheel}>
      {viewedEntry ? (
        <article className="gratitude-previous-entry-canvas" key={viewedEntry.id}>
          <time className="gratitude-previous-timestamp" dateTime={viewedEntry.updatedAt.toISOString()}>
            {formatSavedTimestamp(viewedEntry.updatedAt)}
          </time>
          <p className="gratitude-previous-body">{viewedEntry.body.trim() || 'No entry body yet...'}</p>
          <p className="gratitude-transition-hint">
            {isTouchLayout
              ? 'Swipe up also returns to your active canvas.'
              : 'Scroll down also returns to your active canvas.'}
          </p>
        </article>
      ) : (
        <div className="gratitude-textarea-shell">
          {value.trim().length === 0 ? (
            <p className="gratitude-placeholder-hint" aria-hidden="true">
              <span className="gratitude-placeholder-text">{starterPromptText}</span>
              <span className="gratitude-hint-key">Tab</span>
            </p>
          ) : null}
          <textarea
            ref={handleTextareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleEditorFocus}
            placeholder={starterPromptText}
            aria-label={starterPromptText}
            className="gratitude-textarea"
            rows={1}
          />
        </div>
      )}
      {savedAt && viewedEntry === null ? (
        <div className="saved-timestamp-row">
          <time key={pulseKey} className="saved-timestamp" dateTime={savedAt.toISOString()}>
            {formatSavedTimestamp(savedAt)}
          </time>
        </div>
      ) : null}
    </section>
  )
}
