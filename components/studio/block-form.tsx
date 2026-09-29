"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { newId } from "@/lib/lesson/blocks"
import { wordBankFor } from "@/lib/lesson/fill-blank"
import { getLanguage } from "@/lib/lesson/languages"
import type { Block, BlockOf, BlockType } from "@/lib/lesson/schema"

import { GlossFields, ImageField, ItemList, LocalizedField, TextField } from "./fields"

type FormProps<T extends BlockType> = {
  block: BlockOf<T>
  languages: string[]
  onChange: (block: Block) => void
}

/** The form for one block. Every field maps 1:1 to the schema (lib/lesson/schema.ts). */
export function BlockForm({ block, languages, onChange }: { block: Block; languages: string[]; onChange: (block: Block) => void }) {
  const props = { languages, onChange }
  switch (block.type) {
    case "objectives":
      return <ObjectivesForm block={block} {...props} />
    case "prompt":
      return <PromptForm block={block} {...props} />
    case "note":
      return <NoteForm block={block} {...props} />
    case "vocabulary":
      return <VocabularyForm block={block} {...props} />
    case "examples":
      return <ExamplesForm block={block} {...props} />
    case "spotlight":
      return <SpotlightForm block={block} {...props} />
    case "abbreviations":
      return <AbbreviationsForm block={block} {...props} />
    case "textImage":
      return <TextImageForm block={block} {...props} />
    case "gallery":
      return <GalleryForm block={block} {...props} />
    case "break":
      return <BreakForm block={block} {...props} />
    case "fillBlank":
      return <FillBlankForm block={block} {...props} />
    case "dialogue":
      return <DialogueForm block={block} {...props} />
    case "closing":
      return <ClosingForm block={block} {...props} />
  }
}

function Heading<T extends BlockType>({ block, languages, onChange }: FormProps<T>) {
  if (!("heading" in block)) return null
  return (
    <LocalizedField
      label="Slide title"
      value={block.heading}
      languages={languages}
      onChange={(heading) => onChange({ ...block, heading } as Block)}
    />
  )
}

function ObjectivesForm(p: FormProps<"objectives">) {
  const set = (patch: Partial<BlockOf<"objectives">>) => p.onChange({ ...p.block, ...patch })
  return (
    <>
      <Heading {...p} />
      <LocalizedField label="Topic" value={p.block.topic} languages={p.languages} onChange={(topic) => set({ topic })} />
      <LocalizedField
        label="What students will learn"
        value={p.block.text}
        languages={p.languages}
        multiline
        onChange={(text) => set({ text })}
      />
    </>
  )
}

function PromptForm(p: FormProps<"prompt">) {
  const set = (patch: Partial<BlockOf<"prompt">>) => p.onChange({ ...p.block, ...patch })
  return (
    <>
      <Heading {...p} />
      <LocalizedField label="Question" value={p.block.question} languages={p.languages} onChange={(question) => set({ question })} />
      <LocalizedField
        label="Extra line (optional)"
        value={p.block.detail}
        languages={p.languages}
        onChange={(detail) => set({ detail })}
      />
    </>
  )
}

function NoteForm(p: FormProps<"note">) {
  return (
    <>
      <Heading {...p} />
      <LocalizedField
        label="Text"
        hint="Short texts share one slide. Long texts get one slide per language."
        value={p.block.text}
        languages={p.languages}
        multiline
        onChange={(text) => p.onChange({ ...p.block, text })}
      />
    </>
  )
}

function VocabularyForm(p: FormProps<"vocabulary">) {
  const [target, ...glosses] = p.languages
  return (
    <>
      <Heading {...p} />
      <ItemList
        items={p.block.items}
        itemName="Word"
        create={() => ({ id: newId(), term: "", glosses: {}, note: "" })}
        onChange={(items) => p.onChange({ ...p.block, items })}
      >
        {(item, update) => (
          <>
            <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
              <TextField label={`Word · ${getLanguage(target).name}`} lang={target} value={item.term} onChange={(term) => update({ ...item, term })} />
              <TextField label="Small note (optional)" lang={target} value={item.note} onChange={(note) => update({ ...item, note })} />
            </div>
            <GlossFields value={item.glosses} tags={glosses} onChange={(g) => update({ ...item, glosses: g })} />
          </>
        )}
      </ItemList>
    </>
  )
}

