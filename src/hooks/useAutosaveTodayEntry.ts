import { useEffect, useRef, useState } from 'react'
import { getTodayEntry, saveTodayEntry } from '../db'

const AUTOSAVE_DELAY_MS = 1100

interface UseAutosaveTodayEntryResult {
  value: string
  setValue: (nextValue: string) => void
  savedAt: Date | null
  pulseKey: number
}

export function useAutosaveTodayEntry(): UseAutosaveTodayEntryResult {
  const [value, setValueState] = useState<string>('')
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const [pulseKey, setPulseKey] = useState<number>(0)
  const [isHydrated, setIsHydrated] = useState<boolean>(false)
  const skipNextAutosaveRef = useRef<boolean>(false)

  useEffect(() => {
    let isCancelled = false

    async function loadTodayEntry(): Promise<void> {
      const entry = await getTodayEntry()
      if (isCancelled) {
        return
      }

      if (entry) {
        skipNextAutosaveRef.current = true
        setValueState(entry.body)
        setSavedAt(entry.updatedAt)
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
        const entry = await saveTodayEntry(value)
        if (!entry) {
          return
        }
        setSavedAt(entry.updatedAt)
        setPulseKey((current) => current + 1)
      })()
    }, AUTOSAVE_DELAY_MS)

    return (): void => {
      window.clearTimeout(timerId)
    }
  }, [isHydrated, value])

  function setValue(nextValue: string): void {
    setValueState(nextValue)
  }

  return {
    value,
    setValue,
    savedAt,
    pulseKey,
  }
}
