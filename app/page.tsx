import Link from "next/link";
import { TOPICS } from "./data/topics";

export default function HomePage() {
  return (
    <main className="min-h-screen text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Soft badge */}
        <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-amber-400/80" />
          Grounded in your curated research library
        </div>

        {/* Hero */}
        <header className="mt-6 mb-10 flex flex-col items-center text-center">
  <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
    Wellness Bridge
  </h1>

  <p className="mt-3 max-w-2xl mx-auto text-base leading-relaxed text-muted-foreground">
    Research-backed micro-interventions and plain-language guidance.
    Ask questions and get research backed answers.
  </p>

  <div className="mt-6 flex flex-wrap justify-center gap-3">
    <a
      href="#topics"
      className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background"
    >
      Explore topics
    </a>
    <div className="rounded-full border bg-card px-4 py-2 text-sm text-muted-foreground">
      Educational only • Not medical advice
    </div>
  </div>
</header>

        <div className="mb-10 h-px bg-muted/20" />

        {/* Topics */}
        <section id="topics" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {TOPICS.map((t) => {
            const isLive = t.research.length > 0 || t.interventions.length > 0;

            const Card = (
              <div className={`card card-hover p-6 ${isLive ? "" : "opacity-70"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="text-lg font-medium">{t.title}</div>
                  <span className="rounded-full border bg-muted/20 px-3 py-1 text-xs text-muted-foreground">
                    {isLive ? "Open →" : "Coming soon"}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t.description_basic}
                </p>

                <div className="mt-6 text-sm">
                  <span className={isLive ? "text-blue-600" : "text-muted-foreground"}>
                    {isLive ? "Explore topic" : "Add PDFs to enable"}
                  </span>
                </div>
              </div>
            );

            return isLive ? (
              <Link key={t.slug} href={`/topic/${t.slug}`} className="block">
                {Card}
              </Link>
            ) : (
              <div key={t.slug}>{Card}</div>
            );
          })}
        </section>

        <footer className="mt-12 text-xs text-muted-foreground">
          Educational only. Not diagnosis or medical advice.
        </footer>
      </div>
    </main>
  );
}