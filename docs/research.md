# Research — The Dove Language

> Read this first. It records what the community is, what material exists today, what is wrong
> with it, what brand assets already exist, and which decisions were made (with date and who).
> Open questions live in §6 — never quietly assume an answer to one of them.

## 1. Who this is for

**The Dove Language** is a free Discord community for language learning (est. Jan 2024,
~4,600 members, ~560 online at the time of writing — Discord server profile, 2026-09-28).
Quoted from the server's own intro:

> "a community focused on language learning, interaction, and personal growth … We are a
> friendly and very safe server for all those who want a calm environment to learn"

Server-profile promise: *"Join our safe community to learn English, Spanish, Japanese, French,
Arabic, German, Portuguese, programming and more."* Tags: Languages · Friendly · Safe ·
Free lessons · Diversity. LinkedIn tagline: *"Connecting people worldwide through free language
learning, real conversations, and a collaborative global community."*

Three audiences touch the material this project produces:

| Audience | What they do | What they need from the material |
|---|---|---|
| **Students** (members) | join "Dove Classroom" voice sessions, download PDFs from `📂・lesson-resources` | read unfamiliar words on a screen-share and later on a phone; know level + language at a glance |
| **Teachers** (`@Dove Teacher`, `@Dove Reading Host`, volunteers) | build a deck, screen-share it live, upload the PDF | produce a good-looking lesson fast, without being a designer |
| **Designers / coordinators** (`@Dove Designer`, `@Study Coordinator`) | keep things consistent | one documented system to point people at |

The key constraint: **teachers are volunteers**. Anything that costs them more time than Canva
will not be adopted. The tool has to be *faster* than what they do now, not only prettier.

## 2. Audit of the current material

Source: `docs/refs/portuguese-session-a1-a2-social-media-2026.pdf` (58 slides, 1440 × 810 pt,
made in Canva). Sample renders: `docs/refs/current-deck-p01|08|10|35.png`.

### 2.1 What the content already gets right (keep it)

The *pedagogy* is solid and very regular. Every slide is one of about a dozen patterns:

| Pattern | Example slide(s) | Structure |
|---|---|---|
| Cover | 1 | language, level, title in target language + English |
| Objectives | 2–3 | same text in target language, then English |
| Section prompt | 4 | numbered heading + a question to open discussion |
| Cultural note | 5–6 | a paragraph, once per language |
| Vocabulary list | 7–8, 10–11, 31 | `term — en: …, es: …` rows, 8–9 per slide |
| Examples | 9, 12, 32 | 1–3 sentences, each with en/es translation |
| Text + image | 13–16, 21 | short paragraph (bilingual) beside a picture |
| Image gallery | 17–20, 22–23 | memes/screenshots with a caption |
| Term spotlight | 24–30 | one slang word: meaning, example, translations |
| Abbreviations | 26 | `kkkk → haha / lol` |
| Break | 33 | "Hora dos exercícios" |
| Fill-in-the-blank | 34–36 | numbered sentences + word bank, then the answer key |
| Dialogue | 37–56 | speaker lines, one slide per language |

This regularity is the whole opportunity: **the content is already structured data; only the
presentation is hand-made.** If teachers enter the data, the system can lay it out.

### 2.2 What makes it look amateur (fix it)

1. **The template is not Dove's.** Chalkboard texture, chalk sticks, script display font, a
   yellow/orange palette. Nothing traces back to the dove, the globe, or the brand's own
   orange + blue. A member could not tell this deck came from Dove.
2. **Glosses are run-on text.** `Comentário - en: comment, es: comentário` — the separator is a
   hyphen, the languages are inline lowercase codes, commas are missing in places
   (`en: follower es: seguidor(a)`). The *term* the student must learn has the same weight as
   the metadata around it.
3. **Stock 3D illustrations** (a woman with a megaphone, a phone with hearts) decorate but
   don't teach. They also change style from slide to slide.
4. **No stable grid.** Headings shift, lists start at different x positions (`current-deck-p10`
   vs `p08`), body size changes to make text fit.
5. **Level and language are only on the cover** (plus a `#PortugueseSessionBeginners` hashtag).
   A student joining mid-session, or scrolling a PDF on a phone, has no persistent marker.
6. **58 slides to download.** The PDF in `lesson-resources` is the screen deck. On a phone, a
   student scrolls 58 landscape pages to re-read 30 words. There is no study version.
7. **Errors survive** because text is retyped across slides: `usuário` given as the Spanish for
   *user* (it is `usuario`), `comentário` as Spanish for *comment* (`comentario`),
   "Similar to jajajaja" left in English inside the `es:` line, a stray `flop​a` with a zero-width
   character (slide 49). Structured entry makes each fact typed once.
8. **Flags as language markers.** A Brazilian flag stands for "Portuguese". Flags are countries,
   not languages (Portuguese is also Portugal, Angola, Mozambique…; English is not only the US).

### 2.3 How material is consumed

