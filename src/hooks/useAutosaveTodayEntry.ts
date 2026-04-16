import { useEffect, useRef, useState } from 'react'
import type { Entry } from '../db'
import { countWords, getEntriesForDay, getMetaValue, saveEntrySegment, setMetaValue } from '../db'

const AUTOSAVE_DELAY_MS = 1100
const SESSION_IDLE_THRESHOLD_MS = 60 * 60 * 1000
const LAST_ACTIVITY_META_KEY = 'entry:last-activity-at'

interface UseAutosaveTodayEntryResult {
  value: string
  setValue: (nextValue: string) => void
  savedAt: Date | null
  pulseKey: number
  previousEntries: Entry[]
  startNewEntry: () => void
  handleEditorFocus: () => void
}

export function useAutosaveTodayEntry(): UseAutosaveTodayEntryResult {
  const [value, setValueState] = useState<string>('')
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const [pulseKey, setPulseKey] = useState<number>(0)
  const [previousEntries, setPreviousEntries] = useState<Entry[]>([])
  const [isHydrated, setIsHydrated] = useState<boolean>(false)
  const skipNextAutosaveRef = useRef<boolean>(false)
  const currentEntryIdRef = useRef<string | null>(null)
  const lastActivityAtRef = useRef<number | null>(null)
  const valueRef = useRef<string>('')
  const savedAtRef = useRef<Date | null>(null)

  useEffect(() => {
    valueRef.current = value
    savedAtRef.current = savedAt
  }, [value, savedAt])

  function hasExceededIdleThreshold(nowMs: number): boolean {
    const lastActivityAt = lastActivityAtRef.current
    if (lastActivityAt === null) {
      return false
    }
    return nowMs - lastActivityAt >= SESSION_IDLE_THRESHOLD_MS
  }

  function splitCurrentEntry(nowMs: number, force: boolean): void {
    if (!force && !hasExceededIdleThreshold(nowMs)) {
      return
    }

    const currentEntryId = currentEntryIdRef.current
    if (currentEntryId !== null) {
      const currentValue = valueRef.current
      const currentSavedAt = savedAtRef.current
      setPreviousEntries((current) => {
        if (current.some((entry) => entry.id === currentEntryId)) {
          return current
        }
        return [
          ...current,
          {
            id: currentEntryId,
            body: currentValue,
            createdAt: currentSavedAt ?? new Date(nowMs),
            updatedAt: currentSavedAt ?? new Date(nowMs),
            wordCount: countWords(currentValue),
          },
        ]
      })
    }

    currentEntryIdRef.current = null
    skipNextAutosaveRef.current = true
    setValueState('')
    setSavedAt(null)
  }

  async function recordActivityAt(nowMs: number): Promise<void> {
    lastActivityAtRef.current = nowMs
    await setMetaValue(LAST_ACTIVITY_META_KEY, nowMs)
  }

  useEffect(() => {
    let isCancelled = false

    async function loadTodayEntry(): Promise<void> {
      const [entriesForDay, persistedLastActivity] = await Promise.all([
        getEntriesForDay(new Date()),
        getMetaValue(LAST_ACTIVITY_META_KEY),
      ])
      if (isCancelled) {
        return
      }

      const parsedLastActivity =
        typeof persistedLastActivity === 'number' ? persistedLastActivity : null
      lastActivityAtRef.current = parsedLastActivity

      const latestEntry = entriesForDay.at(-1)
      const nowMs = Date.now()
      const shouldStartFreshCanvas =
        latestEntry !== undefined &&
        latestEntry.body.trim().length > 0 &&
        parsedLastActivity !== null &&
        nowMs - parsedLastActivity >= SESSION_IDLE_THRESHOLD_MS

      if (entriesForDay.length > 0) {
        setPreviousEntries(shouldStartFreshCanvas ? entriesForDay : entriesForDay.slice(0, -1))
      }

      if (latestEntry !== undefined && !shouldStartFreshCanvas) {
        skipNextAutosaveRef.current = true
        currentEntryIdRef.current = latestEntry.id
        setValueState(latestEntry.body)
        setSavedAt(latestEntry.updatedAt)
      }

      setIsHydrated(true)
    }

    void loadTodayEntry()

    return (): void => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    if (!isHydrated) {
      return
    }

    if (skipNextAutosaveRef.current) {
      skipNextAutosaveRef.current = false
      return
    }

    const timerId = window.setTimeout(() => {
      void (async () => {
        const entry = await saveEntrySegment(value, currentEntryIdRef.current)
        if (!entry) {
          return
        }
        currentEntryIdRef.current = entry.id
        setSavedAt(entry.updatedAt)
        setPulseKey((current) => current + 1)
      })()
    }, AUTOSAVE_DELAY_MS)

    return (): void => {
      window.clearTimeout(timerId)
    }
  }, [isHydrated, value])

  function setValue(nextValue: string): void {
    const nowMs = Date.now()
    splitCurrentEntry(nowMs, false)
    setValueState(nextValue)
    void recordActivityAt(nowMs)
  }

  function startNewEntry(): void {
    const nowMs = Date.now()
    splitCurrentEntry(nowMs, true)
    currentEntryIdRef.current = null
    skipNextAutosaveRef.current = true
    setValueState('')
    setSavedAt(null)
    void recordActivityAt(nowMs)
  }

  function handleEditorFocus(): void {
    const nowMs = Date.now()
    splitCurrentEntry(nowMs, false)
    void recordActivityAt(nowMs)
  }

  return {
    value,
    setValue,
    savedAt,
    pulseKey,
    previousEntries,
    startNewEntry,
    handleEditorFocus,
  }
}
