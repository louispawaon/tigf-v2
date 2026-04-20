import { Link } from '@tanstack/react-router'
import type { ReactElement } from 'react'

export function PrivacyPolicyNavbar(): ReactElement {
  return (
    <>
      <footer className="mobile-bottom-navbar fixed left-1/2 z-40 w-max -translate-x-1/2 rounded-full bg-[oklch(var(--background))]/95 px-4 py-2 backdrop-blur-sm md:hidden">
        <nav className="flex items-center gap-2 text-[12px] leading-none tracking-[0.01em] text-[oklch(var(--foreground))]">
          <Link to="/" className="cursor-pointer font-medium transition-opacity duration-200 hover:opacity-80">
            New
          </Link>
          <span aria-hidden="true">•</span>
          <span className="font-bold">Privacy Policy</span>
        </nav>
      </footer>
      <footer className="fixed inset-x-0 bottom-0 hidden bg-[oklch(var(--background))] px-[135px] py-4 md:block">
        <nav className="flex items-center justify-end text-[12px] leading-none tracking-[0.01em] text-[oklch(var(--foreground))]">
          <div className="flex items-center gap-2">
            <Link to="/" className="cursor-pointer font-medium hover:opacity-80">
              New
            </Link>
            <span aria-hidden="true">•</span>
            <span className="font-bold">Privacy Policy</span>
          </div>
        </nav>
      </footer>
    </>
  )
}
