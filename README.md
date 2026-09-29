# The Dove Language — Lesson Studio & design system

A free tool for [The Dove Language](https://www.linkedin.com/company/the-dove-language/)
teachers: type a lesson, get branded **slides** (16:9, for the Dove Classroom) and a **study
handout** (A4) as PDFs. Also home of **Airmail**, Dove's brand and design system.

**Status (2026-09-29):** Airmail 0.1 proposed (not yet reviewed by Dove staff). Studio v1 works
end to end: landing, editor with live preview, autosave, `.dove.json` import/export, slide and
handout PDFs, living design system at `/brand`. Logo is a raster placeholder until the vector
arrives (`docs/research.md` §6).

## Quickstart

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm typecheck && pnpm lint && pnpm build
```

No environment variables, no database: lessons live in the browser (IndexedDB) and travel as
`.dove.json` files.

| Route | What |
|---|---|
| `/` | start a lesson, open a file, try the example, your drafts |
| `/studio?id=…` | the editor |
| `/print/slides?id=…` · `/print/handout?id=…` | print → Save as PDF |
| `/brand` | the design system, rendered from the real templates |

## Read first

1. `docs/research.md` — the community, the audit of the current material, open questions
2. `docs/brand-and-design-system.md` — Airmail: colour, type, devices, templates
3. `docs/architecture.md` — data model, pagination, storage, PDF, stack
4. `docs/teacher-guide.md` — for teachers (share this one)
5. `CLAUDE.md` — workflow and conventions for anyone (human or model) changing the code
