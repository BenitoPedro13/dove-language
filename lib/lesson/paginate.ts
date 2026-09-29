import { BLOCKS, type Kind } from "./blocks"
import { hasBlank, wordBankFor } from "./fill-blank"
import { BODY, chunkByHeight, estimate } from "./fit"
import {
  lessonLanguages,
  type Block,
  type BlockOf,
  type Lesson,
  type Localized,
} from "./schema"

/**
 * Lesson → slides. The only place the per-slide rules of DS §9 live; renderers never decide
 * what fits. Pages are filled by estimated height (lib/lesson/fit.ts), with these hard caps
 * so a slide never gets crowded even when every item is short.
 */
export const LIMITS = {
  vocabulary: 8,
  examples: 3,
  abbreviations: 7,
  gallery: 4,
  fillBlank: 6,
  dialogue: 10,
} as const

/** Height-based pages, never more than `max` items each. */
function fill<T>(items: T[], max: number, height: (item: T) => number, budget: number, gap: number): T[][] {
  return chunkByHeight(items, height, budget, gap).flatMap((page) => chunk(page, max))
}

type Base = {
  key: string
  kind: Kind
  blockId: string | null
  /** Section number shown before the heading ("3 · Vocabulary"); null = unnumbered. */
  section: number | null
  heading: Localized | null
  cont: boolean
}

export type Slide = Base &
  (
    | { template: "cover" }
    | { template: "objectives"; block: BlockOf<"objectives">; languages: string[] }
    | { template: "prompt"; block: BlockOf<"prompt"> }
    | { template: "note"; block: BlockOf<"note">; languages: string[] }
    | { template: "vocabulary"; items: BlockOf<"vocabulary">["items"] }
    | { template: "examples"; items: BlockOf<"examples">["items"] }
    | { template: "spotlight"; block: BlockOf<"spotlight"> }
    | { template: "abbreviations"; items: BlockOf<"abbreviations">["items"] }
    | { template: "textImage"; block: BlockOf<"textImage"> }
    | { template: "gallery"; items: BlockOf<"gallery">["items"] }
    | { template: "break"; block: BlockOf<"break"> }
    | {
        template: "fillBlank"
        block: BlockOf<"fillBlank">
        items: BlockOf<"fillBlank">["items"]
        /** 1-based number of the first item on this slide. */
        start: number
        answers: boolean
      }
    | {
        template: "dialogue"
        block: BlockOf<"dialogue">
        lines: BlockOf<"dialogue">["lines"]
        /** The language this slide shows: the target, or one gloss (a translation slide). */
        language: string
      }
    | { template: "closing"; block: BlockOf<"closing"> }
  )

export function chunk<T>(items: T[], size: number): T[][] {
  if (items.length === 0) return [[]]
  const out: T[][] = []
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size))
  return out
}

const UNNUMBERED = new Set<Block["type"]>(["objectives", "break", "closing", "fillBlank"])

/** Languages that have text: side by side if the tallest column fits, else one slide each. */
function paragraphPages(value: Localized, languages: string[], topic?: Localized): string[][] {
  const filled = languages.filter((tag) => value[tag]?.trim())
  if (filled.length === 0) return [languages.slice(0, 1)]
  const height = estimate.paragraph(
    filled.map((tag) => value[tag]),
    filled.map((tag) => topic?.[tag]?.trim() ?? ""),
  )
  if (height <= BODY) return [filled]
  return filled.map((tag) => [tag])
}

