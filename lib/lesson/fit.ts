/**
 * Height estimates on the 1920 × 1080 canvas, so pagination fills a slide by *space*, not by a
 * fixed item count (a 10-line dialogue with long lines used to run into the footer).
 *
 * Every number mirrors a size in app/lesson.css — change them together.
 *
 * Body budget: 1080 − 72 top − 56 bottom padding − 3 × 32 row gaps − header 56 − heading 121
 * − footer 56 = 623px. BODY keeps a margin under that for estimation error.
 */
export const BODY = 580
const CONTENT_WIDTH = 1680

/** Width of a string in em. CJK and other full-width glyphs are ~1em; Latin/Cyrillic ~0.54em. */
function widthEm(text: string, bold = false): number {
  let em = 0
  for (const char of text) {
    const code = char.codePointAt(0) ?? 0
    const wide =
      (code >= 0x1100 && code <= 0x11ff) || // Hangul Jamo
      (code >= 0x2e80 && code <= 0xa4cf) || // CJK, kana, Yi
      (code >= 0xac00 && code <= 0xd7af) || // Hangul syllables
      (code >= 0xf900 && code <= 0xfaff) || // CJK compatibility
      (code >= 0xff00 && code <= 0xff60) // full-width forms
    em += wide ? 1 : bold ? 0.58 : 0.54
  }
  return em
}

/** Lines a string wraps to at `fontPx` in a box `boxPx` wide (+10% for word-wrap waste). */
export function lineCount(text: string, fontPx: number, boxPx: number, bold = false): number {
  if (!text.trim()) return 0
  return text
    .split("\n")
    .reduce((sum, part) => sum + Math.max(1, Math.ceil((widthEm(part, bold) * fontPx * 1.1) / boxPx)), 0)
}

export function textHeight(text: string, fontPx: number, lineHeight: number, boxPx: number, bold = false) {
  return lineCount(text, fontPx, boxPx, bold) * fontPx * lineHeight
}

/** Split items into pages whose estimated heights (plus gaps) stay within `budget`. */
export function chunkByHeight<T>(items: T[], height: (item: T) => number, budget: number, gap = 0): T[][] {
  if (items.length === 0) return [[]]
  const pages: T[][] = [[]]
  let used = 0
  for (const item of items) {
    const h = height(item)
    const page = pages[pages.length - 1]
    const needed = page.length === 0 ? h : used + gap + h
    if (page.length > 0 && needed > budget) {
      pages.push([item])
      used = h
    } else {
      page.push(item)
      used = needed
    }
  }
  return pages
}

/* ── Per-template estimates (sizes from app/lesson.css) ─────────────────── */

const VOCAB_COLUMN = (CONTENT_WIDTH - 96) / 2

export const estimate = {
  /** Vocabulary flows in two independent columns; budget is both columns minus one item of slack. */
  vocabBudget: BODY * 2 - 60,
  vocabGap: 20,
  vocabItem(term: string, glosses: string[]) {
    const termH = textHeight(term, 40, 1.3, VOCAB_COLUMN, true)
    const glossText = glosses.filter(Boolean).map((g) => `EN ${g}`).join("    ")
    const glossH = glossText ? 6 + textHeight(glossText, 30, 1.35, VOCAB_COLUMN) : 0
    return termH + glossH + 16
  },

  exampleGap: 74,
  example(text: string, glosses: string[]) {
    const main = textHeight(text, 48, 1.3, 1500)
    const g = glosses.filter(Boolean)
    const glossH = g.length ? 10 + g.reduce((s, x) => s + textHeight(`EN ${x}`, 32, 1.35, 1500), 0) : 0
    return main + glossH
  },

  abbrGap: 22,
  abbr(short: string, full: string, meaning: string) {
    return Math.max(53, textHeight(meaning, 32, 1.35, 900), textHeight(full, 40, 1.3, 500))
  },

  /** The scene line above a dialogue takes 30px text + 24px margin. */
  dialogueBudget: BODY - 64,
  dialogueGap: 8,
  dialogueLine(text: string) {
    return textHeight(text, 34, 1.3, 1500)
  },

  /** Instructions line on top, word bank at the bottom. */
  fillBudget(bank: string[]) {
    const bankH = bank.length ? textHeight(bank.join("      "), 32, 2.2, CONTENT_WIDTH - 200) : 0
    return BODY - 64 - (bankH ? bankH + 32 : 0)
  },
  fillGap: 22,
  fillItem(sentence: string) {
    return textHeight(sentence.replace(/\[[^\]]*\]/g, "__________"), 40, 1.35, CONTENT_WIDTH - 64)
  },

  /** Paragraph columns: the tallest column must fit. */
  paragraph(texts: string[], topics: string[]) {
    const columns = Math.max(1, texts.length)
    const width = columns === 1 ? 1280 : (CONTENT_WIDTH - 72 * (columns - 1)) / columns
    const size = columns === 1 ? 40 : columns === 2 ? 34 : 30
    return Math.max(
      ...texts.map(
        (text, i) =>
          (columns > 1 ? 44 : 0) +
          (topics[i] ? 32 + textHeight(topics[i], 48, 1.2, width, true) + 24 : 0) +
          textHeight(text, size, 1.4, width),
      ),
    )
  },
}
