"use client"

import { lessonFileName } from "@/lib/lesson/text"
import { FILE_EXTENSION, lessonToFile } from "@/lib/lesson/storage"
import type { Lesson } from "@/lib/lesson/schema"

/** Saves the lesson as a .dove.json file on the teacher's computer. */
export function useLessonDownload() {
  return function download(lesson: Lesson) {
    const url = URL.createObjectURL(lessonToFile(lesson))
    const link = document.createElement("a")
    link.href = url
    link.download = lessonFileName(lesson, "lesson").replace(/[\\/:*?"<>|]/g, "-") + FILE_EXTENSION
    link.click()
    URL.revokeObjectURL(url)
  }
}
