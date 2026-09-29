"use client"

import { ArrowDown, ArrowUp, Copy, EllipsisVertical, Plus, Settings2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { LessonDispatch } from "@/hooks/use-lesson-editor"
import { BLOCK_ORDER, BLOCKS, KIND_LABEL, createBlock } from "@/lib/lesson/blocks"
import { lessonLanguages, type BlockType, type Lesson } from "@/lib/lesson/schema"
import { lines } from "@/lib/lesson/text"
import { cn } from "@/lib/utils"

export const SETTINGS = "settings"

/** The lesson as a list: select a block to edit it; add, move, copy or delete blocks. */
export function Outline({
  lesson,
  selected,
  onSelect,
  dispatch,
}: {
  lesson: Lesson
  selected: string
  onSelect: (id: string) => void
  dispatch: LessonDispatch
}) {
  const languages = lessonLanguages(lesson)

  function add(type: BlockType) {
    const block = createBlock(type, languages)
    const afterId = selected === SETTINGS ? null : selected
    dispatch({ type: "insert", block, afterId })
    onSelect(block.id)
  }

  function remove(id: string, index: number) {
    const neighbour = lesson.blocks[index + 1] ?? lesson.blocks[index - 1]
    dispatch({ type: "remove", id })
    onSelect(neighbour?.id ?? SETTINGS)
  }

  return (
    <nav aria-label="Lesson outline" className="grid content-start gap-3">
      <button
        type="button"
        aria-current={selected === SETTINGS ? "true" : undefined}
        onClick={() => onSelect(SETTINGS)}
        className={cn(
          "flex min-h-11 items-center gap-2 rounded-lg border px-3 text-start text-sm font-bold",
          selected === SETTINGS ? "border-globe bg-sky" : "border-rule bg-white hover:border-globe",
        )}
      >
        <Settings2 className="size-4" aria-hidden="true" /> Lesson settings and cover
      </button>

      <ol className="grid gap-1.5">
        {lesson.blocks.map((block, index) => {
          const info = BLOCKS[block.type]
          const summary =
            lines("heading" in block ? block.heading : block.title, languages)[0]?.text ?? info.hint
          const isSelected = selected === block.id
          return (
            <li key={block.id} className="flex items-stretch gap-1">
              <button
                type="button"
                aria-current={isSelected ? "true" : undefined}
                onClick={() => onSelect(block.id)}
                className={cn(
                  "grid min-h-11 flex-1 gap-0.5 rounded-lg border px-3 py-2 text-start",
                  isSelected ? "border-globe bg-sky" : "border-rule bg-white hover:border-globe",
                )}
              >
                <span className="flex items-center gap-2 text-sm font-bold">
                  <span className="font-mono text-xs text-slate">{String(index + 1).padStart(2, "0")}</span>
                  {info.label}
                  <span
                    className="ms-auto rounded px-1.5 py-0.5 font-mono text-[0.6875rem] tracking-wider uppercase"
                    style={{ background: `var(--dove-${info.kind}-tint)`, color: `var(--dove-${info.kind}-strong)` }}
                  >
                    {KIND_LABEL[info.kind]}
                  </span>
                </span>
                <span className="line-clamp-1 text-xs text-slate">{summary}</span>
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label={`Actions for block ${index + 1}, ${info.label}`}>
                    <EllipsisVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled={index === 0} onSelect={() => dispatch({ type: "move", id: block.id, delta: -1 })}>
                    <ArrowUp /> Move up
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={index === lesson.blocks.length - 1}
                    onSelect={() => dispatch({ type: "move", id: block.id, delta: 1 })}
                  >
                    <ArrowDown /> Move down
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => dispatch({ type: "duplicate", id: block.id })}>
                    <Copy /> Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onSelect={() => remove(block.id, index)}>
                    <Trash2 /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          )
        })}
      </ol>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-full">
            <Plus /> Add a block
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-72">
          <DropdownMenuLabel>
            {selected === SETTINGS ? "Adds at the end" : "Adds after the selected block"}
          </DropdownMenuLabel>
          {BLOCK_ORDER.map((type) => (
            <DropdownMenuItem key={type} onSelect={() => add(type)} className="grid gap-0 py-2">
              <span className="font-bold">{BLOCKS[type].label}</span>
              <span className="text-xs text-slate">{BLOCKS[type].hint}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}
