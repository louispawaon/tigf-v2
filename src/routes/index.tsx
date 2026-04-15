import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="island-shell rounded-2xl p-8 sm:p-10">
        <p className="island-kicker mb-2">Project scaffold</p>
        <h1 className="display-title text-3xl font-semibold text-foreground sm:text-4xl">
          Ready for implementation
        </h1>
      </section>
    </main>
  )
}
