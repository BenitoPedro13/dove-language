# Architecture — Dove Lesson Studio

> How the tool that generates Dove's lesson material is built. Brand/visual rules are in
> `docs/brand-and-design-system.md` (cited **DS §n**); background in `docs/research.md` (**R §n**).

## 1. Routes

| Route | Rendering | Purpose |
|---|---|---|
| `/` | Server Component + one client leaf (draft list) | what the tool is; start a lesson, open a file, resume a draft |
| `/studio?id=…` | client (editor), slide renderers shared | edit a lesson with a live preview |
| `/print/slides?id=…` | client | the full deck at 1920 × 1080 px pages → browser "Save as PDF" |
| `/print/handout?id=…` | client | the A4 study version of the same lesson |
| `/brand` | Server Component | the living design system: tokens, type, devices, every slide template rendered from the example lesson |

The studio and print routes are client-only because the lesson lives in the browser (§3).
Slide and handout renderers (`components/lesson/`) are **pure components with no hooks and no
`'use client'`**, so `/brand` renders them on the server and the studio renders the same code on
the client. One renderer, three consumers.

## 2. The lesson is data

Everything starts from one schema, `lib/lesson/schema.ts` (zod). TypeScript types are *inferred*
from it, never written twice. It is also what validates an imported `.dove.json` file.

```
Lesson
├─ version: 1
├─ id, updatedAt
├─ target: LangCode            e.g. "pt-BR" — the language being taught
├─ glosses: LangCode[]         0–2 support languages, e.g. ["en", "es"]
├─ level: CEFR label           "A1–A2", "B1", "All levels"
├─ title: Localized            { "pt-BR": "Redes sociais e internet", en: "Social media & the internet", es: … }
├─ session: { number?, date?, host? }
├─ theme: "paper" | "night"
└─ blocks: Block[]             ordered; each has id + type (DS §9)
```

`Localized` is a map keyed by the lesson's languages. Changing `glosses` never deletes
text — unused keys are kept so switching back restores them; renderers only read the active
languages.

Block types (DS §9): `objectives`, `prompt`, `note`, `vocabulary`, `examples`, `spotlight`,
`abbreviations`, `textImage`, `gallery`, `break`, `fillBlank`, `dialogue`, `closing`. The cover
and the answer key are **derived**, not blocks: the cover comes from lesson settings, the answer
key from each `fillBlank` (answers are marked inline, `Eu vou [postar] uma foto`, alternatives
with `/`: `[postar/curtir]`).

### 2.1 From data to pages

```
Lesson ──paginate()──▶ Slide[] ──<SlideView/>──▶ preview / /print/slides / /brand
   │
   └────────────────────────────▶ <Handout/> ──▶ /print/handout
```

`lib/lesson/paginate.ts` is a pure function: it splits blocks by the per-slide limits in DS §9,
numbers sections, adds "(cont.)" titles, emits the cover first, one slide per gloss language for
dialogues, and the answer-key slide after each exercise. It is the one place those rules live.

## 3. Storage: the browser, then a file

**Decision (R §5): no backend, no accounts in v1.**

- Drafts are saved automatically to **IndexedDB** (`idb-keyval`), keyed `lesson:<id>`, on the
  teacher's device. IndexedDB, not `localStorage`: images make lessons larger than
  `localStorage`'s ~5 MB.
- **Export** writes a `.dove.json` file (images embedded as WebP data URLs). That file is how a
  lesson is backed up, handed to a co-teacher, or kept in `📂・lesson-resources` next to the
  PDF. **Import** validates it against the schema and shows what was wrong if it fails.
- Images are downscaled in the browser (canvas → WebP, ≤ 1600 px long edge) before they enter
  the lesson (DS §7).

