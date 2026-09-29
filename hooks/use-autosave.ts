"use client"

import { useEffect, useState } from "react"

import { saveLesson } from "@/lib/lesson/storage"
import type { Lesson } from "@/lib/lesson/schema"

const QUIET_MS = 400

export type SaveStatus = "saved" | "saving" | "error"

/** Writes the lesson to IndexedDB after the teacher stops typing (architecture §3, §5). */
export function useAutosave(lesson: Lesson): SaveStatus {
  const [saved, setSaved] = useState<{ at: string; ok: boolean }>({ at: lesson.updatedAt, ok: true })

  useEffect(() => {
    let cancelled = false
    const timer = window.setTimeout(() => {
      saveLesson(lesson).then(
        () => !cancelled && setSaved({ at: lesson.updatedAt, ok: true }),
        () => !cancelled && setSaved({ at: lesson.updatedAt, ok: false }),
      )
    }, QUIET_MS)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [lesson])

  if (!saved.ok) return "error"
  return saved.at === lesson.updatedAt ? "saved" : "saving"
}
