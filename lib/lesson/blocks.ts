import { phraseFor } from "./phrases"
import type { Block, BlockOf, BlockType, Lesson, Localized } from "./schema"

/** Wayfinding kinds (DS §4.2). `lesson` is chrome: cover, objectives, closing. */
export type Kind = "lesson" | "learn" | "culture" | "practice" | "talk"

export const KIND_LABEL: Record<Kind, string> = {
  lesson: "Lesson",
  learn: "Learn",
  culture: "Culture",
  practice: "Practice",
  talk: "Talk",
}

type BlockInfo = {
  label: string
  kind: Kind
  /** Plain-English help shown in the "Add block" menu (DS §2 voice). */
  hint: string
}

export const BLOCKS: Record<BlockType, BlockInfo> = {
  objectives: { label: "Objectives", kind: "lesson", hint: "What students will learn today." },
  prompt: { label: "Discussion question", kind: "talk", hint: "One big question to start talking." },
  note: { label: "Cultural note", kind: "culture", hint: "A short paragraph about culture." },
  vocabulary: { label: "Vocabulary", kind: "learn", hint: "Words with their translations." },
  examples: { label: "Example sentences", kind: "learn", hint: "Sentences with translations." },
  spotlight: { label: "Word spotlight", kind: "learn", hint: "One word or slang: meaning and example." },
  abbreviations: { label: "Abbreviations", kind: "learn", hint: "Short forms, like “vc → você”." },
  textImage: { label: "Text and image", kind: "culture", hint: "A paragraph next to a picture." },
  gallery: { label: "Image gallery", kind: "culture", hint: "Up to four pictures with captions." },
  break: { label: "Break slide", kind: "practice", hint: "A big title, like “Exercise time”." },
  fillBlank: { label: "Fill in the blank", kind: "practice", hint: "Sentences with gaps and a word bank." },
  dialogue: { label: "Dialogue", kind: "talk", hint: "A conversation between people." },
  closing: { label: "Closing", kind: "lesson", hint: "Thank you and next steps." },
}

/** Order of the "Add block" menu — roughly the order of a session. */
export const BLOCK_ORDER: BlockType[] = [
  "objectives",
  "prompt",
  "note",
  "vocabulary",
  "examples",
  "spotlight",
  "abbreviations",
  "textImage",
  "gallery",
  "break",
  "fillBlank",
  "dialogue",
  "closing",
]

export function newId(): string {
  return crypto.randomUUID()
}

function empty(languages: string[]): Localized {
  return Object.fromEntries(languages.map((tag) => [tag, ""]))
}

/** A new block with sensible headings in every language we can write (lib/lesson/phrases.ts). */
export function createBlock<T extends BlockType>(type: T, languages: string[]): BlockOf<T> {
  const id = newId()
  const e = () => empty(languages)
  const p = (key: Parameters<typeof phraseFor>[1]) => phraseFor(languages, key)

  const blocks: { [K in BlockType]: () => BlockOf<K> } = {
    objectives: () => ({ id, type: "objectives", heading: p("objectives"), topic: e(), text: e() }),
    prompt: () => ({ id, type: "prompt", heading: p("introduction"), question: e(), detail: e() }),
    note: () => ({ id, type: "note", heading: p("culturalNote"), text: e() }),
    vocabulary: () => ({
      id,
      type: "vocabulary",
      heading: p("vocabulary"),
      items: [{ id: newId(), term: "", glosses: {}, note: "" }],
    }),
    examples: () => ({
      id,
      type: "examples",
      heading: p("examples"),
      items: [{ id: newId(), text: "", glosses: {} }],
    }),
    spotlight: () => ({
      id,
      type: "spotlight",
      heading: p("spotlight"),
      term: "",
      meaning: {},
      example: "",
      exampleGlosses: {},
      note: {},
    }),
    abbreviations: () => ({
      id,
      type: "abbreviations",
      heading: p("abbreviations"),
      items: [{ id: newId(), short: "", full: "", meaning: {} }],
    }),
    textImage: () => ({
      id,
      type: "textImage",
      heading: p("textImage"),
      subheading: e(),
      text: e(),
      image: null,
      imageSide: "end",
    }),
    gallery: () => ({ id, type: "gallery", heading: p("gallery"), items: [] }),
    break: () => ({ id, type: "break", title: p("exerciseTime") }),
    fillBlank: () => ({
      id,
      type: "fillBlank",
      heading: p("fillBlank"),
      instructions: p("fillBlankInstructions"),
      items: [{ id: newId(), sentence: "" }],
      wordBank: "",
      showAnswerKey: true,
    }),
    dialogue: () => ({
      id,
      type: "dialogue",
      heading: p("dialogue"),
      scene: e(),
      lines: [{ id: newId(), speaker: "", text: "", glosses: {} }],
    }),
    closing: () => ({
      id,
      type: "closing",
      title: p("thanks"),
      message: p("closingMessage"),
      nextSteps: "",
    }),
  }
  return blocks[type]() as BlockOf<T>
}

export function createLesson(target = "pt-BR", glosses: string[] = ["en"], level = "A1–A2"): Lesson {
  const languages = [target, ...glosses]
  return {
    version: 1,
    id: newId(),
    updatedAt: new Date().toISOString(),
    target,
    glosses,
    level,
    title: empty(languages),
    session: { number: null, date: "", host: "" },
    theme: "paper",
    blocks: [
      createBlock("objectives", languages),
      createBlock("vocabulary", languages),
      createBlock("closing", languages),
    ],
  }
}

/** A copy with fresh ids everywhere, so duplicated items never share React keys. */
export function cloneBlock(block: Block): Block {
  const copy = structuredClone(block)
  copy.id = newId()
  for (const value of Object.values(copy)) {
    if (!Array.isArray(value)) continue
    for (const item of value) if (item && typeof item === "object" && "id" in item) item.id = newId()
  }
  return copy
}
