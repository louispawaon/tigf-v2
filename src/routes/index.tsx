import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import type { ReactElement } from 'react'
import { useSwipeable } from 'react-swipeable'
import { BottomNavbar } from '../components/BottomNavbar'
import { GratitudeTextarea } from '../components/GratitudeTextarea'
import { HistorySidebar } from '../components/HistorySidebar'
import { MobileHistoryDrawer } from '../components/MobileHistoryDrawer'
import { MobileBottomNavbar } from '../components/MobileBottomNavbar'
import type { Entry } from '../db'
import { useAutosaveTodayEntry } from '../hooks/useAutosaveTodayEntry'
import type { FontPreset } from './__root'
import { useFontPreset } from './__root'
import { buildHomeHead } from '../seo/buildHead'

export const Route = createFileRoute('/')({
  head: () => buildHomeHead(),
  component: App,
})

function getNextFontPreset(currentPreset: FontPreset): FontPreset {
  if (currentPreset === 'calm') {
    return 'focus'
  }
  if (currentPreset === 'focus') {
    return 'night'
  }
  return 'calm'
}

function getPreviousFontPreset(currentPreset: FontPreset): FontPreset {
  if (currentPreset === 'calm') {
    return 'night'
  }
  if (currentPreset === 'focus') {
    return 'calm'
  }
  return 'focus'
}

function isMobileViewport(): boolean {
  return window.matchMedia('(max-width: 767px)').matches
}

function App(): ReactElement {
  const { fontPreset, setFontPreset } = useFontPreset()
  const {
    value,
    setValue,
    savedAt,
    pulseKey,
    previousEntries,
    startNewEntry,
    handleEditorFocus,
  } = useAutosaveTodayEntry()
  const [selectedHistoryEntry, setSelectedHistoryEntry] = useState<Entry | null>(null)
  const [newEntryNonce, setNewEntryNonce] = useState<number>(0)
  const [isDesktopHistoryOpen, setIsDesktopHistoryOpen] = useState<boolean>(false)
  const [isMobileHistoryOpen, setIsMobileHistoryOpen] = useState<boolean>(false)

  function handleCyclePreset(): void {
    setFontPreset(getNextFontPreset(fontPreset))
  }

  function handleDesktopHistoryToggle(): void {
    setIsDesktopHistoryOpen((current) => !current)
  }

  function handleDesktopNavbarHistoryClick(): void {
    if (window.matchMedia('(min-width: 1024px)').matches) {
      handleDesktopHistoryToggle()
      return
    }
    setIsMobileHistoryOpen(true)
  }

  function handleMobileHistoryOpen(): void {
    setIsMobileHistoryOpen(true)
  }

  function handleHistoryEntrySelect(entry: Entry): void {
    setSelectedHistoryEntry(entry)
  }

  function handleExitHistoryEntry(): void {
    setSelectedHistoryEntry(null)
  }

  function handleValueChange(nextValue: string): void {
    setSelectedHistoryEntry(null)
    setValue(nextValue)
  }

  function handleStartNewEntry(): void {
    setSelectedHistoryEntry(null)
    setNewEntryNonce((current) => current + 1)
    startNewEntry()
  }

  function handleTextareaFocus(): void {
    setSelectedHistoryEntry(null)
    handleEditorFocus()
  }

  const swipeHandlers = useSwipeable({
    onSwipedLeft: (): void => {
      if (!isMobileViewport()) {
        return
      }
      setFontPreset(getNextFontPreset(fontPreset))
    },
    onSwipedRight: (): void => {
      if (!isMobileViewport()) {
        return
      }
      setFontPreset(getPreviousFontPreset(fontPreset))
    },
    delta: 24,
    trackTouch: true,
    trackMouse: false,
  })

  return (
    <>
      <h1 className="sr-only">Today I&apos;m grateful for</h1>
      <main
        {...swipeHandlers}
        className={`min-h-screen px-5 pb-20 pt-[100px] sm:px-10 md:px-16 md:pb-24 lg:px-[295px] ${isDesktopHistoryOpen ? 'lg:pr-[330px]' : ''}`}
      >
        <GratitudeTextarea
          value={value}
          setValue={handleValueChange}
          savedAt={savedAt}
          pulseKey={pulseKey}
          previousEntries={previousEntries}
          selectedHistoryEntry={selectedHistoryEntry}
          newEntryNonce={newEntryNonce}
          onEditorFocus={handleTextareaFocus}
          onExitHistoryEntry={handleExitHistoryEntry}
        />
      </main>
      <HistorySidebar
        isOpen={isDesktopHistoryOpen}
        onClose={() => setIsDesktopHistoryOpen(false)}
        onEntrySelect={handleHistoryEntrySelect}
      />
      <MobileHistoryDrawer
        isOpen={isMobileHistoryOpen}
        onOpenChange={setIsMobileHistoryOpen}
        onEntrySelect={handleHistoryEntrySelect}
      />
      <MobileBottomNavbar
        activePreset={fontPreset}
        onCyclePreset={handleCyclePreset}
        onNewClick={handleStartNewEntry}
        onHistoryClick={handleMobileHistoryOpen}
      />
      <BottomNavbar
        activePreset={fontPreset}
        onPresetChange={setFontPreset}
        onNewClick={handleStartNewEntry}
        onHistoryClick={handleDesktopNavbarHistoryClick}
        isHistoryActive={isDesktopHistoryOpen}
      />
    </>
  )
}
