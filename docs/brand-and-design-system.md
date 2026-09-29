# The Dove Language — Brand & Design System ("Airmail")

> **Authority.** Source of truth for brand, tokens, typography, graphic devices, slide and
> handout templates, and the studio UI. Raw token values live in code in exactly one place,
> `app/globals.css`; everything else references CSS variables. If code and this document
> disagree, fix one of them in the same commit.
>
> **Audience.** Written so a teacher, a `@Dove Designer`, or an implementing model can apply it
> without making design decisions. Where a value is given, use it. Where something is
> `[VERIFY: …]`, resolve it before the thing depending on it ships.
>
> Evidence for every decision is in `docs/research.md` (cited as **R §n**).

---

## 1. Concept: Airmail

A dove is a messenger. Dove's existing assets already draw one: dashed flight paths across the
LinkedIn banner, a letter in the Server Guide art, a bird crossing a globe (R §3.2). Learning a
language in this community is sending a message to someone in another country.

> **Every lesson is a letter between two languages.**

The system turns that into four quiet devices (§6): the **flight path** (a dashed line), the
**stamp** (language + level), the **postmark** (session and date), and **paper** (the warm
surface everything sits on). Nothing else is decoration.

### 1.1 Principles

1. **Calm over loud.** The server's promise is "a calm environment to learn" (R §1). No
   chalkboards, no confetti, no stock 3D people. One accent colour per slide region.
2. **The word first.** The thing a student must learn (a term, a sentence in the target
   language) is always the heaviest element on a slide. Glosses and translations are always
   lighter, smaller, and labelled.
