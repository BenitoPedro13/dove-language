/* eslint-disable @next/next/no-img-element -- lesson images are the teacher's data URLs. */
import type { ReactNode } from "react"

import { BLOCKS, KIND_LABEL, type Kind } from "@/lib/lesson/blocks"
import { hasBlank, wordBankFor } from "@/lib/lesson/fill-blank"
import { dirOf, getLanguage } from "@/lib/lesson/languages"
import { label } from "@/lib/lesson/phrases"
import { lessonLanguages, type Block, type Lesson, type Localized } from "@/lib/lesson/schema"
import { lines, t } from "@/lib/lesson/text"

import { DoveMark, Stamp, formatDate } from "./devices"
import { L, LangCode } from "./lang"
import { FillSentence } from "./slide-view"

/**
 * The A4 study version (DS §8.3): same data as the slides, laid out for reading on a phone or on
 * paper. Pure — rendered by /print/handout and the studio's handout tab.
 */
export function Handout({ lesson }: { lesson: Lesson }) {
  const languages = lessonLanguages(lesson)
  const glossTags = languages.slice(1)
  const [title, ...titleGlosses] = lines(lesson.title, languages)
  const exercises = lesson.blocks.filter(
    (b): b is Extract<Block, { type: "fillBlank" }> =>
      b.type === "fillBlank" && b.items.some((i) => hasBlank(i.sentence)),
  )

  let section = 0
  return (
    <article className="handout" aria-label="Lesson handout">
      <header className="h-header">
        <div className="h-top">
          <DoveMark className="" />
          <span className="h-brand">The Dove Language</span>
          <span className="h-meta">
            <Stamp target={lesson.target} level={lesson.level} />
          </span>
        </div>
        <L tag={title?.tag ?? lesson.target} as="h1" className="h-title">
          {title?.text ?? "Untitled lesson"}
        </L>
        {titleGlosses.map((line) => (
          <L key={line.tag} tag={line.tag} as="p" className="h-title-gloss">
            {line.text}
          </L>
        ))}
        <p className="h-top" style={{ marginTop: 4 }}>
          <span>{getLanguage(lesson.target).name}</span>
          <span>· {lesson.level}</span>
          {lesson.session.number ? <span>· Session {lesson.session.number}</span> : null}
          {lesson.session.date ? <span>· {formatDate(lesson.session.date)}</span> : null}
          {lesson.session.host ? <span>· {lesson.session.host}</span> : null}
        </p>
      </header>

      {lesson.blocks.map((block) => {
        if (block.type === "break") return null
        const numbered = !["objectives", "closing", "fillBlank"].includes(block.type)
        const number = numbered ? ++section : null
        return (
          <HandoutSection
            key={block.id}
            number={number}
            kind={BLOCKS[block.type].kind}
            heading={"heading" in block ? block.heading : block.type === "closing" ? block.title : {}}
            languages={languages}
          >
            <HandoutBody block={block} target={lesson.target} languages={languages} glossTags={glossTags} />
          </HandoutSection>
        )
      })}

      {exercises.length > 0 ? (
        <section className="h-section h-answers">
          <h2 className="h-section-title">
            <L tag={lesson.target}>{label(lesson.target, "answerKey")}</L>
            {glossTags[0] ? (
              <L tag={glossTags[0]} className="h-gloss">
                {label(glossTags[0], "answerKey")}
              </L>
            ) : null}
          </h2>
          {exercises.map((block) => (
            <div key={block.id} style={{ marginBottom: "10pt" }}>
              <L tag={lesson.target} as="p" style={{ fontWeight: 700 }}>
                {t(block.heading, lesson.target) || lines(block.heading, languages)[0]?.text}
              </L>
              <ol className="h-list" lang={lesson.target} dir={dirOf(lesson.target)}>
                {block.items.map((item) => (
                  <li key={item.id}>
                    <FillSentence sentence={item.sentence} answers />
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </section>
      ) : null}

      <footer className="h-footer">
        <DoveMark className="" size={14} />
        <span>The Dove Language · free language sessions for everyone</span>
      </footer>
    </article>
  )
}

function HandoutSection({
  number,
  kind,
  heading,
  languages,
  children,
}: {
  number: number | null
  kind: Kind
  heading: Localized
  languages: string[]
  children: ReactNode
}) {
  const [primary, ...rest] = lines(heading, languages)
  return (
    <section className="h-section">
      <h2 className="h-section-title">
        {number ? <span className="h-num">{String(number).padStart(2, "0")}</span> : null}
        {primary ? <L tag={primary.tag}>{primary.text}</L> : null}
        {rest.slice(0, 1).map((line) => (
          <L key={line.tag} tag={line.tag} className="h-gloss">
            {line.text}
          </L>
        ))}
        <span className="h-kind" data-kind={kind}>
          {KIND_LABEL[kind]}
        </span>
      </h2>
      {children}
    </section>
  )
}

function Paras({ value, languages }: { value: Localized; languages: string[] }) {
  return (
    <>
      {lines(value, languages).map((line) => (
        <L key={line.tag} tag={line.tag} as="p" className="h-para">
          {line.text}
        </L>
      ))}
    </>
  )
}

function GlossLine({ value, tags }: { value: Localized; tags: string[] }) {
  return (
    <>
      {lines(value, tags).map((line) => (
        <span key={line.tag} className="h-gloss-text" style={{ display: "block" }}>
          <LangCode tag={line.tag} className="h-code" /> <L tag={line.tag}>{line.text}</L>
        </span>
      ))}
    </>
  )
}

function HandoutBody({
  block,
  target,
  languages,
  glossTags,
}: {
  block: Block
  target: string
  languages: string[]
  glossTags: string[]
}) {
  switch (block.type) {
    case "objectives":
      return (
        <>
          {lines(block.topic, languages).slice(0, 1).map((line) => (
            <L key={line.tag} tag={line.tag} as="p" style={{ fontWeight: 700 }}>
              {line.text}
            </L>
          ))}
          <Paras value={block.text} languages={languages} />
        </>
      )
    case "note":
      return <Paras value={block.text} languages={languages} />
    case "prompt":
      return (
        <>
          <Paras value={block.question} languages={languages} />
          <Paras value={block.detail} languages={languages} />
        </>
      )
    case "vocabulary":
      return (
        <table className="h-table">
          <thead>
            <tr>
              <th scope="col">{getLanguage(target).code}</th>
              {glossTags.map((tag) => (
                <th key={tag} scope="col">
                  {getLanguage(tag).code}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.items.map((item) => (
              <tr key={item.id}>
                <L tag={target} as="td">
                  {item.term}
                  {item.note ? <span className="h-gloss-text"> {item.note}</span> : null}
                </L>
                {glossTags.map((tag) => (
                  <L key={tag} tag={tag} as="td">
                    {t(item.glosses, tag)}
                  </L>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )
    case "examples":
      return (
        <ul className="h-list">
          {block.items.map((item) => (
            <li key={item.id}>
              <L tag={target} style={{ fontWeight: 700 }}>
                {item.text}
              </L>
              <GlossLine value={item.glosses} tags={glossTags} />
            </li>
          ))}
        </ul>
      )
    case "spotlight":
      return (
        <>
          <L tag={target} as="p" style={{ fontSize: "14pt", fontWeight: 700 }}>
            {block.term}
          </L>
          <GlossLine value={block.meaning} tags={languages} />
          {block.example ? (
            <p style={{ marginTop: "4pt" }}>
              <L tag={target} style={{ fontWeight: 700 }}>
                {block.example}
              </L>
              <GlossLine value={block.exampleGlosses} tags={glossTags} />
            </p>
          ) : null}
          <Paras value={block.note} languages={languages} />
        </>
      )
    case "abbreviations":
      return (
        <table className="h-table">
          <tbody>
            {block.items.map((item) => (
              <tr key={item.id}>
                <L tag={target} as="td" style={{ fontFamily: "var(--font-dove-mono)" }}>
                  {item.short}
                </L>
                <L tag={target} as="td" style={{ fontWeight: 400 }}>
                  {item.full}
                </L>
                <td>
                  <GlossLine value={item.meaning} tags={glossTags} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    case "textImage":
      return (
        <>
          {lines(block.subheading, languages).slice(0, 1).map((line) => (
            <L key={line.tag} tag={line.tag} as="p" style={{ fontWeight: 700 }}>
              {line.text}
            </L>
          ))}
          <Paras value={block.text} languages={languages} />
          {block.image ? (
            <div className="h-figure">
              <figure>
                <img src={block.image.src} alt={block.image.alt} />
              </figure>
            </div>
          ) : null}
        </>
      )
    case "gallery":
      return (
        <div className="h-figure">
          {block.items.map((item) =>
            item.image ? (
            <figure key={item.id}>
              <img src={item.image.src} alt={item.image.alt} />
              {lines(item.caption, languages).slice(0, 2).map((line) => (
                <L key={line.tag} tag={line.tag} as="figcaption">
                  {line.text}
                </L>
              ))}
            </figure>
            ) : null,
          )}
        </div>
      )
    case "fillBlank": {
      const bank = wordBankFor(
        block.items.map((i) => i.sentence),
        block.wordBank,
      )
      return (
        <>
          <Paras value={block.instructions} languages={languages.slice(0, 1)} />
          <ol className="h-list" lang={target} dir={dirOf(target)} style={{ marginTop: "6pt" }}>
            {block.items.map((item) => (
              <li key={item.id}>
                <FillSentence sentence={item.sentence} answers={false} />
              </li>
            ))}
          </ol>
          {bank.length > 0 ? (
            <div className="h-bank" lang={target}>
              {bank.map((word) => (
                <span key={word}>{word}</span>
              ))}
            </div>
          ) : null}
        </>
      )
    }
    case "dialogue":
      return (
        <>
          <Paras value={block.scene} languages={languages.slice(0, 1)} />
          <div className="h-dialogue" style={{ marginTop: "6pt" }}>
            {block.lines.map((line) => (
              <div key={line.id} style={{ display: "contents" }}>
                <span className="speaker">{line.speaker}</span>
                <span>
                  <L tag={target} style={{ display: "block" }}>
                    {line.text}
                  </L>
                  <GlossLine value={line.glosses} tags={glossTags} />
                </span>
              </div>
            ))}
          </div>
        </>
      )
    case "closing":
      return (
        <>
          <Paras value={block.message} languages={languages} />
          {block.nextSteps.trim() ? (
            <ul className="h-list" style={{ marginTop: "6pt" }}>
              {block.nextSteps
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean)
                .map((step) => (
                  <li key={step}>{step}</li>
                ))}
            </ul>
          ) : null}
        </>
      )
    case "break":
      return null
  }
}
