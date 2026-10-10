import type { Metadata } from "next"
import type { ReactNode } from "react"

import { Handout } from "@/components/lesson/handout"
import { SlideView } from "@/components/lesson/slide-view"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { readPalette } from "@/lib/brand-tokens"
import { contrast } from "@/lib/contrast"
import { BLOCKS } from "@/lib/lesson/blocks"
import { EXAMPLE_LESSON } from "@/lib/lesson/example"
import { paginate, type Slide } from "@/lib/lesson/paginate"

export const metadata: Metadata = {
  title: "Design system",
  description: "Airmail, the brand and design system for The Dove Language lesson material.",
}

const SWATCHES: { token: string; name: string; role: string }[] = [
  { token: "paper", name: "Paper", role: "The page. Light slides and handouts." },
  { token: "ink", name: "Ink", role: "Text. Globe Blue pushed almost to black." },
  { token: "globe", name: "Globe Blue", role: "The logo's continents. Primary brand colour, links, focus." },
  { token: "sky", name: "Dove Sky", role: "The dove's body. Soft blue surface, Learn tabs." },
  { token: "orange", name: "Dove Orange", role: "The globe. Shapes and fills only — never text on light." },
  { token: "ember", name: "Ember", role: "Orange that can be read as text on Paper." },
  { token: "note", name: "Note Yellow", role: "The banner's sticky note. Highlights, Culture tabs." },
  { token: "slate", name: "Slate", role: "Glosses, translations, meta." },
  { token: "night", name: "Night", role: "Dark theme for screen-share at night." },
]

const PAIRS: [string, string, string][] = [
  ["ink", "paper", "everything"],
  ["slate", "paper", "glosses, body text"],
  ["globe", "paper", "labels, links"],
  ["globe", "sky", "Learn tab"],
  ["ember", "paper", "readable orange"],
  ["culture-strong", "note", "Culture tab"],
  ["practice-strong", "practice-tint", "Practice tab"],
  ["talk-strong", "talk-tint", "Talk tab"],
  ["paper", "night", "Night theme text"],
  ["orange", "night", "orange accents at night"],
  ["orange", "paper", "never text"],
  ["white", "orange", "never"],
]

const TYPE: { name: string; family: string; className: string; sample: string; why: string }[] = [
  {
    name: "Display",
    family: "Bricolage Grotesque",
    className: "font-display text-4xl font-bold sm:text-5xl",
    sample: "Redes sociais e internet",
    why: "Titles. Friendly and a little hand-made, like the banner.",
  },
  {
    name: "Text",
    family: "Atkinson Hyperlegible Next",
    className: "text-2xl sm:text-3xl",
    sample: "Il1 rn m O0 — Compartilhar · Шрифт · 日本語 · العربية",
    why: "Terms and sentences. Similar letters stay different, so learners read new words correctly. Noto fills in every other script.",
  },
  {
    name: "Meta",
    family: "Atkinson Hyperlegible Mono",
    className: "font-mono text-xl tracking-wider uppercase",
    sample: "PT-BR · A1–A2 · 08 / 24",
    why: "Language codes, levels, numbers.",
  },
]

