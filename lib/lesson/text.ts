import { lessonLanguages, type Lesson, type Localized } from "./schema"

export type Line = { tag: string; text: string }

export function t(value: Localized | undefined, tag: string): string {
  return value?.[tag]?.trim() ?? ""
}

/** The filled-in languages of a Localized value, target first. */
export function lines(value: Localized | undefined, languages: string[]): Line[] {
  return languages.map((tag) => ({ tag, text: t(value, tag) })).filter((line) => line.text)
}

/** The lesson title in its best available language — for headers and file names. */
export function lessonTitle(lesson: Lesson): string {
  return lines(lesson.title, lessonLanguages(lesson))[0]?.text ?? "Untitled lesson"
}

/** Title in the first gloss language if there is one (read by everyone), else the target. */
export function lessonShortTitle(lesson: Lesson): string {
  const [target, ...glosses] = lessonLanguages(lesson)
  return t(lesson.title, glosses[0] ?? target) || lessonTitle(lesson)
}

/** "Portuguese Session A1–A2 — Social media & the internet" — the PDF's file name. */
export function lessonFileName(lesson: Lesson, suffix: string): string {
  return `${lessonShortTitle(lesson)} · ${lesson.level} · The Dove Language (${suffix})`
}
