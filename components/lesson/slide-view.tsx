/* eslint-disable @next/next/no-img-element -- lesson images are the teacher's data URLs. */
import type { ReactNode } from "react"

import { KIND_LABEL } from "@/lib/lesson/blocks"
import { parseFillSentence, wordBankFor } from "@/lib/lesson/fill-blank"
import { dirOf, getLanguage } from "@/lib/lesson/languages"
import type { Slide } from "@/lib/lesson/paginate"
import { label } from "@/lib/lesson/phrases"
import { lessonLanguages, type Lesson, type LessonImage, type Localized } from "@/lib/lesson/schema"
import { lessonShortTitle, lines, t } from "@/lib/lesson/text"

import { DoveMark, FlightPath, Postmark, Stamp, formatDate } from "./devices"
import { L, LangCode } from "./lang"

type Props = { lesson: Lesson; slide: Slide; index: number; total: number }

/**
 * One slide on the 1920 × 1080 canvas (DS §8–9). Pure: no hooks, no client code, so the studio,
 * /print/slides and /brand all render exactly this.
 */
export function SlideView({ lesson, slide, index, total }: Props) {
  const languages = lessonLanguages(lesson)
  const bare = slide.template === "cover"

  return (
    <article
      className="slide"
      data-theme={lesson.theme}
      data-kind={slide.kind}
      data-template={slide.template}
      data-index={index}
      aria-label={`Slide ${index + 1} of ${total}`}
      aria-roledescription="slide"
    >
      <div className="s-inner" style={bare ? { gridTemplateRows: "1fr" } : undefined}>
        {bare ? (
          <Cover lesson={lesson} languages={languages} />
        ) : (
          <>
            <header className="s-header">
              <Stamp target={lesson.target} level={lesson.level} />
              <span className="s-kind">{KIND_LABEL[slide.kind]}</span>
              {slide.template === "dialogue" && slide.language !== lesson.target ? (
                <span className="translation-badge">
                  {label(slide.language, "translation")} · {getLanguage(slide.language).code}
                </span>
              ) : null}
              <span className="s-header-title">{lessonShortTitle(lesson)}</span>
            </header>
            <Heading slide={slide} languages={languages} />
            <div className="s-body">
              <Body lesson={lesson} slide={slide} languages={languages} />
            </div>
            <footer className="s-footer">
              <DoveMark />
              <span className="s-brand">The Dove Language</span>
              <FlightPath index={index} total={total} />
              <span className="s-page">
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
            </footer>
          </>
        )}
      </div>
    </article>
  )
}

function Heading({ slide, languages }: { slide: Slide; languages: string[] }) {
  // Break and closing carry their own big title.
  if (slide.template === "break" || slide.template === "closing") return <div />

  const headingLanguages =
    slide.template === "dialogue" ? [slide.language, ...languages.filter((l) => l !== slide.language)] : languages
  const [primary, ...rest] = lines(slide.heading ?? {}, headingLanguages)
  const cont = slide.cont ? ` (${label(primary?.tag ?? languages[0], "cont")})` : ""

  return (
    <div className="s-heading">
      <span className="s-section" aria-hidden={slide.section ? undefined : true}>
        {slide.section ? String(slide.section).padStart(2, "0") : ""}
      </span>
      <div>
        {primary ? (
          <L tag={primary.tag} as="h2" className="s-title">
            {primary.text}
            {cont ? <span className="s-cont">{cont}</span> : null}
          </L>
        ) : (
          <h2 className="s-title">&nbsp;</h2>
        )}
      </div>
      {rest.length > 0 ? (
        <p className="s-title-gloss">
          {rest.map((line, i) => (
            <L key={line.tag} tag={line.tag}>
              {i > 0 ? " · " : ""}
              {line.text}
            </L>
          ))}
        </p>
      ) : null}
    </div>
  )
}