export default async function BrandPage() {
  const palette = await readPalette()
  const slides = paginate(EXAMPLE_LESSON)
  const night = { ...EXAMPLE_LESSON, theme: "night" as const }
  const pick = (template: Slide["template"]) => slides.findIndex((s) => s.template === template)
  const nightPicks = ["cover", "vocabulary", "spotlight", "dialogue"].map((t) => pick(t as Slide["template"]))

  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">
        <section className="py-12 sm:py-16">
          <p className="font-mono text-sm tracking-wider text-globe uppercase">Airmail 0.1 · proposal</p>
          <h1 className="mt-3 max-w-4xl font-display text-4xl leading-[1.05] font-bold text-balance sm:text-6xl">
            Every lesson is a letter between two languages.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate">
            A dove is a messenger. Dove&apos;s own art already shows it: dashed flight paths on the banner, a letter
            in the Server Guide, a bird crossing the globe. This system turns that into four quiet devices and a
            set of slide templates, so every teacher&apos;s lesson looks like it came from the same place.
          </p>
          <nav aria-label="On this page" className="mt-8 flex flex-wrap gap-2 text-sm">
            {[
              ["#principles", "Principles"],
              ["#colour", "Colour"],
              ["#type", "Type"],
              ["#devices", "Devices"],
              ["#templates", "Slide templates"],
              ["#night", "Night theme"],
              ["#handout", "Handout"],
            ].map(([href, text]) => (
              <a
                key={href}
                href={href}
                className="inline-flex min-h-11 items-center rounded-full border border-rule bg-white px-4 hover:border-globe"
              >
                {text}
              </a>
            ))}
          </nav>
        </section>

        <Section id="principles" title="Principles">
          <ol className="grid gap-4 sm:grid-cols-2">
            {[
              ["Calm over loud", "The server promises “a calm environment to learn”. No chalkboards, no stock 3D people, one accent per region."],
              ["The word first", "What students must learn is always the heaviest thing on a slide. Translations are lighter, smaller and labelled."],
              ["Every language is a guest", "Arabic reads right to left, Japanese has no spaces. Languages are named with a code, never shown as a flag."],
              ["Volunteers don't design", "Teachers type content. The system does the layout. If someone has to nudge a box, a rule is missing."],
            ].map(([title, body], i) => (
              <li key={title} className="rounded-xl border border-rule bg-white p-6">
                <span className="font-mono text-sm text-globe">0{i + 1}</span>
                <h3 className="mt-2 font-display text-2xl font-bold">{title}</h3>
                <p className="mt-2 text-slate">{body}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="colour" title="Colour" lede="Sampled from the logo, then adjusted only where text needed more contrast. Values are read live from the token file.">
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {SWATCHES.map((swatch) => (
              <li key={swatch.token} className="overflow-hidden rounded-xl border border-rule bg-white">
                <div className="h-24" style={{ background: `var(--dove-${swatch.token})` }} />
                <div className="p-4">
                  <p className="font-display text-lg font-bold">{swatch.name}</p>
                  <p className="font-mono text-sm text-slate">
                    {palette[swatch.token]} · --dove-{swatch.token}
                  </p>
                  <p className="mt-2 text-sm">{swatch.role}</p>
                </div>
              </li>
            ))}
          </ul>

          <h3 className="mt-12 font-display text-2xl font-bold">Measured contrast</h3>
          <p className="mt-2 max-w-2xl text-slate">
            WCAG 2.2 AA: 4.5 for body text, 3.0 for large text. Computed from the tokens on every build.
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-rule bg-white">
            <table className="w-full min-w-[36rem] text-start text-sm">
              <thead className="bg-paper-deep font-mono text-xs tracking-wider uppercase">
                <tr>
                  <th scope="col" className="p-3 text-start">Sample</th>
                  <th scope="col" className="p-3 text-start">Pair</th>
                  <th scope="col" className="p-3 text-start">Ratio</th>
                  <th scope="col" className="p-3 text-start">Use for</th>
                </tr>
              </thead>
              <tbody>
                {PAIRS.map(([fg, bg, use]) => {
                  const ratio = contrast(palette[fg] ?? "#000000", palette[bg] ?? "#FFFFFF")
                  const pass = ratio >= 4.5
                  return (
                    <tr key={`${fg}-${bg}`} className="border-t border-rule">
                      <td className="p-3">
                        <span
                          className="inline-block rounded-md px-3 py-1 font-bold"
                          style={{ color: `var(--dove-${fg})`, background: `var(--dove-${bg})` }}
                        >
                          Aa
                        </span>
                      </td>
                      <td className="p-3 font-mono">
                        {fg} on {bg}
                      </td>
                      <td className="p-3 font-mono font-bold">
                        {ratio.toFixed(2)} {pass ? "✓ AA" : "✗"}
                      </td>
                      <td className="p-3">{use}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <h3 className="mt-12 font-display text-2xl font-bold">Wayfinding</h3>
          <p className="mt-2 max-w-2xl text-slate">
            The Server Guide already colours its four cards green, blue, yellow and red. Lessons reuse that: every
            slide says what kind of moment it is, with a word — colour is never the only signal.
          </p>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(
              [
                ["learn", "Learn", "vocabulary, examples, spotlight, abbreviations"],
                ["culture", "Culture", "cultural note, text and image, gallery"],
                ["practice", "Practice", "exercises, answer key, break"],
                ["talk", "Talk", "dialogue, discussion question"],
              ] as const
            ).map(([kind, name, used]) => (
              <li
                key={kind}
                className="rounded-xl p-5"
                style={{ background: `var(--dove-${kind}-tint)`, color: `var(--dove-${kind}-strong)` }}
              >
                <p className="font-mono text-sm font-medium tracking-wider uppercase">{name}</p>
                <p className="mt-2 text-sm text-ink">{used}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="type" title="Type" lede="Chosen for people reading a language they are still learning.">
          <ul className="grid gap-4">
            {TYPE.map((row) => (
              <li key={row.name} className="grid gap-4 rounded-xl border border-rule bg-white p-6 md:grid-cols-[14rem_1fr]">
                <div>
                  <p className="font-mono text-sm tracking-wider text-globe uppercase">{row.name}</p>
                  <p className="mt-1 font-bold">{row.family}</p>
                  <p className="mt-2 text-sm text-slate">{row.why}</p>
                </div>
                <p className={`${row.className} min-w-0 break-words`}>{row.sample}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="devices" title="Devices" lede="Four devices, each with one job. If a slide needs a fifth thing to look finished, the template is wrong.">
          <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
            <SlideFigure slides={slides} index={0} caption="Cover: the flight path crosses the page; stamp top right." />
            <dl className="grid content-start gap-4">
              {[
                ["Flight path", "Progress. A dashed line along the foot of every slide; the orange dot is where you are."],
                ["Stamp", "Which language, which level. Perforated edge, top left of every slide."],
                ["Postmark", "Which session, when. Only on the cover and the closing slide."],
                ["Paper", "The room. Warm Paper by day, Night for screen-share in the dark. No textures."],
              ].map(([term, detail]) => (
                <div key={term} className="rounded-xl border border-rule bg-white p-5">
                  <dt className="font-display text-xl font-bold">{term}</dt>
                  <dd className="mt-1 text-slate">{detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Section>

        <Section
          id="templates"
          title="Slide templates"
          lede="The example is a real Dove session, re-typed into the studio. Every slide below is generated — nobody placed a box by hand."
        >
          <ul className="grid gap-6 md:grid-cols-2">
            {slides.map((slide, index) => (
              <li key={slide.key}>
                <SlideFigure
                  slides={slides}
                  index={index}
                  caption={`${index + 1}. ${slide.template === "cover" ? "Cover" : BLOCKS[slide.template === "fillBlank" && slide.answers ? "fillBlank" : slide.template].label}${slide.template === "fillBlank" && slide.answers ? " — answer key" : ""}${slide.template === "dialogue" && slide.language !== EXAMPLE_LESSON.target ? ` — ${slide.language.toUpperCase()} translation` : ""}`}
                />
              </li>
            ))}
          </ul>
        </Section>

        <Section id="night" title="Night theme" lede="Discord is mostly used in dark mode, often at night. A lesson can switch to Night with one toggle; the tokens do the rest.">
          <ul className="grid gap-6 md:grid-cols-2">
            {nightPicks.map((index) => (
              <li key={index} className="overflow-hidden rounded-xl shadow-sm ring-1 ring-rule">
                <SlideView lesson={night} slide={slides[index]} index={index} total={slides.length} />
              </li>
            ))}
          </ul>
        </Section>

        <Section id="handout" title="Handout" lede="Same lesson, A4, for students who download it later on a phone. Vocabulary becomes a table; dialogues show the translation under each line; answers go on the last page.">
          <div className="max-h-[48rem] overflow-auto rounded-xl border border-rule bg-white p-6 sm:p-10">
            <Handout lesson={EXAMPLE_LESSON} />
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  )
}

function Section({ id, title, lede, children }: { id: string; title: string; lede?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-6 border-t border-rule py-12 sm:py-16">
      <h2 id={`${id}-title`} className="font-display text-3xl font-bold sm:text-4xl">
        {title}
      </h2>
      {lede ? <p className="mt-3 max-w-2xl text-lg text-slate">{lede}</p> : null}
      <div className="mt-8">{children}</div>
    </section>
  )
}

function SlideFigure({ slides, index, caption }: { slides: Slide[]; index: number; caption: string }) {
  return (
    <figure className="m-0">
      <div className="overflow-hidden rounded-xl shadow-sm ring-1 ring-rule">
        <SlideView lesson={EXAMPLE_LESSON} slide={slides[index]} index={index} total={slides.length} />
      </div>
      <figcaption className="mt-2 font-mono text-sm text-slate">{caption}</figcaption>
    </figure>
  )
}