3. **Every language is a guest.** Arabic reads right-to-left, Japanese has no spaces, Russian is
   Cyrillic. Layouts never assume Latin script. Languages are named, never flagged (R §2.2 #8).
4. **Volunteers don't design.** A teacher types content; the system does the layout. If a
   teacher has to nudge something by hand, the system is missing a rule — add it here.

## 2. Voice

Dove writes for people who are *learning* English, so UI and template text is **plain English at
about CEFR B1**: short sentences, common words, no idioms, no jargon.

| Do | Don't |
|---|---|
| "Download the handout" | "Grab the takeaway doc" |
| "Words for this lesson" | "Lexical inventory" |
| "Your lesson is saved on this device." | "Persisted to local IndexedDB." |
| "Welcome to the session!" | "Let's gooo!! 🚀🔥" |

- **Name:** "The Dove Language" at first mention on a surface, "Dove" after. Never "TDL".
- **Community words are proper nouns** and keep their capitals: Bonfire, Dove Classroom,
  Dovestar, Dove Pillars.
- **Emoji:** fine in Discord posts; **not** in slides or handouts (they render differently per
  OS and fight the palette). Use a word instead.
- **Never invent** a teacher's name, a session date, member counts, or a partnership.

## 3. Logo

**Status: placeholder.** `public/brand/dove-mark-placeholder.png` is a 256 px crop of the
LinkedIn avatar (R §3). `[VERIFY: replace with the original vector mark from @Dove Designer —
SVG, one full-colour and one single-colour version (the line mark from the Server Guide).]`

| Rule | Value |
|---|---|
| Primary mark | orange globe, blue continents, pale dove (LinkedIn) — on Paper or white |
| Inverse / app icon | blue tile (Discord icon) — for avatars and favicons only |
| Clear space | ½ of the mark's diameter on every side |
| Minimum size | 32 px on screen, 10 mm in print |
| On slides | 56 px mark in the footer rail (§8.2), nowhere else except the cover (160 px) |
| Wordmark | Not re-typeset. Until the wordmark file exists (R §6 Q3), write "The Dove Language" in the display face next to the mark |

**Never:** stretch, rotate, recolour, outline, add shadows, place on a photo, or put the
full-colour mark on Dove Orange (the globe disappears).

## 4. Colour

### 4.1 Palette

Derived from the logo (sampled values in R §3.1), then adjusted only where contrast required a
darker *text* variant. Components consume **semantic tokens**, never these hex values.

| Token (`--dove-*`) | Hex | Source / role |
|---|---|---|
| `paper` | `#FBF7EF` | warm page surface (light theme background) |
| `white` | `#FFFFFF` | cards on paper, handout page |
| `ink` | `#0F2140` | text — Globe Blue pushed to near-black |
| `slate` | `#5A6478` | secondary text, glosses, meta |
| `rule` | `#D8CFBF` | hairlines, dashed path on paper (decorative only) |
| `globe` | `#02579E` | **Globe Blue** — logo continents, primary brand colour, links, focus |
| `sky` | `#D0E4FC` | **Dove Sky** — the dove's body; soft blue surface |
| `orange` | `#F47B42` | **Dove Orange** — the globe; fills and large shapes only |
| `ember` | `#B4461B` | text-safe orange for when orange must be *read* |
| `note` | `#FFE181` | **Note Yellow** — the banner's sticky note; highlight surface |
| `night` | `#0B1630` | dark theme background (screen-share at night) |
| `night-raised` | `#132344` | cards on night |
| `night-muted` | `#A9B4CC` | secondary text on night |
| `sky-night` | `#9CC3F5` | Globe Blue's role on night (links, gloss labels) |

### 4.2 Wayfinding: four kinds of slide

The Server Guide already colour-codes its four resource cards with the line logo in green,
blue, yellow and red (R §3). The system reuses that as **lesson wayfinding**: every block
belongs to one kind, shown as a labelled tab in the slide header (§8.2). Colour is never the only
signal — the tab always carries the word.

| Kind | Used by | Tint (surface) | Strong (text / stroke) | On night (text) |
|---|---|---|---|---|
| **Learn** | vocabulary, examples, spotlight, abbreviations | `sky` `#D0E4FC` | `globe` `#02579E` | `#9CC3F5` |
| **Culture** | cultural note, text + image, gallery | `note` `#FFE181` | `mustard` `#7A5300` | `#FFE181` |
| **Practice** | fill-in-the-blank, answer key, break | `coral-tint` `#FCDEDD` | `coral` `#B42330` | `#FF8E92` |
| **Talk** | dialogue, discussion prompt | `leaf-tint` `#D6F0DF` | `leaf` `#1F6E43` | `#7FD3A2` |

Cover, objectives and closing are **Lesson** chrome and use `globe`/`orange`.

### 4.3 Measured contrast

WCAG 2.x relative luminance, computed 2026-09-28 (script in `docs/tasks/TASK-foundation.md`
§5). AA = 4.5 body, 3.0 large (≥ 24 px, or ≥ 18.66 px bold).

| Foreground on background | Ratio | Allowed for |
|---|---|---|
| ink on paper | **14.98** | everything |
| slate on paper | **5.57** | body text, glosses |
| globe on paper | **6.87** | body text, links, labels |
| globe on sky | **5.66** | body text |
| ember on paper | **5.13** | body text |
| ink on orange | **5.91** | body text on orange fills |
| ink on note | **12.45** | everything |
| mustard on note | **5.33** | body text |
| coral on coral-tint | **5.16** | body text |
| leaf on leaf-tint | **5.16** | body text |
| paper on night | **16.77** | everything |
| night-muted on night | **8.61** | body text |
| sky-night on night | **9.85** | body text |
| orange on night | **6.62** | body text, accents |
| **orange on paper** | **2.53** | ❌ never text — shapes only |
| **white on orange** | **2.71** | ❌ never |
| **orange on globe** | **2.71** | ❌ never text |

### 4.4 Rules

- **One accent per region.** A slide header may use its kind colour; the body stays ink/slate.
- **Dove Orange is never text on a light surface.** Use `ember` or put ink text on an orange fill.
- **No gradients, no glows, no pure `#000`.** Dark theme is `night`, not black.
- **Two themes, same tokens.** *Paper* (light, default for print) and *Night* (dark, for
  screen-share). A lesson picks one; the handout is always Paper.

## 5. Typography

Chosen for a *learning* audience first, character second.

| Role | Family | Why |
|---|---|---|
| **Display** — cover title, slide titles, spotlight term | **Bricolage Grotesque** (variable, `opsz`) | friendly and a little hand-made, echoes the chunky banner type without imitating it |
| **Text** — terms, sentences, glosses, UI | **Atkinson Hyperlegible Next** (variable) | designed by the Braille Institute so similar letters stay distinct (`I l 1`, `rn m`, `O 0`). A learner decoding an unknown word needs exactly that |
| **Meta** — codes, levels, numbering, dates | **Atkinson Hyperlegible Mono** | same family, tabular; used for `PT-BR`, `A1–A2`, `03 / 12` |
| **Other scripts** | **Noto Sans** (Cyrillic, Greek, Vietnamese), **Noto Sans JP / KR / SC / Arabic / Hebrew / Devanagari / Thai** | appended to every stack as fallbacks; loaded lazily by `unicode-range`, so a Latin-only lesson downloads none of them |

Atkinson Hyperlegible Next and Bricolage cover Latin + Latin Extended only; the Noto fallbacks
are what make Russian, Arabic or Japanese lessons render correctly. Never set a stack without
them (`--font-dove-text` and `--font-dove-display` already include them).

### 5.1 Slide scale (1920 × 1080 canvas, px)

The canvas is 1920 × 1080 CSS px = **1440 × 810 pt** in PDF — exactly the current deck's page
size (R §2), so existing habits (Discord previews, printing) don't change. Screen-share
downscales to ~1280 px, so **nothing on a slide is smaller than 24 px**.

| Token | Size / line-height | Weight | Use |
|---|---|---|---|
| `slide-display` | 136 / 1.0 | 700 | cover title, break slide |
| `slide-title` | 64 / 1.1 | 700 | slide heading |
| `slide-term` | 56 / 1.15 | 700 (text face) | spotlight term, abbreviation |
| `slide-lead` | 48 / 1.3 | 500 | sentence in the target language, prompt question |
| `slide-body` | 40 / 1.4 | 400 | vocabulary term, paragraphs, dialogue lines |
| `slide-gloss` | 32 / 1.35 | 400 | translations/glosses (slate) |
| `slide-meta` | 24 / 1.2 | 500 mono, `+0.04em` | stamp, kind tab, page number |

### 5.2 Handout scale (A4, pt)

| Token | Size | Use |
|---|---|---|
| `h-title` | 26 pt | lesson title |
| `h-section` | 15 pt | section heading |
| `h-body` | 11 pt | everything readable |
| `h-gloss` | 10 pt | glosses |
| `h-meta` | 8.5 pt mono | stamp, footer |

## 6. Graphic devices

Four devices, each with one job. If a slide needs a fifth thing to look finished, the template
is wrong.

| Device | Job | Where | Rules |
|---|---|---|---|
| **Flight path** | shows *progress* through the lesson | footer rail of every slide; handout section dividers | dashed, 4 px, `12 / 10` dash on the 1920 canvas; the dove dot sits at the current position (slide *n* of *N*); on paper uses `rule` for the path and `globe` for travelled distance |
| **Stamp** | says *which language, which level* | header, left, every slide; handout header | mono caps, perforated edge (CSS mask), e.g. `PT-BR · A1–A2`; kind-independent (globe on sky) |
| **Postmark** | says *which session, when* | cover and closing only | ring with session title curved is **not** allowed (hard to read); a plain ring with `SESSION 12` / date in mono |
| **Paper** | the room | background | `paper` / `night`; no textures |

No chalkboards, doodles, paper clips or stickers on lesson material: they belong to marketing
illustration (banner, Server Guide art), not to something a student reads for 60 minutes.

## 7. Imagery

- **Teacher's own screenshots and photos only** (a meme, an Orkut screenshot, a place). They
  carry the lesson; stock 3D people don't (R §2.2 #3).
- Images sit in a **white frame** (16 px padding, 8 px radius on the 1920 canvas) — like a
  photo tucked into a letter. No rotation, no drop shadow beyond `0 2px 0 rule`.
- **Every image needs alt text** (the studio refuses to export without it — §10).
- Images are downscaled in the browser to ≤ 1600 px on the long edge, WebP, before they're
  stored (keeps `.dove.json` files shareable on Discord's upload limit).

## 8. Layout

### 8.1 Slide canvas

- 1920 × 1080, safe margins **120 px** left/right, **80 px** top, **72 px** bottom.
- 12-column grid, **48 px** gutter, inside the margins (content width 1680).
- Text columns never exceed **1200 px** (≈ 60 characters at `slide-body`).

### 8.2 Slide chrome (every slide except cover and break)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ [PT-BR · A1–A2]  [LEARN]                                   Social Media  │  header (meta)
│                                                                          │
│ 3 · Basic vocabulary                                                     │  slide-title
│ Vocabulário básico                                                       │  (target-language line)
│                                                                          │
│   …block content…                                                        │
│                                                                          │
│ (mark) The Dove Language   - - - - - ●- - - - - - - - - - -     08 / 24  │  footer rail
└──────────────────────────────────────────────────────────────────────────┘
```

- **Title is bilingual when the lesson has a gloss language:** target language on top in
  `slide-title`, gloss below in `slide-gloss` slate. (R §2 slide headers do this with a `|`.)
- The section number comes from the block's position among *sections*, not typed by hand.

### 8.3 Handout page (A4 portrait)

- Margins 18 mm, single column, max 165 mm text width.
- Header: stamp, lesson title, date. Footer: flight path + page *n* / *N*.
- Vocabulary becomes a **three-column table** (term · gloss 1 · gloss 2), not one row per slide.
- Dialogues show target line + translation line interleaved, not one page per language.
- Exercises print the blanks; the answer key goes on the **last page**, under "Answers".

## 9. Templates (block → slide)

Every block is data first; these are the only layouts. Pagination is automatic: a block that
exceeds its per-slide limit continues on the next slide with "(cont.)" in the title.

| Block | Kind | Slide layout | Per-slide limit |
|---|---|---|---|
| **Cover** (from lesson settings) | Lesson | mark, stamp, postmark, `slide-display` title (target language) + gloss title | — |
| **Objectives** | Lesson | topic + short paragraph, target language then glosses stacked | 1 |
| **Section prompt** | Talk | big question in `slide-lead`, gloss below | 1 |
| **Cultural note** | Culture | paragraph (target) left column, glosses right column (≥ 1440 px wide slide) — one language per slide if > 320 characters | 320 chars/lang |
| **Vocabulary** | Learn | two-column list; term `slide-body` bold ink, glosses as labelled rows `EN comment` in `slide-gloss` | 8 items |
| **Examples** | Learn | one sentence per row in `slide-lead`, glosses underneath, flight-path dash between rows | 3 |
| **Spotlight** | Learn | term `slide-term`, meaning, example sentence + glosses; optional usage note in a `note` tab | 1 |
| **Abbreviations** | Learn | three columns: short (mono) → full → meaning | 7 |
| **Text + image** | Culture | text 6 cols, image 6 cols (image side alternates) | 1 image |
| **Gallery** | Culture | 1–4 images in framed grid, caption under each | 4 |
| **Break** | Practice | full-bleed kind tint, `slide-display` title, gloss below | 1 |
| **Fill in the blank** | Practice | numbered sentences, blank drawn as a 6-char underline; word bank as outlined chips | 6 |
| **Answer key** | Practice | auto-generated from the exercise, answers in globe bold | — |
| **Dialogue** | Talk | speaker name in mono caps column, line in `slide-body`; each gloss language gets its own slide after the original | 12 lines |
| **Closing** (from lesson settings) | Lesson | "Thank you" in target + gloss, next steps (channels), postmark | — |

## 10. Accessibility (WCAG 2.2 AA, non-negotiable)

- **Contrast:** only pairs from §4.3 marked allowed.
- **Language tagging:** every text node carries `lang` (and `dir="rtl"` for Arabic, Hebrew,
  Persian, Urdu). Screen readers then pronounce each line in the right voice; the browser picks
  the right Noto font.
- **Colour is never the only signal:** kind tabs carry a word; the answer key repeats the number.
- **Images:** alt text required before export; decorative devices are `aria-hidden`.
- **Minimum sizes:** 24 px on the slide canvas, 8.5 pt in the handout.
- **Studio UI:** keyboard reachable end-to-end, visible focus ring (`globe`, 2 px, 2 px
  offset), 44 × 44 px targets, respects `prefers-reduced-motion` (the studio has almost no
  motion anyway; slides have none).
- **PDF:** made by the browser's print engine, so text stays real, selectable and searchable.
  `[VERIFY: check whether the teacher's Chrome version emits a tagged PDF; if not, document the
  "Save as PDF" setting in docs/teacher-guide.md.]`

## 11. Studio UI

The generator (`/studio`) is a tool, so it recedes: Paper background, white panels, ink text,
Globe Blue for the one primary action per view, orange only in the brand mark. shadcn's semantic
tokens (`--primary`, `--ring`, …) are mapped onto the Dove tokens in `app/globals.css`; vendored
`components/ui/*` are never edited, only restyled through tokens and `className`.

## 12. Governance

- Changes to palette, type or devices go through `@Dove Designer` and are recorded here with a
  date. The studio reads tokens, so a palette change is one edit in `app/globals.css`.
- New slide layouts are added to §9 **before** they are built.
- Version: **Airmail 0.1** (2026-09-28, proposal, not yet reviewed by Dove staff).
