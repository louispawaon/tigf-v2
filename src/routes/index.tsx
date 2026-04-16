import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import type { ReactElement } from 'react'
import { useSwipeable } from 'react-swipeable'
import { BottomNavbar } from '../components/BottomNavbar'
import { GratitudeTextarea } from '../components/GratitudeTextarea'
import { HistorySidebar } from '../components/HistorySidebar'
import { MobileHistoryDrawer } from '../components/MobileHistoryDrawer'
import { MobileBottomNavbar } from '../components/MobileBottomNavbar'
import type { FontPreset } from './__root'
import { useFontPreset } from './__root'

export const Route = createFileRoute('/')({ component: App })

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
      <main
        {...swipeHandlers}
        className={`min-h-screen px-5 pb-20 pt-[100px] sm:px-10 md:px-16 md:pb-24 lg:px-[295px] ${isDesktopHistoryOpen ? 'lg:pr-[330px]' : ''}`}
      >
        <GratitudeTextarea />
      </main>
      <HistorySidebar isOpen={isDesktopHistoryOpen} onClose={() => setIsDesktopHistoryOpen(false)} />
      <MobileHistoryDrawer isOpen={isMobileHistoryOpen} onOpenChange={setIsMobileHistoryOpen} />
      <MobileBottomNavbar
        activePreset={fontPreset}
        onCyclePreset={handleCyclePreset}
        onHistoryClick={handleMobileHistoryOpen}
      />
      <BottomNavbar
        activePreset={fontPreset}
        onPresetChange={setFontPreset}
        onHistoryClick={handleDesktopNavbarHistoryClick}
        isHistoryActive={isDesktopHistoryOpen}
      />
    </>
  )
}