function Cover({ lesson, languages }: { lesson: Lesson; languages: string[] }) {
  const [primary, ...rest] = lines(lesson.title, languages)
  const { number, date, host } = lesson.session

  return (
    <div className="cover">
      <svg className="cover-arc" viewBox="0 0 1920 1080" preserveAspectRatio="none" aria-hidden="true">
        <path d="M -40 1000 C 420 1040, 700 760, 1060 700 S 1700 620, 1980 120" />
        <circle cx="1060" cy="700" r="10" />
      </svg>
      <div className="cover-top">
        <DoveMark className="s-mark" />
        <span className="cover-brand">The Dove Language</span>
        <span style={{ marginInlineStart: "auto" }}>
          <Stamp target={lesson.target} level={lesson.level} />
        </span>
      </div>
      <div className="cover-title-wrap">
        <L tag={primary?.tag ?? lesson.target} as="h1" className="cover-title">
          {primary?.text || "Untitled lesson"}
        </L>
        {rest.map((line) => (
          <L key={line.tag} tag={line.tag} as="p" className="cover-gloss">
            {line.text}
          </L>
        ))}
      </div>
      <div className="cover-side">
        <Postmark number={number} date={date} />
      </div>
      <div className="cover-meta">
        <span>
          Language
          <strong>{getLanguage(lesson.target).name}</strong>
        </span>
        <span>
          Level
          <strong>{lesson.level}</strong>
        </span>
        {host ? (
          <span>
            Host
            <strong>{host}</strong>
          </span>
        ) : null}
        {date ? (
          <span>
            Date
            <strong>{formatDate(date)}</strong>
          </span>
        ) : null}
      </div>
    </div>
  )
}

