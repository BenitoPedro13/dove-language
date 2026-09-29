import type { Metadata } from "next"
import { Suspense } from "react"

import { StudioShell } from "@/components/studio/studio-shell"

export const metadata: Metadata = { title: "Lesson Studio" }

export default function StudioPage() {
  return (
    <Suspense fallback={<p className="p-8 text-slate">Opening your lesson…</p>}>
      <StudioShell />
    </Suspense>
  )
}