export function paginate(lesson: Lesson): Slide[] {
  const languages = lessonLanguages(lesson)
  const glossTags = languages.slice(1)
  const glossesOf = (value: Localized) => glossTags.map((tag) => value[tag]?.trim() ?? "")
  const slides: Slide[] = [
    {
      key: "cover",
      template: "cover",
      kind: "lesson",
      blockId: null,
      section: null,
      heading: null,
      cont: false,
    },
  ]

  let section = 0
  for (const block of lesson.blocks) {
    const kind = BLOCKS[block.type].kind
    const number = UNNUMBERED.has(block.type) ? null : ++section
    const heading = "heading" in block ? block.heading : null
    const base = (i: number, suffix = ""): Base => ({
      key: `${block.id}:${i}${suffix}`,
      kind,
      blockId: block.id,
      section: number,
      heading,
      cont: i > 0,
    })

    switch (block.type) {
      case "objectives":
        paragraphPages(block.text, languages, block.topic).forEach((langs, i) =>
          // Objectives repeat per language by design, so they're never "(cont.)".
          slides.push({ ...base(i), cont: false, template: "objectives", block, languages: langs }),
        )
        break
      case "note":
        paragraphPages(block.text, languages).forEach((langs, i) =>
          slides.push({ ...base(i), cont: false, template: "note", block, languages: langs }),
        )
        break
      case "prompt":
      case "spotlight":
      case "textImage":
      case "break":
      case "closing":
        slides.push({ ...base(0), template: block.type, block } as Slide)
        break
      case "vocabulary":
        fill(
          block.items,
          LIMITS.vocabulary,
          (item) => estimate.vocabItem(`${item.term} ${item.note}`, glossesOf(item.glosses)),
          estimate.vocabBudget,
          estimate.vocabGap,
        ).forEach((items, i) =>
          slides.push({ ...base(i), template: "vocabulary", items }),
        )
        break
      case "examples":
        fill(
          block.items,
          LIMITS.examples,
          (item) => estimate.example(item.text, glossesOf(item.glosses)),
          BODY,
          estimate.exampleGap,
        ).forEach((items, i) =>
          slides.push({ ...base(i), template: "examples", items }),
        )
        break
      case "abbreviations":
        fill(
          block.items,
          LIMITS.abbreviations,
          (item) => estimate.abbr(item.short, item.full, glossesOf(item.meaning).filter(Boolean).join(" · ")),
          BODY,
          estimate.abbrGap,
        ).forEach((items, i) =>
          slides.push({ ...base(i), template: "abbreviations", items }),
        )
        break
      case "gallery":
        chunk(block.items, LIMITS.gallery).forEach((items, i) =>
          slides.push({ ...base(i), template: "gallery", items }),
        )
        break
      case "fillBlank": {
        const bank = wordBankFor(
          block.items.map((item) => item.sentence),
          block.wordBank,
        )
        const pages = fill(
          block.items,
          LIMITS.fillBlank,
          (item) => estimate.fillItem(item.sentence),
          estimate.fillBudget(bank),
          estimate.fillGap,
        )
        const starts = pages.map((_, i) => pages.slice(0, i).reduce((n, p) => n + p.length, 1))
        pages.forEach((items, i) =>
          slides.push({ ...base(i), template: "fillBlank", block, items, start: starts[i], answers: false }),
        )
        const gradable = block.items.some((item) => hasBlank(item.sentence))
        if (block.showAnswerKey && gradable) {
          pages.forEach((items, i) =>
            slides.push({
              ...base(i, ":answers"),
              cont: i > 0,
              template: "fillBlank",
              block,
              items,
              start: starts[i],
              answers: true,
            }),
          )
        }
        break
      }
      case "dialogue": {
        const withText = (tag: string) =>
          tag === lesson.target || block.lines.some((line) => line.glosses[tag]?.trim())
        for (const tag of languages.filter(withText)) {
          const text = (line: (typeof block.lines)[number]) =>
            tag === lesson.target ? line.text : (line.glosses[tag] ?? "")
          fill(
            block.lines,
            LIMITS.dialogue,
            (line) => estimate.dialogueLine(text(line)),
            estimate.dialogueBudget,
            estimate.dialogueGap,
          ).forEach((lines, i) =>
            slides.push({ ...base(i, `:${tag}`), template: "dialogue", block, lines, language: tag }),
          )
        }
        break
      }
    }
  }
  return slides
}

/** Index of the first slide produced by a block — used to scroll the preview to it. */
export function firstSlideOf(slides: Slide[], blockId: string): number {
  return slides.findIndex((s) => s.blockId === blockId)
}
