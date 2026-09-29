"use client"

import { useEffect, useState } from "react"

import { deleteLesson, listDrafts, type DraftSummary } from "@/lib/lesson/storage"

/** The drafts saved in this browser, newest first. `null` while loading. */
export function useLessonDrafts() {
  const [drafts, setDrafts] = useState<DraftSummary[] | null>(null)

  useEffect(() => {
    let cancelled = false
    listDrafts().then(
      (list) => !cancelled && setDrafts(list),
      () => !cancelled && setDrafts([]),
    )
    return () => {
      cancelled = true
    }
  }, [])

  async function remove(id: string) {
    await deleteLesson(id)
    setDrafts((current) => current?.filter((d) => d.id !== id) ?? null)
  }

  return { drafts, remove }
}
