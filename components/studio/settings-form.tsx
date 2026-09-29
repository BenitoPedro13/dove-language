"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { LessonDispatch } from "@/hooks/use-lesson-editor"
import { LANGUAGES, LEVELS } from "@/lib/lesson/languages"
import { lessonLanguages, type Lesson } from "@/lib/lesson/schema"

import { LocalizedField, TextField } from "./fields"

const NONE = "none"

/** Cover, stamp and postmark all read from here (DS §6, §9 "Cover"). */
export function SettingsForm({ lesson, dispatch }: { lesson: Lesson; dispatch: LessonDispatch }) {
  const languages = lessonLanguages(lesson)
  const [gloss1 = NONE, gloss2 = NONE] = lesson.glosses

  function setGlosses(first: string, second: string) {
    const glosses = [first, second].filter((g) => g !== NONE)
    dispatch({ type: "languages", target: lesson.target, glosses: [...new Set(glosses)] })
  }

  return (
    <>
      <LocalizedField
        label="Lesson title"
        value={lesson.title}
        languages={languages}
        onChange={(title) => dispatch({ type: "patch", patch: { title } })}
      />

      <fieldset className="grid gap-3 rounded-lg border border-rule p-3">
        <legend className="px-1 text-sm font-bold">Languages and level</legend>
        <LanguageSelect
          label="Language you teach"
          value={lesson.target}
          onChange={(target) => dispatch({ type: "languages", target, glosses: lesson.glosses })}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <LanguageSelect label="Translation 1" value={gloss1} allowNone exclude={lesson.target} onChange={(v) => setGlosses(v, gloss2)} />
          <LanguageSelect
            label="Translation 2"
            value={gloss2}
            allowNone
            exclude={lesson.target}
            disabled={gloss1 === NONE}
            onChange={(v) => setGlosses(gloss1, v)}
          />
        </div>
        <p className="text-xs text-slate">
          Changing a language keeps what you typed. Switch back and your text is still there.
        </p>
        <div className="grid gap-1.5">
          <Label htmlFor="lesson-level">Level</Label>
          <Select value={lesson.level} onValueChange={(level) => dispatch({ type: "patch", patch: { level } })}>
            <SelectTrigger id="lesson-level" className="w-full bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </fieldset>

      <fieldset className="grid gap-3 rounded-lg border border-rule p-3">
        <legend className="px-1 text-sm font-bold">Session (optional — shown on the postmark)</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField
            label="Session number"
            value={lesson.session.number ? String(lesson.session.number) : ""}
            onChange={(value) => {
              const number = Number.parseInt(value, 10)
              dispatch({
                type: "patch",
                patch: { session: { ...lesson.session, number: Number.isFinite(number) && number > 0 ? number : null } },
              })
            }}
          />
          <div className="grid gap-1.5">
            <Label htmlFor="lesson-date">Date</Label>
            <input
              id="lesson-date"
              type="date"
              value={lesson.session.date}
              onChange={(e) => dispatch({ type: "patch", patch: { session: { ...lesson.session, date: e.target.value } } })}
              className="min-h-11 rounded-md border border-input bg-white px-3 text-sm"
            />
          </div>
        </div>
        <TextField
          label="Host"
          hint="The name you use on Discord."
          value={lesson.session.host}
          onChange={(host) => dispatch({ type: "patch", patch: { session: { ...lesson.session, host } } })}
        />
      </fieldset>

      <div className="grid gap-1.5">
        <span id="theme-label" className="text-sm font-bold">
          Slide colours
        </span>
        <ToggleGroup
          type="single"
          variant="outline"
          aria-labelledby="theme-label"
          value={lesson.theme}
          onValueChange={(theme) => theme && dispatch({ type: "patch", patch: { theme: theme as Lesson["theme"] } })}
          className="justify-start"
        >
          <ToggleGroupItem value="paper">Paper (light)</ToggleGroupItem>
          <ToggleGroupItem value="night">Night (dark)</ToggleGroupItem>
        </ToggleGroup>
        <p className="text-xs text-slate">Night is easier on the eyes when you screen-share in Discord at night. The handout is always light.</p>
      </div>
    </>
  )
}

function LanguageSelect({
  label,
  value,
  onChange,
  allowNone,
  exclude,
  disabled,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  allowNone?: boolean
  exclude?: string
  disabled?: boolean
}) {
  const id = `lang-${label.replace(/\W+/g, "-").toLowerCase()}`
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id={id} className="w-full bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {allowNone ? <SelectItem value={NONE}>None</SelectItem> : null}
          {LANGUAGES.filter((l) => l.tag !== exclude).map((language) => (
            <SelectItem key={language.tag} value={language.tag}>
              {language.name} · <span lang={language.tag}>{language.endonym}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
