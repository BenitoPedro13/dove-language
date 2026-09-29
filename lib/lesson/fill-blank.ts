/**
 * Fill-in-the-blank sentences mark answers inline: `Eu vou [postar] uma foto.`
 * Alternatives use a slash: `Você pode [postar/curtir/compartilhar] meu vídeo?`
 */
export type FillSegment = { kind: "text"; text: string } | { kind: "blank"; answers: string[] }

const BLANK = /\[([^\]]*)\]/g

export function parseFillSentence(sentence: string): FillSegment[] {
  const segments: FillSegment[] = []
  let last = 0
  for (const match of sentence.matchAll(BLANK)) {
    if (match.index > last) segments.push({ kind: "text", text: sentence.slice(last, match.index) })
    const answers = match[1]
      .split("/")
      .map((a) => a.trim())
      .filter(Boolean)
    segments.push({ kind: "blank", answers })
    last = match.index + match[0].length
  }
  if (last < sentence.length) segments.push({ kind: "text", text: sentence.slice(last) })
  return segments
}

export function hasBlank(sentence: string): boolean {
  return parseFillSentence(sentence).some((s) => s.kind === "blank")
}

/** The word bank: the teacher's list if given, otherwise every distinct answer in order. */
export function wordBankFor(sentences: string[], override: string): string[] {
  const manual = override
    .split(",")
    .map((w) => w.trim())
    .filter(Boolean)
  if (manual.length > 0) return manual

  const seen = new Set<string>()
  for (const sentence of sentences) {
    for (const segment of parseFillSentence(sentence)) {
      if (segment.kind !== "blank") continue
      for (const answer of segment.answers) seen.add(answer)
    }
  }
  return [...seen]
}