- **Live:** a teacher screen-shares in a Discord voice channel. Discord is used mostly in dark
  mode, often at night; a full-white slide in a dark room is glaring. Screen-share is
  compressed, so thin strokes and small text blur.
- **Later:** students download the PDF from a channel, often on a phone.

## 3. Brand assets that already exist

There is no brandbook. What exists (see `docs/refs/`):

| Asset | Where | Notes |
|---|---|---|
| **Logo (primary)** | LinkedIn avatar | orange globe, Globe-Blue continents, pale-blue dove flying left-to-right, orange wing |
| **Logo (inverse)** | Discord server icon | blue rounded square, blue globe with orange continents, white dove |
| **Line logo** | Discord Server Guide resource cards | the same mark as a thin outline, in green / blue / yellow / red — one colour per resource card |
| **Wordmark** | LinkedIn banner | "The" + "Language" in Globe Blue, "DOVE" in orange, heavy slab-ish display face |
| **Banner illustration** | LinkedIn | orange field, hand-drawn doodles: speech bubbles (*Hola*, *hi*), **dashed flight paths**, paper clip, sticky note, globe, round flag badges |
| **Server Guide illustration** | Discord | two young people in the sky, a "SERVER GUIDE" window, a **letter/envelope**, clouds — anime-style, commissioned |
| **Roles vocabulary** | server | Bonfires, Dovestar, Dove Pillars, Dove Classroom — the community already names things with its own words |

### 3.1 Sampled colours

Sampled (5 × 5 px average) from the screenshots on 2026-09-28 with `sharp`, **not** from vector
source files — so they are close, not canonical. `[VERIFY: ask @Dove Designer for the original
logo files and confirm these hex values; update docs/brand-and-design-system.md §4 if they differ.]`

| Sample | Hex |
|---|---|
| Logo globe orange | `#F37F46` |
| Wordmark "DOVE" orange | `#FC793E`, `#F87C44` |
| Logo continents / wordmark blue | `#03579F`, `#01589E`, `#045799` |
| Dove body | `#CFE4FC`, `#D1E3FC` |
| Banner sticky note | `#FFE181` |
| Discord icon background (inverse logo) | `#1B257D` → `#1E39A5` |

### 3.2 The idea hidden in the assets

A **dove is a messenger bird** — the carrier pigeon. The existing assets already say so without
naming it: the dashed flight paths in the banner, the envelope in the Server Guide art, a dove
flying *across a globe*. Language learning in this community is literally sending messages
between people in different countries. This became the brand concept, **Airmail**
(`docs/brand-and-design-system.md` §1).

## 4. References

- **Current Dove assets** (above) — the only authority on colour and mark.
- **Duolingo / Busuu** — studied only for how they separate a *term* from its *gloss*. Not a
  visual reference: Dove is a community, not an app; no mascots-as-UI, no gamification chrome.
- **Airmail and postage** (envelopes, stamps, postmarks) — the device vocabulary for §3.2.

## 5. Decisions

| Date | Decision | By |
|---|---|---|
| 2026-09-28 | Build a brand + design system for Dove's lesson material, and a web tool that generates the material from structured input | Benito |
| 2026-09-28 | Stack mirrors Benito's other projects (Next.js App Router, Tailwind v4, shadcn/Radix, documented in-repo) | Benito |
| 2026-09-28 | Concept **Airmail**; palette derived from the existing logo, not replaced | Benito + Claude (proposal) |
| 2026-09-28 | v1 has **no backend and no accounts**: lessons live in the teacher's browser (IndexedDB) and travel as a `.dove.json` file; PDFs are made by the browser's print engine | Claude (proposal; see architecture §3 for why) |
| 2026-09-28 | Two outputs from one lesson: **Slides** (16:9, for screen-share) and **Handout** (A4, for download/phone) | Claude (proposal) |
| 2026-09-28 | Languages are identified by name + code stamp, never by a flag alone | Claude (proposal) |

## 6. Open questions

1. **Logo source files.** Is there an SVG/AI of the mark and wordmark? Who drew them? Until
   answered, `public/brand/dove-mark-placeholder.png` is a 256 px crop of a LinkedIn screenshot.
2. **Which logo is primary** — orange globe (LinkedIn) or blue tile (Discord)? This system
   assumes orange globe on light, blue tile as the app icon.
3. **Wordmark typeface.** The banner's display face is unidentified. The system does *not*
   re-typeset the wordmark; it uses the name in the UI face until the wordmark file exists.
4. **Hosting/domain.** Is there a domain? Who owns the Vercel/GitHub account? (Needed before
   the tool is shared with teachers.)
5. **Rollout.** Who pilots it? Proposal: one Portuguese and one English teacher rebuild one past
   lesson each, report time spent vs Canva.
6. **Illustration policy.** Keep commissioning the anime-style art for marketing only? This
   system says lesson slides use the teacher's own photos/screenshots only (no stock 3D).
