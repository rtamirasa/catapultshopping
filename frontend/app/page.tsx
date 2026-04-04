export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-50 px-6 py-16 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="max-w-lg text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
          AisleIQ
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Consumer app
        </h1>
        <p className="mt-4 text-pretty text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          Next.js frontend for the AisleIQ consumer experience. Replace this page
          with screens from your v0 build or design system.
        </p>
      </div>
    </div>
  );
}
