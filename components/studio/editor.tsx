"use client"

import { CircleAlert, Download, FileText, Presentation } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { DoveMark } from "@/components/lesson/devices"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAutosave } from "@/hooks/use-autosave"
import { useLessonDownload } from "@/hooks/use-download"
import { useLessonEditor } from "@/hooks/use-lesson-editor"
import { BLOCKS } from "@/lib/lesson/blocks"
import { lessonIssues } from "@/lib/lesson/issues"
import { paginate } from "@/lib/lesson/paginate"
import { lessonLanguages, type Lesson } from "@/lib/lesson/schema"
import { lessonTitle } from "@/lib/lesson/text"

import { BlockForm } from "./block-form"
import { Outline, SETTINGS } from "./outline"
import { Preview } from "./preview"
import { SettingsForm } from "./settings-form"

const SAVE_LABEL = { saved: "Saved on this device", saving: "Saving…", error: "Could not save — download a copy" }

export function Editor({ initial }: { initial: Lesson }) {
  const { lesson, dispatch } = useLessonEditor(initial)
  const status = useAutosave(lesson)
  const download = useLessonDownload()
  const [selected, setSelected] = useState<string>(SETTINGS)

  const languages = lessonLanguages(lesson)
  const slides = paginate(lesson)
  const issues = lessonIssues(lesson)
  const blocking = issues.some((i) => i.blocking)
  const block = lesson.blocks.find((b) => b.id === selected)

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-20 border-b border-rule bg-paper/95 backdrop-blur">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2">
          <Link href="/" className="flex min-h-11 items-center gap-2 rounded-md" aria-label="The Dove Language — my lessons">
            <DoveMark className="size-8 rounded-full" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate font-display text-lg leading-tight font-bold">{lessonTitle(lesson)}</h1>
            <p role="status" className="font-mono text-xs text-slate">
              {SAVE_LABEL[status]} · {slides.length} slides
            </p>
          </div>
          <div className="ms-auto flex flex-wrap items-center gap-2">
            {issues.length > 0 ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant={blocking ? "destructive" : "outline"}>
                    <CircleAlert /> {issues.length} to check
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Before you share</DialogTitle>
                    <DialogDescription>
                      {blocking ? "Fix the red items to make PDFs." : "These are suggestions. You can still make PDFs."}
                    </DialogDescription>
                  </DialogHeader>
                  <ul className="grid gap-2 text-sm">
                    {issues.map((issue, i) => (
                      <li key={i} className={issue.blocking ? "font-bold text-destructive" : ""}>
                        {issue.message}
                      </li>
                    ))}
                  </ul>
                </DialogContent>
              </Dialog>
            ) : null}
            <Button variant="outline" onClick={() => download(lesson)}>
              <Download /> Lesson file
            </Button>
            <PdfLink href={`/print/handout?id=${lesson.id}`} disabled={blocking} icon={<FileText />}>
              Handout PDF
            </PdfLink>
            <PdfLink href={`/print/slides?id=${lesson.id}`} disabled={blocking} icon={<Presentation />} primary>
              Slides PDF
            </PdfLink>
          </div>
        </div>
      </header>

      <div className="grid flex-1 gap-6 p-4 lg:grid-cols-[17rem_minmax(0,1fr)_minmax(0,1.1fr)]">
        <aside className="lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto lg:pe-1">
          <Outline lesson={lesson} selected={selected} onSelect={setSelected} dispatch={dispatch} />
        </aside>

        <section aria-labelledby="form-title" className="grid content-start gap-4">
          <div>
            <h2 id="form-title" className="font-display text-2xl font-bold">
              {block ? BLOCKS[block.type].label : "Lesson settings and cover"}
            </h2>
            <p className="text-sm text-slate">{block ? BLOCKS[block.type].hint : "Title, languages, level and session."}</p>
          </div>
          {block ? (
            <BlockForm
              key={block.id}
              block={block}
              languages={languages}
              onChange={(next) => dispatch({ type: "update", block: next })}
            />
          ) : (
            <SettingsForm lesson={lesson} dispatch={dispatch} />
          )}
        </section>

        <section aria-label="Preview" className="lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto">
          <Preview lesson={lesson} slides={slides} selected={selected} />
        </section>
      </div>
    </div>
  )
}

function PdfLink({
  href,
  disabled,
  icon,
  primary,
  children,
}: {
  href: string
  disabled: boolean
  icon: React.ReactNode
  primary?: boolean
  children: React.ReactNode
}) {
  if (disabled) {
    return (
      <Button variant={primary ? "default" : "outline"} disabled title="Fix the red items first">
        {icon} {children}
      </Button>
    )
  }
  return (
    <Button asChild variant={primary ? "default" : "outline"}>
      <a href={href} target="_blank" rel="noopener">
        {icon} {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </Button>
  )
}
