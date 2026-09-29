"use client"

import { useEffect, useState, type RefObject } from "react"

/**
 * Safety net for lib/lesson/fit.ts: after the preview renders, measure every slide body and
 * report which ones still overflow into the footer. Reading layout from the DOM is a real
 * external-system sync, so it lives in an effect.
 */
export function useSlideOverflow(container: RefObject<HTMLElement | null>, deps: unknown): number[] {
  const [overflowing, setOverflowing] = useState<number[]>([])

  useEffect(() => {
    const root = container.current
    if (!root) return
    const frame = requestAnimationFrame(() => {
      const bodies = Array.from(root.querySelectorAll<HTMLElement>(".slide"))
      const next = bodies.flatMap((slide) => {
        const body = slide.querySelector<HTMLElement>(".s-body")
        const index = Number(slide.dataset.index)
        return body && body.scrollHeight > body.clientHeight + 2 ? [index] : []
      })
      setOverflowing((current) => (current.join() === next.join() ? current : next))
    })
    return () => cancelAnimationFrame(frame)
  }, [container, deps])

  return overflowing
}
