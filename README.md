# Dove Lesson Studio

**Type a lesson, get branded slides and a study handout as PDFs.** A free tool for the
volunteer teachers of [The Dove Language](https://www.linkedin.com/company/the-dove-language/),
a Discord community of ~4,600 people learning languages together — and the home of
**Airmail**, Dove's brand and design system.

[**Open the studio →**](https://dove-language.vercel.app)

> **Status (2026-09-29).** Studio v1 works end to end: landing, editor with live preview,
> autosave, `.dove.json` import/export, slide and handout PDFs, and the living design system
> at `/brand`. Airmail 0.1 is proposed and not yet reviewed by Dove staff. The logo is a
> raster placeholder until the vector arrives ([`docs/research.md`](docs/research.md) §6).

## Why it exists

Dove's lessons were hand-built in Canva: 58 slides for a single A1–A2 session, with the
pedagogy already solid and very regular — a dozen repeating patterns (objectives,
vocabulary, examples, dialogue, fill-in-the-blank…). Teachers are volunteers, so the tool
only gets adopted if it's **faster than Canva**, not just prettier. Lesson Studio turns
those patterns into blocks: the teacher writes content, the layout follows the system.

## Highlights

- **The lesson is data.** One zod schema (`lib/lesson/schema.ts`) defines a lesson; types
  are inferred from it and it validates every imported file.
- **One renderer, three consumers.** Slide and handout components are pure (no hooks, no
  `'use client'`), so the studio preview, the print routes and `/brand` all render the
  same code.
- **Pagination as a pure function.** `paginate()` splits blocks into slides by estimated
  height, numbers sections, adds "(cont.)" titles and derives the cover and answer keys.
  The preview measures every rendered slide and warns on overflow — content is never
  silently clipped.
- **One scale everywhere.** Slides are container-query boxes sized in `cqw` units, exact at
  1920 px in print and proportional at 320 px in the sidebar, with no JavaScript scaling.
- **The browser is the PDF engine.** `@page` per route (1440 × 810 pt slides, A4 handout);
  text stays real, selectable text.
- **No backend, no accounts.** Drafts autosave to IndexedDB on the teacher's device and
  travel as `.dove.json` files (images embedded as WebP) — something Discord people
  already share.
- **Multilingual by design.** A target language plus up to two gloss languages per lesson,
  with Noto fallbacks for Japanese, Korean, Chinese, Arabic, Hebrew, Devanagari and Thai.
- **WCAG 2.2 AA.** Measured contrast for every colour pair, keyboard-first block reordering
  with plain buttons instead of drag-and-drop.

## Airmail, the design system

> *Every lesson is a letter between two languages.*

A dove is a messenger, so the system is four quiet devices: the **flight path** (a dashed
line), the **stamp** (language and level), the **postmark** (session and date) and
**paper** (the warm surface everything sits on). Nothing else is decoration. The full
system — colour, type scales for slides and handouts, devices, templates, accessibility —
is in [`docs/brand-and-design-system.md`](docs/brand-and-design-system.md) and rendered
live at `/brand`.

## Routes

| Route | What |
|---|---|
| `/` | Start a lesson, open a file, try the example, your drafts |
| `/studio?id=…` | The editor with live preview |
| `/print/slides?id=…` · `/print/handout?id=…` | Print → Save as PDF |
| `/brand` | The design system, rendered from the real templates |

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui (Radix) ·
zod · idb-keyval · sonner · Bricolage Grotesque + Atkinson Hyperlegible Next · Vercel.

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm typecheck && pnpm lint && pnpm build
```

No environment variables and no database: lessons live in the browser (IndexedDB) and
travel as `.dove.json` files.

## Documentation

| Doc | |
|---|---|
| [`docs/research.md`](docs/research.md) | The community, the audit of the current material, open questions |
| [`docs/brand-and-design-system.md`](docs/brand-and-design-system.md) | Airmail: colour, type, devices, templates |
| [`docs/architecture.md`](docs/architecture.md) | Data model, pagination, storage, PDF, stack |
| [`docs/teacher-guide.md`](docs/teacher-guide.md) | For teachers — share this one |
| [`CLAUDE.md`](CLAUDE.md) | Workflow and conventions for anyone (human or model) changing the code |

---

Built by [Blessed Moon Studio](https://blessed-moon.vercel.app) for The Dove Language.
