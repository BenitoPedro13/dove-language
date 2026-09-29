"use client"

import { useEffect, useState } from "react"

import { loadLesson } from "@/lib/lesson/storage"
import type { Lesson } from "@/lib/lesson/schema"

export type StoredLesson =
  | { status: "loading" }
  | { status: "missing" }
  | { status: "ready"; lesson: Lesson }

/** Reads one draft from this browser's IndexedDB. */
export function useStoredLesson(id: string | null): StoredLesson {
  const [result, setResult] = useState<{ id: string | null; state: StoredLesson }>({
    id: null,
    state: { status: "loading" },
  })

  useEffect(() => {
    if (!id) return
    let cancelled = false
    loadLesson(id).then(
      (lesson) =>
        !cancelled && setResult({ id, state: lesson ? { status: "ready", lesson } : { status: "missing" } }),
      () => !cancelled && setResult({ id, state: { status: "missing" } }),
    )
    return () => {
      cancelled = true
    }
  }, [id])

  if (!id) return { status: "missing" }
  return result.id === id ? result.state : { status: "loading" }
}
