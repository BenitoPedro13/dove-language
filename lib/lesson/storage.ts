import { del, entries, get, set } from "idb-keyval"
import { z } from "zod"

import { lessonSchema, type Lesson } from "./schema"
import { lessonTitle } from "./text"

/**
 * Drafts live in this browser's IndexedDB (architecture §3). Nothing is sent anywhere.
 * Browser-only: call from event handlers and effects, never during render.
 */
const PREFIX = "lesson:"

export type DraftSummary = {
  id: string
  title: string
  target: string
  level: string
  updatedAt: string
  slidesHint: number
}

export async function saveLesson(lesson: Lesson): Promise<void> {
  await set(PREFIX + lesson.id, lesson)
}

export async function loadLesson(id: string): Promise<Lesson | null> {
  const value = await get(PREFIX + id)
  const parsed = lessonSchema.safeParse(value)
  return parsed.success ? parsed.data : null
}

export async function deleteLesson(id: string): Promise<void> {
  await del(PREFIX + id)
}

export async function listDrafts(): Promise<DraftSummary[]> {
  const all = await entries<string, unknown>()
  const drafts: DraftSummary[] = []
  for (const [key, value] of all) {
    if (typeof key !== "string" || !key.startsWith(PREFIX)) continue
    const parsed = lessonSchema.safeParse(value)
    if (!parsed.success) continue
    const lesson = parsed.data
    drafts.push({
      id: lesson.id,
      title: lessonTitle(lesson),
      target: lesson.target,
      level: lesson.level,
      updatedAt: lesson.updatedAt,
      slidesHint: lesson.blocks.length,
    })
  }
  return drafts.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

/* ── .dove.json files ─────────────────────────────────────────────────── */

export const FILE_EXTENSION = ".dove.json"

export function lessonToFile(lesson: Lesson): Blob {
  return new Blob([JSON.stringify(lesson, null, 2)], { type: "application/json" })
}

export type ParseResult = { ok: true; lesson: Lesson } | { ok: false; error: string }

export function parseLessonFile(text: string): ParseResult {
  let json: unknown
  try {
    json = JSON.parse(text)
  } catch {
    return { ok: false, error: "This file is not a lesson file (it is not valid JSON)." }
  }
  const parsed = lessonSchema.safeParse(json)
  if (!parsed.success) {
    return { ok: false, error: `This lesson file has problems:\n${z.prettifyError(parsed.error)}` }
  }
  return { ok: true, lesson: parsed.data }
}
