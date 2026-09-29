import type { ComponentPropsWithoutRef } from "react"

import { dirOf, getLanguage } from "@/lib/lesson/languages"

type Tag = "span" | "p" | "div" | "h1" | "h2" | "h3" | "li" | "strong" | "td" | "figcaption" | "blockquote"

/**
 * Lesson text. Every text node on a slide or handout goes through this so it carries `lang`
 * (screen-reader voice, font fallback, hyphenation) and `dir` (Arabic, Hebrew, Persian).
 * DS §10, CLAUDE.md "Frontend conventions".
 */
export function L<T extends Tag = "span">({
  tag,
  as,
  ...rest
}: { tag: string; as?: T } & ComponentPropsWithoutRef<T>) {
  const As = (as ?? "span") as Tag
  return <As lang={tag} dir={dirOf(tag)} {...(rest as ComponentPropsWithoutRef<"span">)} />
}

/** The mono language code that labels a gloss ("EN comment"). Colour is never the only signal. */
export function LangCode({ tag, className = "lang-code" }: { tag: string; className?: string }) {
  const language = getLanguage(tag)
  return (
    <abbr className={className} title={language.name} style={{ textDecoration: "none" }}>
      {language.code}
    </abbr>
  )
}
