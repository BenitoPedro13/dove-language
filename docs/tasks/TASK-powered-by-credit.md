# TASK: "Powered by Blessed Moon Studio" footer

## 1. Current scenario

The tool has a header (`components/site-header.tsx`) and no footer. Nothing credits the
studio that built it.

## 2. Planned changes

- New `components/site-footer.tsx`: one quiet line, "Powered by Blessed Moon Studio", the
  name linking to `https://blessed-moon.vercel.app` (new tab, with a screen-reader hint).
  Slate on paper (5.57, DS §4.3 body text) with a globe link (6.87), a dashed top rule
  like the steps list, `min-h-11` hit target.
- Rendered on `/` and `/brand` only. Not on `/studio` (a full-height editor) and never on
  `/print/*` (it would print into teachers' PDFs).

Rejected: putting it in the root layout — it would reach the print routes.

## 3. Why

Requested by Benito (2026-10-10) for the studio's portfolio projects.

## 4. Affected files

| File | Change type | Notes |
|------|-------------|-------|
| `docs/tasks/TASK-powered-by-credit.md` | new | this document |
| `components/site-footer.tsx` | new | the credit line |
| `app/page.tsx` · `app/brand/page.tsx` | edit | render it after `<main>` |
