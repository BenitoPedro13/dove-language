import { BLOCKS } from "./blocks"
import { hasBlank } from "./fill-blank"
import { lessonLanguages, type Lesson } from "./schema"
import { lines } from "./text"

export type Issue = {
  blockId: string | null
  message: string
  /** Blocking issues stop PDF export (DS §7, §10: every image needs alt text). */
  blocking: boolean
}

/** Problems a teacher should fix before sharing. Plain English (DS §2). */
export function lessonIssues(lesson: Lesson): Issue[] {
  const issues: Issue[] = []
  const languages = lessonLanguages(lesson)

  if (lines(lesson.title, languages).length === 0) {
    issues.push({ blockId: null, message: "The lesson has no title.", blocking: false })
  }

  for (const block of lesson.blocks) {
    const name = BLOCKS[block.type].label
    if (block.type === "textImage" && block.image && !block.image.alt.trim()) {
      issues.push({ blockId: block.id, message: `${name}: the picture needs a description.`, blocking: true })
    }
    if (block.type === "gallery") {
      const empty = block.items.filter((item) => !item.image).length
      if (empty > 0) {
        issues.push({ blockId: block.id, message: `${name}: ${empty} picture slot${empty > 1 ? "s are" : " is"} empty.`, blocking: false })
      }
      const missing = block.items.filter((item) => item.image && !item.image.alt.trim()).length
      if (missing > 0) {
        issues.push({
          blockId: block.id,
          message: `${name}: ${missing} picture${missing > 1 ? "s need" : " needs"} a description.`,
          blocking: true,
        })
      }
    }
    if (block.type === "fillBlank") {
      const without = block.items.filter((item) => item.sentence.trim() && !hasBlank(item.sentence)).length
      if (without > 0) {
        issues.push({
          blockId: block.id,
          message: `${name}: ${without} sentence${without > 1 ? "s have" : " has"} no [answer] in brackets.`,
          blocking: false,
        })
      }
    }
  }
  return issues
}
