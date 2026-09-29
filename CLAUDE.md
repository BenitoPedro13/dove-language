@AGENTS.md

# Workflow Guidelines — The Dove Language (Lesson Studio + design system)

> Ported from the `outubro` workflow (plan before you touch anything, lean on existing tooling
> while you work, treat documentation as part of the deliverable when you finish), retargeted to
> this project.

---

## 0. Project context

**The Dove Language** is a free, volunteer-run Discord community for language learning
(~4,600 members, est. Jan 2024). Teachers host live "Language Sessions" in the *Dove
Classroom* voice channel, screen-share a slide deck, and upload the PDF to
`📂・lesson-resources`. Read `docs/research.md` first.

**This repo is two things:**

1. **The brand and design system, "Airmail"** — `docs/brand-and-design-system.md`. Derived
   from the existing logo (orange globe, Globe-Blue continents, pale dove), not a rebrand.
   *Every lesson is a letter between two languages*: flight path, stamp, postmark, paper.
2. **The Lesson Studio** — a web tool where a teacher types structured lesson content and gets
   a branded 16:9 slide deck and an A4 study handout as PDFs. `docs/architecture.md`.

**Status (2026-09-28):** Airmail 0.1 proposed (not yet reviewed by Dove staff); Studio v1 built
per `docs/tasks/TASK-foundation.md`. Logo is a raster placeholder until the Dove Designer sends
the vector (research §6 Q1).

### The one thing to keep in mind while building

**Teachers are volunteers.** Every decision is judged by, in order: (1) is it faster than making
the deck in Canva, (2) can a student read it — on a compressed Discord screen-share and later
on a phone, in *any* script, and (3) does it look unmistakably like Dove. A beautiful option that
costs teachers time has failed the brief.

### Stack (see `docs/architecture.md` §6 for versions and rationale)

| Layer | Choice |
|---|---|
| App | Next.js 16 App Router, React 19, TypeScript — **no backend, no accounts in v1** |
| Styling | Tailwind v4 + `app/lesson.css` (slide/handout layer, container units) |
| UI | shadcn (`radix-nova`, Radix base, RTL-aware), lucide-react only |
| Data | zod schema in `lib/lesson/schema.ts` is the single source of the lesson shape |
| Storage | IndexedDB via idb-keyval (drafts) + `.dove.json` files (sharing/backup) |
| PDF | the browser's print engine on `/print/slides` and `/print/handout` |
| Fonts | Bricolage Grotesque (display), Atkinson Hyperlegible Next + Mono (text/meta), Noto Sans family as lazy script fallbacks |
| Hosting | Vercel (static) |

### Frontend conventions

Follow the global `~/.claude/CLAUDE.md` Frontend section as written. Project specifics:

- **Renderers are pure.** `components/lesson/*` have no hooks and no `'use client'`, so `/brand`
  renders them on the server and the studio on the client. Keep it that way.
- **Pagination rules live only in `lib/lesson/paginate.ts`.** A component never decides how many
  items fit on a slide.
- **One `useReducer`** owns the lesson in the studio (`hooks/use-lesson-editor.ts`); the preview
  receives props. Zustand/TanStack Query are not needed until there is every-tick or server
  state — don't add them preemptively.
- **Every text node on a slide carries `lang`** (and `dir` for RTL). Use the `<L>` helper in
  `components/lesson/lang.tsx`; never render lesson text without it.
- **No raw hex outside `app/globals.css`.** Slides use `--dove-*` / `--k-*` variables.
- **Sizes on slides are `calc(N * var(--u))`** on the 1920 canvas — never px, rem or
  `transform: scale()`.

### How to write in this repo

- **Never invent** an API, a component prop, a hex value, a member count, a teacher's name or a
  session date. Write `[VERIFY: what and where]` instead and resolve it before shipping.
- **Quote the community, don't paraphrase it** (research §1 has the source lines).
- UI copy is plain English at about CEFR B1 (DS §2) — users are language learners.
- **Lesson content is the teacher's.** The example lesson is a transcription of a real session
  (research §2) with factual language errors fixed; don't "improve" teachers' pedagogy.

## 1. Plan before executing — write a task document first

Before editing or creating **any** code file, write `docs/tasks/TASK-<slug>.md` with:
**Current scenario · Planned changes · Why · Affected files (table) · Verification (measurable)
· Out of scope.** Summarize it in 2–3 lines and wait for alignment on anything non-trivial. Keep
it in sync if the plan changes.

## 2. Use CLIs and generators — don't hand-write what a tool generates

- Check each tool's current docs before adding it. For Next.js, read
  `node_modules/next/dist/docs/` first (`AGENTS.md`).
- shadcn components via `pnpm dlx shadcn@latest add <name>`; vendored files in `components/ui/`
  are never edited — restyle through tokens or `className`.
- New slide layouts are added to DS §9 **before** they are built.

## 3. Update documentation after executing

A task is not done until every affected doc is updated: `CLAUDE.md` (stack/conventions),
`docs/brand-and-design-system.md` (tokens, templates — update the section, don't append),
`docs/architecture.md`, `docs/research.md` (answered questions, with date and who),
`docs/teacher-guide.md` (anything a teacher sees), `README.md` (status line). Grep `docs/` for
names you changed.

## 4. Project conventions

```
app/                 routes + globals.css (tokens) + lesson.css (slide/handout layer)
components/ui/       shadcn, vendored
components/lesson/   pure renderers (slides, handout, devices)
components/studio/   editor composites (client)
components/brand/    /brand page pieces
lib/lesson/          schema, languages, blocks, paginate, fill-blank, example
hooks/               every hook, named — components never call useReducer/IndexedDB inline
docs/                research · brand-and-design-system · architecture · teacher-guide · tasks/
```

After implementation run `pnpm typecheck && pnpm lint && pnpm build` and `git diff --check`;
check 375 / 768 / 1440 px, keyboard-only flow, an RTL lesson, and print output.

### 4.1 Commits

- Commit once a task doc's work is complete and verified. No destructive git without asking.
- **Never add a `Co-Authored-By` trailer.**

## TL;DR

research → brand-and-design-system → architecture → task doc → build with official CLIs →
update docs → commit (no trailer). Never broken: WCAG 2.2 AA pairs from DS §4.3 only, `lang`
on every lesson text node, no flags as language markers, no hex outside `globals.css`, one
renderer shared by preview/print/brand, nothing leaves the teacher's browser.