Why not Payload/Postgres like Benito's other projects: those are marketing sites with an editor
team. Here every user is an anonymous volunteer; accounts would mean moderation, privacy policy,
hosting cost and a login step before anyone has seen the value. A file is something Discord
people already share. **Revisit** when (a) the coordinators want a shared lesson library, or
(b) teachers lose work to cleared browsers — then a small Payload collection `lessons` storing
the same JSON is the natural next step (the schema doesn't change).

## 4. PDF export

The browser's print engine renders the same DOM the teacher sees:

- `/print/slides` sets `@page { size: 1920px 1080px; margin: 0 }` → **1440 × 810 pt**, the
  current deck's size (DS §5.1). One `<section>` per slide with `break-after: page`.
- `/print/handout` sets `@page { size: A4; margin: 18mm }`.
- The page waits for `document.fonts.ready` and every `<img>` to decode, sets `document.title`
  (the default PDF filename), then calls `window.print()`. A visible "Save as PDF" button is the
  fallback if the browser blocks the automatic dialog.

Text stays real text (selectable, searchable, screen-reader friendly). **Rejected:**
`@react-pdf/renderer` (a second set of layout primitives to keep in sync with the preview, no
CSS grid, no container queries, weak complex-script shaping) and server-side headless Chrome
(needs a function with a 60 MB browser, and would upload teachers' images to a server for no
gain).

### 4.1 One scale everywhere: container units

A slide is a `container-type: inline-size` box with `aspect-ratio: 16 / 9`. Inside it every size
is written as `calc(N * var(--u))` with `--u: calc(100cqw / 1920)`. The same slide is therefore
exact at 1920 px in print and proportionally correct at 320 px in the preview sidebar — no
`transform: scale()`, no ResizeObserver, no JavaScript.

## 5. State in the studio

Follows the global Next/React conventions (restraint first):

- One `useReducer` at the studio root owns the lesson (`hooks/use-lesson-editor.ts`). The
  preview and the editor both receive the lesson as **props**. No Zustand: there is no
  every-tick state read by unrelated components.
- Autosave is a real external-system sync — `useEffect` that writes to IndexedDB after 400 ms
  of quiet (`hooks/use-autosave.ts`).
- No server state exists, so no TanStack Query in v1.
- Every hook is named and lives in `hooks/`; components render and call hooks.
- Block reordering uses **Move up / Move down buttons**, not drag-and-drop: fully keyboard and
  screen-reader accessible with native `<button>`s and no dependency. Drag-and-drop (dnd-kit)
  only if teachers ask for it.

## 6. Stack

| Layer | Choice | Version (pinned 2026-09-28) |
|---|---|---|
| App | Next.js App Router, React, TypeScript | `next 16.3.6`, `react 19.2.8`, `typescript 5.9.3` |
| Package manager | pnpm | `11.21.0` |
| Styling | Tailwind CSS v4 + CSS layers for slide/handout | `tailwindcss 4.3.3` |
| UI primitives | shadcn (`radix-nova` style, Radix base, RTL-aware classes), lucide icons | `shadcn 4.21.0`, `radix-ui 1.6.7`, `lucide-react 1.48.0` |
| Toasts | sonner (via shadcn) | `2.0.8` |
| Schema / import validation | zod | `4.6.5` |
| Local storage | idb-keyval | `6.3.0` |
| Fonts | `next/font/google`: Bricolage Grotesque, Atkinson Hyperlegible Next + Mono, Noto Sans family (lazy) | — |
| Hosting | Vercel (static + client; no functions needed) | `[VERIFY: account/domain, R §6 Q4]` |
| Analytics | none in v1 (no personal data leaves the browser) | — |

## 7. Folder layout

```
app/
  page.tsx               landing
  studio/page.tsx        editor shell (client leaf does the work)
  print/[format]/page.tsx
  brand/page.tsx         living design system
  globals.css            tokens (the only place with hex), shadcn mapping
  lesson.css             slide + handout layer (references tokens only)
components/
  ui/                    shadcn, vendored — restyle via tokens/className, never edit
  lesson/                pure renderers: SlideView, slide templates, Handout, devices
  studio/                editor composites (client)
  brand/                 small pieces for /brand
lib/
  lesson/                schema, languages, paginate, fill-blank parser, templates, example lesson
  images.ts              browser image downscale
hooks/                   use-lesson-editor, use-autosave, use-lesson-drafts, use-print-when-ready
docs/                    research, brand-and-design-system, architecture, teacher-guide, tasks/
```

## 8. Not in v1 (roadmap)

1. Discord announcement image for `🗓️・lesson-calendar` generated from the same lesson (1920 ×
   1080 PNG via the same renderer).
2. Shared lesson library (Payload `lessons` collection, §3 revisit criteria).
3. PPTX export — only if teachers need to edit after generating.
4. Studio UI translated (PT/ES) — English is the server's lingua franca.
