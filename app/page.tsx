import { SlideView } from "@/components/lesson/slide-view"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { StartPanel } from "@/components/studio/start-panel"
import { EXAMPLE_LESSON } from "@/lib/lesson/example"
import { paginate } from "@/lib/lesson/paginate"

const STEPS = [
  ["Type", "Words, sentences, dialogues — in your language and the translations. No boxes to move."],
  ["Check", "Every slide appears as you type, in Dove's colours, with the level and progress on it."],
  ["Share", "Save slides for the session and a short handout for #lesson-resources."],
]

export default function Home() {
  const slides = paginate(EXAMPLE_LESSON)
  const cover = 0
  const vocab = slides.findIndex((s) => s.template === "vocabulary")

  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">
        <section className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="font-mono text-sm tracking-wider text-globe uppercase">For Dove Teachers and Reading Hosts</p>
            <h1 className="mt-3 font-display text-4xl leading-[1.05] font-bold text-balance sm:text-6xl">
              Make your lesson. We&apos;ll make it look like Dove.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate">
              Type the content of your session and get finished slides for the Dove Classroom and a study handout for
              your students. Free, like the sessions. Nothing you type leaves your computer.
            </p>
          </div>
          <div className="relative mb-16" aria-hidden="true">
            <div className="overflow-hidden rounded-xl shadow-md ring-1 ring-rule">
              <SlideView lesson={EXAMPLE_LESSON} slide={slides[cover]} index={cover} total={slides.length} />
            </div>
            <div className="absolute -end-4 -bottom-16 hidden w-1/2 overflow-hidden rounded-xl shadow-lg ring-1 ring-rule sm:block">
              <SlideView lesson={EXAMPLE_LESSON} slide={slides[vocab]} index={vocab} total={slides.length} />
            </div>
          </div>
        </section>

        <ol className="mb-14 grid gap-4 sm:grid-cols-3">
          {STEPS.map(([title, body], i) => (
            <li key={title} className="border-t-2 border-dashed border-rule pt-4">
              <span className="font-mono text-sm text-globe">0{i + 1}</span>
              <h2 className="font-display text-xl font-bold">{title}</h2>
              <p className="mt-1 text-slate">{body}</p>
            </li>
          ))}
        </ol>

        <StartPanel />
      </main>
      <SiteFooter />
    </>
  )
}
