"use client"

import { BookOpen, FilePlus2, FolderOpen, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useId, useState } from "react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDate } from "@/components/lesson/devices"
import { useLessonDrafts } from "@/hooks/use-lesson-drafts"
import { createLesson, newId } from "@/lib/lesson/blocks"
import { EXAMPLE_LESSON } from "@/lib/lesson/example"
import { LANGUAGES, LEVELS, getLanguage } from "@/lib/lesson/languages"
import type { Lesson } from "@/lib/lesson/schema"
import { parseLessonFile, saveLesson } from "@/lib/lesson/storage"

/** Start a lesson, open a lesson file, or continue a draft saved in this browser. */
export function StartPanel() {
  const router = useRouter()
  const { drafts, remove } = useLessonDrafts()
  const fileId = useId()

  async function open(lesson: Lesson) {
    await saveLesson(lesson)
    router.push(`/studio?id=${lesson.id}`)
  }

  async function importFile(file: File | undefined) {
    if (!file) return
    const result = parseLessonFile(await file.text())
    if (!result.ok) {
      toast.error("Could not open this file", { description: result.error })
      return
    }
    // A fresh id, so opening the same file twice never overwrites a draft you changed.
    await open({ ...result.lesson, id: newId(), updatedAt: new Date().toISOString() })
  }

  return (
    <div className="grid gap-10">
      <div className="grid gap-3 sm:grid-cols-3">
        <NewLessonDialog onCreate={open} />
        <label
          htmlFor={fileId}
          className="grid min-h-28 cursor-pointer content-start gap-1 rounded-xl border border-rule bg-white p-5 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-globe hover:border-globe"
        >
          <FolderOpen className="size-6 text-globe" aria-hidden="true" />
          <span className="font-display text-lg font-bold">Open a lesson file</span>
          <span className="text-sm text-slate">A .dove.json file from a co-teacher or another computer.</span>
          <input
            id={fileId}
            type="file"
            accept=".json,application/json"
            className="sr-only"
            onChange={(e) => {
              void importFile(e.target.files?.[0])
              e.target.value = ""
            }}
          />
        </label>
        <button
          type="button"
          onClick={() => open({ ...structuredClone(EXAMPLE_LESSON), id: newId(), updatedAt: new Date().toISOString() })}
          className="grid min-h-28 content-start gap-1 rounded-xl border border-rule bg-white p-5 text-start hover:border-globe"
        >
          <BookOpen className="size-6 text-globe" aria-hidden="true" />
          <span className="font-display text-lg font-bold">Try the example</span>
          <span className="text-sm text-slate">A real Portuguese session about social media, ready to edit.</span>
        </button>
      </div>

      <section aria-labelledby="drafts-title">
        <h2 id="drafts-title" className="font-display text-2xl font-bold">
          My lessons
        </h2>
        <p className="mt-1 text-sm text-slate">
          Saved in this browser only. Download a lesson file from the studio to keep a copy or share it.
        </p>
        {drafts === null ? (
          <p className="mt-4 text-slate" role="status">
            Loading…
          </p>
        ) : drafts.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-rule p-6 text-slate">No lessons yet.</p>
        ) : (
          <ul className="mt-4 grid gap-2">
            {drafts.map((draft) => (
              <li key={draft.id} className="flex items-center gap-2 rounded-xl border border-rule bg-white p-2 ps-4">
                <a href={`/studio?id=${draft.id}`} className="grid min-h-11 flex-1 content-center rounded-md hover:text-globe">
                  <span className="font-bold">{draft.title}</span>
                  <span className="font-mono text-xs text-slate">
                    {getLanguage(draft.target).code} · {draft.level} · edited {formatDate(draft.updatedAt.slice(0, 10))}
                  </span>
                </a>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label={`Delete ${draft.title}`}>
                      <Trash2 />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete “{draft.title}”?</AlertDialogTitle>
                      <AlertDialogDescription>
                        It will be removed from this browser. This cannot be undone. Lesson files you downloaded are
                        not affected.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep it</AlertDialogCancel>
                      <AlertDialogAction onClick={() => void remove(draft.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function NewLessonDialog({ onCreate }: { onCreate: (lesson: Lesson) => Promise<void> }) {
  const [target, setTarget] = useState("pt-BR")
  const [gloss, setGloss] = useState("en")
  const [level, setLevel] = useState<string>("A1–A2")

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="grid min-h-28 content-start gap-1 rounded-xl border-2 border-globe bg-sky p-5 text-start hover:bg-sky/70"
        >
          <FilePlus2 className="size-6 text-globe" aria-hidden="true" />
          <span className="font-display text-lg font-bold">New lesson</span>
          <span className="text-sm text-ink">Start from an empty lesson.</span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New lesson</DialogTitle>
          <DialogDescription>You can change all of this later in Lesson settings.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Picker id="new-target" label="Language you teach" value={target} onChange={setTarget} options={LANGUAGES.map((l) => [l.tag, l.name])} />
          <Picker
            id="new-gloss"
            label="Translate into"
            value={gloss}
            onChange={setGloss}
            options={[["none", "No translation"], ...LANGUAGES.filter((l) => l.tag !== target).map((l) => [l.tag, l.name] as [string, string])]}
          />
          <Picker id="new-level" label="Level" value={level} onChange={setLevel} options={LEVELS.map((l) => [l, l])} />
        </div>
        <DialogFooter>
          <Button onClick={() => void onCreate(createLesson(target, gloss === "none" || gloss === target ? [] : [gloss], level))}>
            Create lesson
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Picker({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  options: [string, string][]
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="w-full bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map(([v, text]) => (
            <SelectItem key={v} value={v}>
              {text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
