"use client"

import { TriangleAlert } from "lucide-react"
import { useRef } from "react"

import { Handout } from "@/components/lesson/handout"
import { SlideView } from "@/components/lesson/slide-view"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSlideOverflow } from "@/hooks/use-slide-overflow"
import type { Slide } from "@/lib/lesson/paginate"
import type { Lesson } from "@/lib/lesson/schema"

import { SETTINGS } from "./outline"

/** Live preview: the selected block's slides, the whole deck, or the handout. */
export function Preview({ lesson, slides, selected }: { lesson: Lesson; slides: Slide[]; selected: string }) {
  const deckRef = useRef<HTMLOListElement>(null)
  const blockRef = useRef<HTMLDivElement>(null)
  const overflowDeck = useSlideOverflow(deckRef, slides)
  const overflowBlock = useSlideOverflow(blockRef, slides)
  const overflowing = [...new Set([...overflowDeck, ...overflowBlock])].sort((a, b) => a - b)

  const mine = slides
    .map((slide, index) => ({ slide, index }))
    .filter(({ slide }) => (selected === SETTINGS ? slide.template === "cover" : slide.blockId === selected))

  return (
    <Tabs defaultValue="block" className="gap-4">
      <TabsList className="w-full">
        <TabsTrigger value="block">This block</TabsTrigger>
        <TabsTrigger value="deck">All {slides.length} slides</TabsTrigger>
        <TabsTrigger value="handout">Handout</TabsTrigger>
      </TabsList>

      {overflowing.length > 0 ? (
        <p role="status" className="flex gap-2 rounded-lg bg-note p-3 text-sm text-ink">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>
            Too much text on slide {overflowing.map((i) => i + 1).join(", ")}. Shorten it, or split the block in two
            (Duplicate, then delete half of the items in each).
          </span>
        </p>
      ) : null}

      <TabsContent value="block">
        <div ref={blockRef} className="grid gap-4" aria-live="polite">
          {mine.length === 0 ? (
            <p className="text-sm text-slate">This block has no slides yet.</p>
          ) : (
            mine.map(({ slide, index }) => (
              <div key={slide.key} className="overflow-hidden rounded-lg shadow-sm ring-1 ring-rule">
                <SlideView lesson={lesson} slide={slide} index={index} total={slides.length} />
              </div>
            ))
          )}
        </div>
      </TabsContent>

      <TabsContent value="deck">
        <ol ref={deckRef} className="grid gap-3 sm:grid-cols-2">
          {slides.map((slide, index) => (
            <li key={slide.key} className="overflow-hidden rounded-md ring-1 ring-rule">
              <SlideView lesson={lesson} slide={slide} index={index} total={slides.length} />
            </li>
          ))}
        </ol>
      </TabsContent>

      <TabsContent value="handout">
        <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-rule sm:p-8">
          <Handout lesson={lesson} />
        </div>
      </TabsContent>
    </Tabs>
  )
}
