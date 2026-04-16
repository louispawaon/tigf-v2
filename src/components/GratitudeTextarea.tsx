import { useEffect, useRef } from 'react'
import type { ChangeEvent, KeyboardEvent, ReactElement } from 'react'
import { useAutosaveTodayEntry } from '../hooks/useAutosaveTodayEntry'

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
const starterPromptText = "Today I'm grateful for"

function autoGrow(textarea: HTMLTextAreaElement): void {
  textarea.style.height = 'auto'
  textarea.style.height = `${textarea.scrollHeight}px`
}

export function GratitudeTextarea(): ReactElement {
  const { value, setValue, savedAt, pulseKey } = useAutosaveTodayEntry()
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) {
      return
    }
    autoGrow(textarea)
  }, [value])

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

  function formatSavedTimestamp(valueToFormat: Date): string {
    const formattedDate = savedDateFormatter.format(valueToFormat)
    const formattedTime = savedTimeFormatter.format(valueToFormat)
    return `${formattedDate} • ${formattedTime}`
  }

  return (
    <section className="gratitude-container">
      <div className="gratitude-textarea-shell">
        {value.trim().length === 0 ? (
          <p className="gratitude-placeholder-hint" aria-hidden="true">
            <span className="gratitude-placeholder-text">{starterPromptText}</span>
            <span className="gratitude-hint-key">Tab</span>
          </p>
        ) : null}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Today I'm grateful for..."
          aria-label="Today I'm grateful for"
          className="gratitude-textarea"
          rows={1}
        />
      </div>
      {savedAt ? (
        <div className="saved-timestamp-row">
          <time key={pulseKey} className="saved-timestamp" dateTime={savedAt.toISOString()}>
            {formatSavedTimestamp(savedAt)}
          </time>
        </div>
      ) : null}
    </section>
  )
}
