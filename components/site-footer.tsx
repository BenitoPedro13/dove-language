/** The studio credit (TASK-powered-by-credit). Never on /studio or /print/*: it would print into PDFs. */
export function SiteFooter() {
  return (
    <footer className="border-t-2 border-dashed border-rule">
      <p className="mx-auto max-w-7xl px-4 py-4 text-sm text-slate sm:px-6">
        Powered by{" "}
        <a
          href="https://blessed-moon.vercel.app"
          target="_blank"
          rel="noopener"
          className="inline-flex min-h-11 items-center font-medium text-globe underline-offset-4 hover:underline"
        >
          Blessed Moon Studio
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </p>
    </footer>
  )
}
