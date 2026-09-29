"use client"

import { Printer } from "lucide-react"
import { useSearchParams } from "next/navigation"

import { Handout } from "@/components/lesson/handout"
import { SlideView } from "@/components/lesson/slide-view"
import { Button } from "@/components/ui/button"
import { usePrintWhenReady } from "@/hooks/use-print-when-ready"
import { useStoredLesson } from "@/hooks/use-stored-lesson"
import { paginate } from "@/lib/lesson/paginate"
import { lessonFileName } from "@/lib/lesson/text"

export type PrintFormat = "slides" | "handout"

/**
 * architecture §4: the browser's print engine makes the PDF. Slides are 1920 × 1080 px pages
 * (= 1440 × 810 pt, the current deck size); the handout is A4.
 */
const PAGE_CSS: Record<PrintFormat, string> = {
  slides: "@page { size: 1920px 1080px; margin: 0 } @media print { html, body { background: none } }",
  handout: "@page { size: A4; margin: 16mm 18mm }",
}

export function PrintView({ format }: { format: PrintFormat }) {
  const stored = useStoredLesson(useSearchParams().get("id"))
  const lesson = stored.status === "ready" ? stored.lesson : null
  const title = lesson ? lessonFileName(lesson, format === "slides" ? "slides" : "handout") : "The Dove Language"
  const { print } = usePrintWhenReady(lesson !== null, title)

  if (stored.status === "loading") return <p className="p-8" role="status">Preparing your PDF…</p>
  if (!lesson) {
    return <p className="p-8">This lesson is not saved in this browser. Open it in the studio first.</p>
  }

  const slides = paginate(lesson)
  return (
    <>
      <style>{PAGE_CSS[format]}</style>
      <div className="no-print sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b border-rule bg-paper p-3 text-sm">
        <p className="me-auto">
          In the print window, choose <strong>Save as PDF</strong>
          {format === "slides" ? (
            <>
              {" "}and turn on <strong>Background graphics</strong>
            </>
          ) : null}
          .
        </p>
        <Button onClick={print}>
          <Printer /> Print or save as PDF
        </Button>
      </div>
      {format === "slides" ? (
        <main className="print-deck mx-auto grid max-w-[1920px] gap-6 p-6 print:gap-0 print:p-0">
          {slides.map((slide, index) => (
            <SlideView key={slide.key} lesson={lesson} slide={slide} index={index} total={slides.length} />
          ))}
        </main>
      ) : (
        <main className="mx-auto max-w-[210mm] bg-white p-[18mm] print:p-0">
          <Handout lesson={lesson} />
        </main>
      )}
    </>
  )
}