function ExamplesForm(p: FormProps<"examples">) {
  const [target, ...glosses] = p.languages
  return (
    <>
      <Heading {...p} />
      <ItemList
        items={p.block.items}
        itemName="Sentence"
        create={() => ({ id: newId(), text: "", glosses: {} })}
        onChange={(items) => p.onChange({ ...p.block, items })}
      >
        {(item, update) => (
          <>
            <TextField label={`Sentence · ${getLanguage(target).name}`} lang={target} value={item.text} onChange={(text) => update({ ...item, text })} />
            <GlossFields value={item.glosses} tags={glosses} onChange={(g) => update({ ...item, glosses: g })} />
          </>
        )}
      </ItemList>
    </>
  )
}

function SpotlightForm(p: FormProps<"spotlight">) {
  const [target, ...glosses] = p.languages
  const set = (patch: Partial<BlockOf<"spotlight">>) => p.onChange({ ...p.block, ...patch })
  return (
    <>
      <Heading {...p} />
      <TextField label={`Word or expression · ${getLanguage(target).name}`} lang={target} value={p.block.term} onChange={(term) => set({ term })} />
      <LocalizedField label="Meaning" value={p.block.meaning} languages={p.languages} onChange={(meaning) => set({ meaning })} />
      <TextField label="Example sentence" lang={target} value={p.block.example} onChange={(example) => set({ example })} />
      <GlossFields value={p.block.exampleGlosses} tags={glosses} onChange={(exampleGlosses) => set({ exampleGlosses })} />
      <LocalizedField
        label="Usage note (optional)"
        hint="Shown on a yellow note, e.g. “Used in a few communities”."
        value={p.block.note}
        languages={p.languages}
        onChange={(note) => set({ note })}
      />
    </>
  )
}

function AbbreviationsForm(p: FormProps<"abbreviations">) {
  const [target, ...glosses] = p.languages
  return (
    <>
      <Heading {...p} />
      <ItemList
        items={p.block.items}
        itemName="Abbreviation"
        create={() => ({ id: newId(), short: "", full: "", meaning: {} })}
        onChange={(items) => p.onChange({ ...p.block, items })}
      >
        {(item, update) => (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField label="Short form" lang={target} value={item.short} onChange={(short) => update({ ...item, short })} placeholder="vc" />
              <TextField label="Full form (optional)" lang={target} value={item.full} onChange={(full) => update({ ...item, full })} placeholder="você" />
            </div>
            <GlossFields what="Meaning" value={item.meaning} tags={glosses} onChange={(meaning) => update({ ...item, meaning })} />
          </>
        )}
      </ItemList>
    </>
  )
}

function TextImageForm(p: FormProps<"textImage">) {
  const set = (patch: Partial<BlockOf<"textImage">>) => p.onChange({ ...p.block, ...patch })
  return (
    <>
      <Heading {...p} />
      <LocalizedField label="Subtitle" value={p.block.subheading} languages={p.languages} onChange={(subheading) => set({ subheading })} />
      <LocalizedField label="Text" value={p.block.text} languages={p.languages} multiline onChange={(text) => set({ text })} />
      <fieldset className="grid gap-3 rounded-lg border border-rule p-3">
        <legend className="px-1 text-sm font-bold">Picture (optional)</legend>
        <ImageField label="Picture" value={p.block.image} onChange={(image) => set({ image })} onRemove={() => set({ image: null })} />
        {p.block.image ? (
          <div className="grid gap-1.5">
            <span id={`${p.block.id}-side`} className="text-sm font-medium">
              Picture side
            </span>
            <ToggleGroup
              type="single"
              variant="outline"
              aria-labelledby={`${p.block.id}-side`}
              value={p.block.imageSide}
              onValueChange={(v) => v && set({ imageSide: v as "start" | "end" })}
              className="justify-start"
            >
              <ToggleGroupItem value="start">Left</ToggleGroupItem>
              <ToggleGroupItem value="end">Right</ToggleGroupItem>
            </ToggleGroup>
          </div>
        ) : null}
      </fieldset>
    </>
  )
}

function GalleryForm(p: FormProps<"gallery">) {
  return (
    <>
      <Heading {...p} />
      <p className="text-sm text-slate">Up to four pictures fit on one slide. More pictures continue on the next slide.</p>
      <ItemList
        items={p.block.items}
        itemName="Picture"
        create={() => ({ id: newId(), image: null, caption: {} })}
        onChange={(items) => p.onChange({ ...p.block, items })}
      >
        {(item, update) => (
          <>
            <ImageField label="Picture" value={item.image} onChange={(image) => update({ ...item, image })} />
            <LocalizedField label="Caption (optional)" value={item.caption} languages={p.languages} onChange={(caption) => update({ ...item, caption })} />
          </>
        )}
      </ItemList>
    </>
  )
}

