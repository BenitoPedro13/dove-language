# TASK-foundation — brand system, tokens, and the Lesson Studio v1

## 1. Current scenario

- Dove's lesson material is made by hand in Canva on a borrowed chalkboard template
  (R §2). 58 slides for one session; glosses as run-on text; errors repeated across slides; no
  study version for phones.
- No brandbook exists; only a logo raster, a banner and a Discord Server Guide (R §3).
- This repo was created on 2026-09-28 with `create-next-app` (commit `ba3a935`) and
  `shadcn init` (radix base, `radix-nova`, RTL on).

## 2. Planned changes

1. **Docs** — `docs/research.md`, `docs/brand-and-design-system.md` (Airmail 0.1),
   `docs/architecture.md`, `docs/teacher-guide.md`, `CLAUDE.md`, `README.md`.
2. **Tokens** — `app/globals.css`: Dove palette (DS §4), shadcn semantic tokens mapped onto it,
   font variables with Noto fallbacks (DS §5). `app/lesson.css`: slide and handout layer using
   container units (architecture §4.1).
3. **Lesson model** — `lib/lesson/schema.ts` (zod), `languages.ts`, `blocks.ts` (defaults and
   labels per block type), `paginate.ts`, `fill-blank.ts`, `example.ts` (the Portuguese
   social-media session transcribed from the PDF, with the Spanish errors in R §2.2 #7 fixed).
4. **Renderers** — `components/lesson/`: devices (stamp, postmark, flight path, mark), one
   component per slide template, `SlideView`, `Handout`.
5. **Studio** — `/studio`: outline (add / move / duplicate / delete blocks), block editors,
   lesson settings, live preview, autosave, import/export `.dove.json`, links to print.
6. **Print** — `/print/slides`, `/print/handout`.
7. **Landing** `/` and **living design system** `/brand`.

Rejected alternatives are recorded in architecture §3 (backend), §4 (react-pdf, headless Chrome),
§5 (drag-and-drop, Zustand).

## 3. Why

The content is already regular (R §2.1); moving the *layout* into a system makes every lesson
consistent and makes teachers faster, which is the only way volunteers adopt it (R §1).

## 4. Affected files

| Path | Change | Notes |
|---|---|---|
| `docs/*.md`, `CLAUDE.md`, `README.md` | new | |
| `app/globals.css`, `app/lesson.css` | edit / new | only file with hex = globals |
| `app/layout.tsx` | edit | fonts, metadata, Toaster, TooltipProvider |
| `app/page.tsx`, `app/studio/page.tsx`, `app/print/[format]/page.tsx`, `app/brand/page.tsx` | new | |
| `lib/lesson/*`, `lib/images.ts` | new | |
| `components/lesson/*`, `components/studio/*`, `components/brand/*` | new | |
| `hooks/*` | new | |
| `public/brand/dove-mark-placeholder.png` | new | placeholder (R §6 Q1) |

## 5. Verification

- `pnpm typecheck`, `pnpm lint`, `pnpm build` pass; `git diff --check` clean.
- Contrast pairs in DS §4.3 re-computed with the script below match.
- The example lesson renders every template; `/print/slides` produces 1440 × 810 pt pages;
  `/print/handout` produces A4.
- Keyboard only: create a lesson, add a vocabulary block, reorder it, export JSON, re-import it.
- An Arabic target lesson renders right-to-left with Noto Sans Arabic; a Japanese one renders
  with Noto Sans JP.
- 375 px width: landing and brand pages have no horizontal scroll; studio stacks.

```js
// contrast check used for DS §4.3
const L=h=>{const c=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255)
  .map(v=>v<=0.03928?v/12.92:((v+0.055)/1.055)**2.4);return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]};
const ratio=(a,b)=>{const x=L(a),y=L(b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05)};
```

## 6. Out of scope

- Real logo files (R §6 Q1) — placeholder until provided.
- Hosting, domain, rollout (R §6 Q4–5).
- Everything in architecture §8.
