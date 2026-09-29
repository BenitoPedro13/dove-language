"use client"

import { useReducer } from "react"

import { cloneBlock } from "@/lib/lesson/blocks"
import type { Block, Lesson } from "@/lib/lesson/schema"

type Action =
  | { type: "patch"; patch: Partial<Pick<Lesson, "title" | "level" | "session" | "theme">> }
  | { type: "languages"; target: string; glosses: string[] }
  | { type: "insert"; block: Block; afterId: string | null }
  | { type: "update"; block: Block }
  | { type: "move"; id: string; delta: -1 | 1 }
  | { type: "duplicate"; id: string }
  | { type: "remove"; id: string }

function touch(lesson: Lesson): Lesson {
  return { ...lesson, updatedAt: new Date().toISOString() }
}

function reducer(lesson: Lesson, action: Action): Lesson {
  const blocks = lesson.blocks
  const index = "id" in action ? blocks.findIndex((b) => b.id === action.id) : -1

  switch (action.type) {
    case "patch":
      return touch({ ...lesson, ...action.patch })

    case "languages":
      return touch({
        ...lesson,
        target: action.target,
        glosses: action.glosses.filter((g) => g !== action.target).slice(0, 2),
      })

    case "insert": {
      const after = action.afterId ? blocks.findIndex((b) => b.id === action.afterId) : -1
      const at = after >= 0 ? after + 1 : blocks.length
      return touch({ ...lesson, blocks: [...blocks.slice(0, at), action.block, ...blocks.slice(at)] })
    }

    case "update":
      return touch({ ...lesson, blocks: blocks.map((b) => (b.id === action.block.id ? action.block : b)) })

    case "move": {
      const to = index + action.delta
      if (index < 0 || to < 0 || to >= blocks.length) return lesson
      const next = [...blocks]
      ;[next[index], next[to]] = [next[to], next[index]]
      return touch({ ...lesson, blocks: next })
    }

    case "duplicate": {
      if (index < 0) return lesson
      const next = [...blocks]
      next.splice(index + 1, 0, cloneBlock(blocks[index]))
      return touch({ ...lesson, blocks: next })
    }

    case "remove":
      return touch({ ...lesson, blocks: blocks.filter((b) => b.id !== action.id) })
  }
}

/**
 * The one owner of the lesson being edited (architecture §5). Editor and preview both get the
 * lesson as props from the component that calls this.
 */
export function useLessonEditor(initial: Lesson) {
  const [lesson, dispatch] = useReducer(reducer, initial)
  return { lesson, dispatch }
}

export type LessonDispatch = ReturnType<typeof useLessonEditor>["dispatch"]
