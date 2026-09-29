"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { useStoredLesson } from "@/hooks/use-stored-lesson"

import { Editor } from "./editor"

/** Loads the draft named in ?id= from this browser, then hands it to the editor. */
export function StudioShell() {
  const id = useSearchParams().get("id")
  const stored = useStoredLesson(id)

  if (stored.status === "loading") {
    return <p className="p-8 text-slate" role="status">Opening your lesson…</p>
  }
  if (stored.status === "missing") {
    return (
      <div className="mx-auto grid max-w-lg gap-4 p-8">
        <h1 className="font-display text-3xl font-bold">Lesson not found</h1>
        <p>
          Lessons are saved in the browser where you made them. If you made it on another computer or browser,
          download the lesson file there and open it here.
        </p>
        <Link href="/" className="font-bold text-globe underline underline-offset-4">
          Back to my lessons
        </Link>
      </div>
    )
  }
  return <Editor key={stored.lesson.id} initial={stored.lesson} />
}
