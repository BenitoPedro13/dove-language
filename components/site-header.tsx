import Link from "next/link"
import type { ReactNode } from "react"

import { DoveMark } from "@/components/lesson/devices"

/** Quiet tool chrome (DS §11): the mark, the name, two links. */
export function SiteHeader({ children }: { children?: ReactNode }) {
  return (
    <header className="border-b border-rule bg-paper">
      <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
        <Link href="/" className="flex min-h-11 items-center gap-3 rounded-md">
          <DoveMark className="size-9 rounded-full" />
          <span className="font-display text-lg leading-none font-bold">
            The Dove Language
            <span className="block font-mono text-xs font-medium tracking-wide text-slate">Lesson Studio</span>
          </span>
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 text-sm">
          <Link href="/" className="inline-flex min-h-11 items-center rounded-md px-3 hover:bg-paper-deep">
            My lessons
          </Link>
          <Link href="/brand" className="inline-flex min-h-11 items-center rounded-md px-3 hover:bg-paper-deep">
            Design system
          </Link>
        </nav>
        {children ? <div className="ms-auto flex flex-wrap items-center gap-2">{children}</div> : null}
      </div>
    </header>
  )
}
