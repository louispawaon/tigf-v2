import { create } from 'zustand'
import type { BeforeInstallPromptEvent } from '../types'

interface AppStore {
  pwaPromptEvent: BeforeInstallPromptEvent | null
  setPwaPromptEvent: (e: BeforeInstallPromptEvent | null) => void
}

export const useAppStore = create<AppStore>()((set) => ({
  pwaPromptEvent: null,
  setPwaPromptEvent: (e) => set({ pwaPromptEvent: e }),
}))
