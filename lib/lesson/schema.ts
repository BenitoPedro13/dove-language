import { z } from "zod"

/**
 * The single source of the lesson shape (architecture §2). Types are inferred from here and the
 * same schema validates imported `.dove.json` files.
 *
 * Conventions:
 * - `Localized` = one string per lesson language (target + glosses), keyed by BCP 47 tag.
 *   Keys for languages no longer active are kept, so switching back restores the text.
 * - A plain `string` field is always written in the target language.
 * - `glosses` on an item are its translations into the gloss languages.
 */
export const localized = z.record(z.string(), z.string())
export type Localized = z.infer<typeof localized>

const id = z.string().min(1)

export const imageSchema = z.object({
  src: z.string().startsWith("data:image/"),
  alt: z.string(),
  width: z.number().positive(),
  height: z.number().positive(),
})
export type LessonImage = z.infer<typeof imageSchema>

const heading = { heading: localized }

export const objectivesBlock = z.object({
  id,
  type: z.literal("objectives"),
  ...heading,
  topic: localized,
  text: localized,
})

export const promptBlock = z.object({
  id,
  type: z.literal("prompt"),
  ...heading,
  question: localized,
  detail: localized,
})

export const noteBlock = z.object({
  id,
  type: z.literal("note"),
  ...heading,
  text: localized,
})

export const vocabItem = z.object({ id, term: z.string(), glosses: localized, note: z.string() })
export const vocabularyBlock = z.object({
  id,
  type: z.literal("vocabulary"),
  ...heading,
  items: z.array(vocabItem),
})

export const exampleItem = z.object({ id, text: z.string(), glosses: localized })
export const examplesBlock = z.object({
  id,
  type: z.literal("examples"),
  ...heading,
  items: z.array(exampleItem),
})

export const spotlightBlock = z.object({
  id,
  type: z.literal("spotlight"),
  ...heading,
  term: z.string(),
  meaning: localized,
  example: z.string(),
  exampleGlosses: localized,
  note: localized,
})

export const abbreviationItem = z.object({ id, short: z.string(), full: z.string(), meaning: localized })
export const abbreviationsBlock = z.object({
  id,
  type: z.literal("abbreviations"),
  ...heading,
  items: z.array(abbreviationItem),
})

export const textImageBlock = z.object({
  id,
  type: z.literal("textImage"),
  ...heading,
  subheading: localized,
  text: localized,
  image: imageSchema.nullable(),
  imageSide: z.enum(["start", "end"]),
})

/** `image` is null until the teacher picks a file. */
export const galleryItem = z.object({ id, image: imageSchema.nullable(), caption: localized })
export const galleryBlock = z.object({
  id,
  type: z.literal("gallery"),
  ...heading,
  items: z.array(galleryItem),
})

export const breakBlock = z.object({
  id,
  type: z.literal("break"),
  title: localized,
})

export const fillBlankItem = z.object({ id, sentence: z.string() })
export const fillBlankBlock = z.object({
  id,
  type: z.literal("fillBlank"),
  ...heading,
  instructions: localized,
  items: z.array(fillBlankItem),
  /** Comma-separated. Empty = built from the answers in the sentences. */
  wordBank: z.string(),
  showAnswerKey: z.boolean(),
})

export const dialogueLine = z.object({ id, speaker: z.string(), text: z.string(), glosses: localized })
export const dialogueBlock = z.object({
  id,
  type: z.literal("dialogue"),
  ...heading,
  scene: localized,
  lines: z.array(dialogueLine),
})

export const closingBlock = z.object({
  id,
  type: z.literal("closing"),
  title: localized,
  message: localized,
  /** One step per line, e.g. "Download this lesson in 📂・lesson-resources". */
  nextSteps: z.string(),
})

export const blockSchema = z.discriminatedUnion("type", [
  objectivesBlock,
  promptBlock,
  noteBlock,
  vocabularyBlock,
  examplesBlock,
  spotlightBlock,
  abbreviationsBlock,
  textImageBlock,
  galleryBlock,
  breakBlock,
  fillBlankBlock,
  dialogueBlock,
  closingBlock,
])
export type Block = z.infer<typeof blockSchema>
export type BlockType = Block["type"]
export type BlockOf<T extends BlockType> = Extract<Block, { type: T }>

export const lessonSchema = z.object({
  version: z.literal(1),
  id,
  updatedAt: z.string(),
  target: z.string().min(2),
  glosses: z.array(z.string().min(2)).max(2),
  level: z.string(),
  title: localized,
  session: z.object({
    number: z.number().int().positive().nullable(),
    date: z.string(),
    host: z.string(),
  }),
  theme: z.enum(["paper", "night"]),
  blocks: z.array(blockSchema),
})
export type Lesson = z.infer<typeof lessonSchema>

/** Target first, then glosses — the order every Localized field is edited and read in. */
export function lessonLanguages(lesson: Pick<Lesson, "target" | "glosses">): string[] {
  return [lesson.target, ...lesson.glosses.filter((g) => g !== lesson.target)]
}
