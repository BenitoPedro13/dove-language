"use client"

import { ArrowDown, ArrowUp, ImagePlus, Plus, Trash2 } from "lucide-react"
import { useId, useState, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { prepareImage } from "@/lib/images"
import { dirOf, getLanguage } from "@/lib/lesson/languages"
import type { LessonImage, Localized } from "@/lib/lesson/schema"

/* Every field is a real <label> + native input: keyboard and screen readers work for free. */

export function TextField({
  label,
  value,
  onChange,
  lang,
  multiline,
  hint,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  lang?: string
  multiline?: boolean
  hint?: string
  placeholder?: string
}) {
  const id = useId()
  const hintId = `${id}-hint`
  const common = {
    id,
    value,
    lang,
    dir: lang ? dirOf(lang) : undefined,
    placeholder,
    "aria-describedby": hint ? hintId : undefined,
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
  }
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {multiline ? <Textarea {...common} rows={3} className="bg-white" /> : <Input {...common} className="bg-white" />}
      {hint ? (
        <p id={hintId} className="text-xs text-slate">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

/** One input per lesson language, target first (architecture §2). */
export function LocalizedField({
  label,
  value,
  languages,
  onChange,
  multiline,
  hint,
}: {
  label: string
  value: Localized
  languages: string[]
  onChange: (value: Localized) => void
  multiline?: boolean
  hint?: string
}) {
  return (
    <fieldset className="grid gap-3 rounded-lg border border-rule p-3">
      <legend className="px-1 text-sm font-bold">{label}</legend>
      {hint ? <p className="-mt-1 text-xs text-slate">{hint}</p> : null}
      {languages.map((tag) => (
        <TextField
          key={tag}
          label={getLanguage(tag).name}
          lang={tag}
          value={value[tag] ?? ""}
          multiline={multiline}
          onChange={(text) => onChange({ ...value, [tag]: text })}
        />
      ))}
    </fieldset>
  )
}

/** Translations of one item into the gloss languages, side by side. */
export function GlossFields({
  value,
  tags,
  onChange,
  what = "Translation",
}: {
  value: Localized
  tags: string[]
  onChange: (value: Localized) => void
  what?: string
}) {
  if (tags.length === 0) return null
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {tags.map((tag) => (
        <TextField
          key={tag}
          label={`${what} · ${getLanguage(tag).name}`}
          lang={tag}
          value={value[tag] ?? ""}
          onChange={(text) => onChange({ ...value, [tag]: text })}
        />
      ))}
    </div>
  )
}

/** A list of items with add, move and remove — buttons, not drag and drop (architecture §5). */
export function ItemList<T extends { id: string }>({
  items,
  onChange,
  create,
  itemName,
  children,
}: {
  items: T[]
  onChange: (items: T[]) => void
  create: () => T
  itemName: string
  children: (item: T, update: (item: T) => void, index: number) => ReactNode
}) {
  function move(index: number, delta: number) {
    const to = index + delta
    if (to < 0 || to >= items.length) return
    const next = [...items]
    ;[next[index], next[to]] = [next[to], next[index]]
    onChange(next)
  }

  return (
    <div className="grid gap-3">
      <ol className="grid gap-3">
        {items.map((item, index) => (
          <li key={item.id} className="grid gap-3 rounded-lg border border-rule bg-paper p-3">
            <div className="flex items-center gap-1">
              <span className="me-auto font-mono text-xs tracking-wider text-slate uppercase">
                {itemName} {index + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Move ${itemName.toLowerCase()} ${index + 1} up`}
                disabled={index === 0}
                onClick={() => move(index, -1)}
              >
                <ArrowUp />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Move ${itemName.toLowerCase()} ${index + 1} down`}
                disabled={index === items.length - 1}
                onClick={() => move(index, 1)}
              >
                <ArrowDown />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Remove ${itemName.toLowerCase()} ${index + 1}`}
                onClick={() => onChange(items.filter((i) => i.id !== item.id))}
              >
                <Trash2 />
              </Button>
            </div>
            {children(item, (next) => onChange(items.map((i) => (i.id === item.id ? next : i))), index)}
          </li>
        ))}
      </ol>
      <Button type="button" variant="outline" className="justify-self-start" onClick={() => onChange([...items, create()])}>
        <Plus /> Add {itemName.toLowerCase()}
      </Button>
    </div>
  )
}

/** Picks a picture, shrinks it in the browser (DS §7) and asks for its description. */
export function ImageField({
  label,
  value,
  onChange,
  onRemove,
}: {
  label: string
  value: LessonImage | null
  onChange: (image: LessonImage) => void
  onRemove?: () => void
}) {
  const id = useId()
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function pick(file: File | undefined) {
    if (!file) return
    setBusy(true)
    setError(null)
    try {
      const prepared = await prepareImage(file)
      onChange({ ...prepared, alt: value?.alt ?? "" })
    } catch (e) {
      setError(e instanceof Error ? e.message : "This picture could not be used.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element -- a local data URL preview
          <img src={value.src} alt="" className="h-20 w-28 rounded-md border border-rule bg-white object-contain" />
        ) : null}
        <label
          htmlFor={id}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-input bg-white px-4 text-sm font-medium focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-globe hover:bg-paper-deep"
        >
          <ImagePlus className="size-4" aria-hidden="true" />
          {busy ? "Preparing…" : value ? `Replace ${label.toLowerCase()}` : `Choose ${label.toLowerCase()}`}
          <input
            id={id}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              void pick(e.target.files?.[0])
              e.target.value = ""
            }}
          />
        </label>
        {value && onRemove ? (
          <Button type="button" variant="ghost" onClick={onRemove}>
            <Trash2 /> Remove
          </Button>
        ) : null}
      </div>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      {value ? (
        <TextField
          label="Describe the picture (required)"
          hint="For students who use a screen reader. Say what matters, e.g. “Orkut profile page from 2008”."
          value={value.alt}
          onChange={(alt) => onChange({ ...value, alt })}
        />
      ) : null}
    </div>
  )
}