function Body({ lesson, slide, languages }: { lesson: Lesson; slide: Slide; languages: string[] }) {
  const glossTags = languages.slice(1)

  switch (slide.template) {
    case "cover":
      return null

    case "objectives":
      return (
        <Columns count={slide.languages.length}>
          {slide.languages.map((tag) => (
            <div key={tag}>
              {slide.languages.length > 1 ? <LangCode tag={tag} className="col-code" /> : null}
              {t(slide.block.topic, tag) ? (
                <L tag={tag} as="p" className="topic">
                  <L tag={tag} className="topic-label">
                    {label(tag, "topic")}
                  </L>
                  {t(slide.block.topic, tag)}
                </L>
              ) : null}
              <L tag={tag} as="p" className="para">
                {t(slide.block.text, tag)}
              </L>
            </div>
          ))}
        </Columns>
      )

    case "note":
      return (
        <Columns count={slide.languages.length}>
          {slide.languages.map((tag) => (
            <div key={tag}>
              {slide.languages.length > 1 ? <LangCode tag={tag} className="col-code" /> : null}
              <L tag={tag} as="p" className="para">
                {t(slide.block.text, tag)}
              </L>
            </div>
          ))}
        </Columns>
      )

    case "prompt": {
      const [question, ...glosses] = lines(slide.block.question, languages)
      const details = lines(slide.block.detail, languages)
      return (
        <div className="prompt">
          {question ? (
            <L tag={question.tag} as="p" className="prompt-q">
              {question.text}
            </L>
          ) : null}
          {glosses.map((line) => (
            <L key={line.tag} tag={line.tag} as="p" className="prompt-gloss">
              {line.text}
            </L>
          ))}
          {details.length > 0 ? (
            <div className="prompt-detail">
              {details.map((line, i) => (
                <L key={line.tag} tag={line.tag} as="p" style={i > 0 ? { color: "var(--s-soft)" } : undefined}>
                  {line.text}
                </L>
              ))}
            </div>
          ) : null}
        </div>
      )
    }

    case "vocabulary":
      return (
        <ul className="vocab" data-count={slide.items.length}>
          {slide.items.map((item) => (
            <li key={item.id} className="vocab-item">
              <L tag={lesson.target} className="vocab-term">
                {item.term}
              </L>
              {item.note ? (
                <L tag={lesson.target} className="vocab-note">
                  {item.note}
                </L>
              ) : null}
              <Glosses value={item.glosses} tags={glossTags} />
            </li>
          ))}
        </ul>
      )

    case "examples":
      return (
        <ul className="examples">
          {slide.items.map((item) => (
            <li key={item.id} className="example">
              <L tag={lesson.target} as="p" className="example-text">
                {item.text}
              </L>
              <Glosses value={item.glosses} tags={glossTags} stacked />
            </li>
          ))}
        </ul>
      )

    case "spotlight": {
      const b = slide.block
      const example = b.example.trim()
      return (
        <div className="spotlight">
          <div>
            <L tag={lesson.target} as="p" className="spotlight-term">
              {b.term}
            </L>
            {lines(b.meaning, languages).map((line) => (
              <p key={line.tag} className="spotlight-meaning">
                <LangCode tag={line.tag} /> <L tag={line.tag}>{line.text}</L>
              </p>
            ))}
          </div>
          <div>
            {example ? (
              <div className="card">
                <L tag={lesson.target} as="p" className="example-text">
                  {example}
                </L>
                <Glosses value={b.exampleGlosses} tags={glossTags} stacked />
              </div>
            ) : null}
            {lines(b.note, languages).map((line) => (
              <L key={line.tag} tag={line.tag} as="p" className="note-tab">
                {line.text}
              </L>
            ))}
          </div>
        </div>
      )
    }

    case "abbreviations":
      return (
        <div className="abbr" role="list">
          {slide.items.map((item) => (
            <div key={item.id} role="listitem" style={{ display: "contents" }}>
              <L tag={lesson.target} className="abbr-short">
                {item.short}
              </L>
              <L tag={lesson.target} className="abbr-full">
                {item.full}
              </L>
              <span className="abbr-meaning">
                {lines(item.meaning, glossTags).map((line, i) => (
                  <L key={line.tag} tag={line.tag}>
                    {i > 0 ? " · " : ""}
                    {line.text}
                  </L>
                ))}
              </span>
            </div>
          ))}
        </div>
      )

    case "textImage": {
      const b = slide.block
      const [sub, ...subGlosses] = lines(b.subheading, languages)
      return (
        <div className="text-image" data-side={b.imageSide} data-has-image={b.image ? "true" : "false"}>
          <div>
            {sub ? (
              <L tag={sub.tag} as="h3" className="sub">
                {sub.text}
                {subGlosses.map((line) => (
                  <L key={line.tag} tag={line.tag} className="sub-gloss">
                    {line.text}
                  </L>
                ))}
              </L>
            ) : null}
            {lines(b.text, languages).map((line) => (
              <L key={line.tag} tag={line.tag} as="p" className="para">
                {line.text}
              </L>
            ))}
          </div>
          {b.image ? (
            <div className="text-image-media">
              <Framed image={b.image} />
            </div>
          ) : null}
        </div>
      )
    }

    case "gallery":
      if (slide.items.length === 0) return <div className="empty-media">Add pictures to this gallery</div>
      return (
        <div className="gallery" data-count={slide.items.length}>
          {slide.items.map((item) => {
            const caption = lines(item.caption, languages)
            return (
              <figure key={item.id}>
                {item.image ? <Framed image={item.image} /> : <div className="empty-media">Picture missing</div>}
                {caption.length > 0 ? (
                  <figcaption>
                    {caption.map((line, i) => (
                      <L
                        key={line.tag}
                        tag={line.tag}
                        style={{ display: "block", color: i > 0 ? "var(--s-soft)" : undefined }}
                      >
                        {line.text}
                      </L>
                    ))}
                  </figcaption>
                ) : null}
              </figure>
            )
          })}
        </div>
      )

    case "break": {
      const [title, ...glosses] = lines(slide.block.title, languages)
      return (
        <div className="break">
          <L tag={title?.tag ?? lesson.target} as="h2" className="break-title">
            {title?.text ?? ""}
          </L>
          {glosses.map((line) => (
            <L key={line.tag} tag={line.tag} as="p" className="break-gloss">
              {line.text}
            </L>
          ))}
        </div>
      )
    }

    case "fillBlank": {
      const b = slide.block
      const bank = wordBankFor(
        b.items.map((i) => i.sentence),
        b.wordBank,
      )
      const instructions = lines(b.instructions, languages)
      return (
        <div className="fill">
          <div>
            {instructions.length > 0 && !slide.answers ? (
              <p className="fill-instructions">
                {instructions.map((line, i) => (
                  <L key={line.tag} tag={line.tag}>
                    {i > 0 ? " · " : ""}
                    {line.text}
                  </L>
                ))}
              </p>
            ) : null}
            {slide.answers ? (
              <p className="fill-instructions">
                <L tag={lesson.target}>{label(lesson.target, "answerKey")}</L>
                {glossTags.slice(0, 1).map((tag) => (
                  <L key={tag} tag={tag}>
                    {" · "}
                    {label(tag, "answerKey")}
                  </L>
                ))}
              </p>
            ) : null}
            <ol
              className="fill-list"
              lang={lesson.target}
              dir={dirOf(lesson.target)}
              start={slide.start}
              style={{ "--start": slide.start - 1 } as React.CSSProperties}
            >
              {slide.items.map((item) => (
                <li key={item.id}>
                  <FillSentence sentence={item.sentence} answers={slide.answers} />
                </li>
              ))}
            </ol>
          </div>
          {bank.length > 0 && !slide.answers ? (
            <div className="bank">
              <span className="bank-label">
                {label(lesson.target, "words")}
                {glossTags[0] ? ` · ${label(glossTags[0], "words")}` : ""}
              </span>
              {bank.map((word) => (
                <L key={word} tag={lesson.target} className="chip">
                  {word}
                </L>
              ))}
            </div>
          ) : null}
        </div>
      )
    }

    case "dialogue": {
      const tag = slide.language
      const scene = t(slide.block.scene, tag) || t(slide.block.scene, lesson.target)
      return (
        <div>
          {scene ? (
            <L tag={tag} as="p" className="fill-instructions">
              {scene}
            </L>
          ) : null}
          <div className="dialogue" role="list">
            {slide.lines.map((line) => (
              <div key={line.id} role="listitem" style={{ display: "contents" }}>
                <span className="speaker">{line.speaker}</span>
                <L tag={tag} className="line">
                  {tag === lesson.target ? line.text : t(line.glosses, tag)}
                </L>
              </div>
            ))}
          </div>
        </div>
      )
    }

    case "closing": {
      const b = slide.block
      const [title, ...titleGlosses] = lines(b.title, languages)
      const steps = b.nextSteps
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
      return (
        <div className="closing">
          <div>
            <L tag={title?.tag ?? lesson.target} as="h2" className="closing-title">
              {title?.text ?? ""}
            </L>
            {titleGlosses.map((line) => (
              <L key={line.tag} tag={line.tag} as="p" className="break-gloss">
                {line.text}
              </L>
            ))}
            {lines(b.message, languages).map((line, i) => (
              <L
                key={line.tag}
                tag={line.tag}
                as="p"
                className="closing-message"
                style={i > 0 ? { color: "var(--s-soft)", marginTop: 0 } : undefined}
              >
                {line.text}
              </L>
            ))}
            {steps.length > 0 ? (
              <ul className="closing-steps">
                {steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            ) : null}
          </div>
          <Postmark number={lesson.session.number} date={lesson.session.date} />
        </div>
      )
    }
  }
}

function Columns({ count, children }: { count: number; children: ReactNode }) {
  return (
    <div className="columns" data-count={count}>
      {children}
    </div>
  )
}

function Glosses({ value, tags, stacked }: { value: Localized; tags: string[]; stacked?: boolean }) {
  const present = lines(value, tags)
  if (present.length === 0) return null
  return (
    <div className={stacked ? "glosses-stack" : "glosses"}>
      {present.map((line) => (
        <span key={line.tag}>
          <LangCode tag={line.tag} /> <L tag={line.tag}>{line.text}</L>
        </span>
      ))}
    </div>
  )
}

function Framed({ image }: { image: LessonImage }) {
  return (
    <div className="frame" style={{ height: "100%" }}>
      <img src={image.src} alt={image.alt} width={image.width} height={image.height} decoding="sync" />
    </div>
  )
}

export function FillSentence({ sentence, answers }: { sentence: string; answers: boolean }) {
  return (
    <span>
      {parseFillSentence(sentence).map((segment, i) =>
        segment.kind === "text" ? (
          <span key={i}>{segment.text}</span>
        ) : answers ? (
          <strong key={i} className="answer">
            {segment.answers.join(" / ")}
          </strong>
        ) : (
          <span key={i} className="blank" role="img" aria-label="blank" />
        ),
      )}
    </span>
  )
}
