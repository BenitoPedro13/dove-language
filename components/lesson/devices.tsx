/* eslint-disable @next/next/no-img-element -- the mark must render identically in the studio, on
   the server (/brand) and in print, without the image optimizer's lazy loading. */
import { getLanguage } from "@/lib/lesson/languages"

/** DS §3 — placeholder raster until the vector mark arrives (research §6 Q1). */
export const MARK_SRC = "/brand/dove-mark-placeholder.png"

export function DoveMark({ className = "s-mark", size }: { className?: string; size?: number }) {
  return (
    <img
      src={MARK_SRC}
      alt=""
      aria-hidden="true"
      className={className}
      width={size ?? 256}
      height={size ?? 256}
      decoding="sync"
      style={size ? { width: size, height: size } : undefined}
    />
  )
}

/** DS §6 Stamp: which language, which level. */
export function Stamp({ target, level }: { target: string; level: string }) {
  const language = getLanguage(target)
  return (
    <span className="stamp" aria-label={`${language.name}, level ${level}`}>
      <span aria-hidden="true">{language.code}</span>
      <span className="stamp-sep" aria-hidden="true" />
      <span aria-hidden="true">{level}</span>
    </span>
  )
}

/** DS §6 Postmark: which session, when. Cover and closing only. */
export function Postmark({ number, date }: { number: number | null; date: string }) {
  if (!number && !date) return null
  return (
    <div className="postmark" aria-hidden="true">
      {number ? (
        <>
          <span>Session</span>
          <span className="postmark-big">{String(number).padStart(2, "0")}</span>
        </>
      ) : null}
      {date ? <span>{formatDate(date)}</span> : null}
    </div>
  )
}

/** DS §6 Flight path: progress through the lesson. */
export function FlightPath({ index, total }: { index: number; total: number }) {
  const progress = total > 1 ? (index / (total - 1)) * 100 : 0
  return (
    <div className="flight" style={{ "--progress": `${progress}%` } as React.CSSProperties} aria-hidden="true">
      <span className="flight-done" />
      <span className="flight-dot" />
    </div>
  )
}

/** Dates are typed as ISO (yyyy-mm-dd) and printed unambiguously for an international room. */
export function formatDate(iso: string): string {
  const date = new Date(`${iso}T12:00:00Z`)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" })
}
