import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { PrintView, type PrintFormat } from "@/components/studio/print-view"

export const metadata: Metadata = { title: "Print", robots: { index: false } }

const FORMATS: PrintFormat[] = ["slides", "handout"]

export function generateStaticParams() {
  return FORMATS.map((format) => ({ format }))
}

export const dynamicParams = false

export default async function PrintPage({ params }: { params: Promise<{ format: string }> }) {
  const { format } = await params
  if (!FORMATS.includes(format as PrintFormat)) notFound()
  return (
    <Suspense fallback={<p className="p-8">Preparing…</p>}>
      <PrintView format={format as PrintFormat} />
    </Suspense>
  )
}