function BreakForm(p: FormProps<"break">) {
  return (
    <LocalizedField label="Big title" value={p.block.title} languages={p.languages} onChange={(title) => p.onChange({ ...p.block, title })} />
  )
}

function FillBlankForm(p: FormProps<"fillBlank">) {
  const [target] = p.languages
  const set = (patch: Partial<BlockOf<"fillBlank">>) => p.onChange({ ...p.block, ...patch })
  const autoBank = wordBankFor(p.block.items.map((i) => i.sentence), "")
  return (
    <>
      <Heading {...p} />
      <LocalizedField label="Instructions" value={p.block.instructions} languages={p.languages} onChange={(instructions) => set({ instructions })} />
      <div className="rounded-lg bg-sky/60 p-3 text-sm">
        Put the answer in square brackets: <code lang={target}>Eu vou [postar] uma foto.</code> More than one correct answer?
        Use a slash: <code lang={target}>[postar/curtir]</code>.
      </div>
      <ItemList
        items={p.block.items}
        itemName="Sentence"
        create={() => ({ id: newId(), sentence: "" })}
        onChange={(items) => set({ items })}
      >
        {(item, update) => (
          <TextField label="Sentence" lang={target} value={item.sentence} onChange={(sentence) => update({ ...item, sentence })} />
        )}
      </ItemList>
      <TextField
        label="Word bank (optional)"
        lang={target}
        hint={
          autoBank.length
            ? `Separate words with commas. Leave empty to use the answers: ${autoBank.join(", ")}.`
            : "Separate words with commas. Leave empty to use the answers."
        }
        value={p.block.wordBank}
        onChange={(wordBank) => set({ wordBank })}
      />
      <div className="flex items-center gap-3">
        <Switch
          id={`${p.block.id}-answers`}
          checked={p.block.showAnswerKey}
          onCheckedChange={(showAnswerKey) => set({ showAnswerKey })}
        />
        <Label htmlFor={`${p.block.id}-answers`}>Add an answer key slide after the exercise</Label>
      </div>
    </>
  )
}

function DialogueForm(p: FormProps<"dialogue">) {
  const [target, ...glosses] = p.languages
  const set = (patch: Partial<BlockOf<"dialogue">>) => p.onChange({ ...p.block, ...patch })
  return (
    <>
      <Heading {...p} />
      <LocalizedField label="Scene (optional)" hint="e.g. “Instagram — a new post”." value={p.block.scene} languages={p.languages} onChange={(scene) => set({ scene })} />
      <p className="text-sm text-slate">The dialogue is shown first in {getLanguage(target).name}, then each translation on its own slides.</p>
      <ItemList
        items={p.block.lines}
        itemName="Line"
        create={() => ({
          id: newId(),
          // New lines alternate between the first two speakers, which is what dialogues usually do.
          speaker: p.block.lines.length >= 2 ? p.block.lines[p.block.lines.length - 2].speaker : "",
          text: "",
          glosses: {},
        })}
        onChange={(lines) => set({ lines })}
      >
        {(line, update) => (
          <>
            <div className="grid gap-3 sm:grid-cols-[8rem_1fr]">
              <TextField label="Speaker" value={line.speaker} onChange={(speaker) => update({ ...line, speaker })} />
              <TextField label={`Line · ${getLanguage(target).name}`} lang={target} value={line.text} onChange={(text) => update({ ...line, text })} />
            </div>
            <GlossFields value={line.glosses} tags={glosses} onChange={(g) => update({ ...line, glosses: g })} />
          </>
        )}
      </ItemList>
    </>
  )
}

function ClosingForm(p: FormProps<"closing">) {
  const set = (patch: Partial<BlockOf<"closing">>) => p.onChange({ ...p.block, ...patch })
  return (
    <>
      <LocalizedField label="Big title" value={p.block.title} languages={p.languages} onChange={(title) => set({ title })} />
      <LocalizedField label="Message" value={p.block.message} languages={p.languages} onChange={(message) => set({ message })} />
      <TextField
        label="Next steps (one per line)"
        hint="e.g. “Download this lesson in #lesson-resources”. No emoji — they look different on every computer."
        multiline
        value={p.block.nextSteps}
        onChange={(nextSteps) => set({ nextSteps })}
      />
    </>
  )
}
