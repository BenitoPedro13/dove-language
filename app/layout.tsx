import type { Metadata } from "next"

import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { fontVariables } from "@/lib/fonts"

import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Dove Lesson Studio · The Dove Language",
    template: "%s · The Dove Language",
  },
  description:
    "Make lesson slides and study handouts for The Dove Language sessions. Type the content, get a finished deck.",
  icons: { icon: "/brand/dove-mark-placeholder.png" },
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster theme="light" position="bottom-center" />
      </body>
    </html>
  )
}
