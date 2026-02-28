import Link from "next/link";
import { getTopic } from "../../data/topics";
import AskBox from "./AskBox";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopic(slug);

  if (!topic) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <p className="text-sm text-muted-foreground">Topic not found.</p>
          <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
            ← Back
          </Link>
        </div>
      </main>
    );
  }

  const researchCount = topic.research?.length ?? 0;
  const interventionCount = topic.interventions?.length ?? 0;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:underline">
          ← Back
        </Link>

        {/* Header */}
        <header className="mt-6">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {topic.title}
          </h1>

          <p className="mt-2 max-w-3xl text-muted-foreground">
            {topic.description_basic}
          </p>

          {/* Meta chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border bg-card px-3 py-1">
              {researchCount} source{researchCount === 1 ? "" : "s"}
            </span>
            <span className="rounded-full border bg-card px-3 py-1">
              {interventionCount} micro-intervention{interventionCount === 1 ? "" : "s"}
            </span>
            <span className="rounded-full border bg-card px-3 py-1">
              Educational only
            </span>
          </div>
        </header>

        {/* Ask (make this feel primary) */}
        <section className="mt-8 card p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-base font-semibold">Ask Wellness Bridge</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ask a question. The response uses this topic’s curated research + interventions.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <AskBox topicSlug={topic.slug} />
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border bg-muted/20 px-3 py-1">
              e.g., “I wake up at 3am—what should I try first?”
            </span>
            <span className="rounded-full border bg-muted/20 px-3 py-1">
              e.g., “How do I fall asleep faster?”
            </span>
            <span className="rounded-full border bg-muted/20 px-3 py-1">
              e.g., “What’s a good wind-down routine?”
            </span>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Educational only. Not diagnosis or medical advice.
          </p>
        </section>

        {/* Two columns */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Research */}
          <section className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Curated research</h2>
              <span className="rounded-full border bg-muted/20 px-3 py-1 text-xs text-muted-foreground">
                {researchCount ? "Active" : "Coming soon"}
              </span>
            </div>

            {researchCount === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Coming soon — add 2–4 sources for this topic.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {topic.research.map((r) => (
                  <li key={r.id} className="rounded-2xl border bg-muted/20 p-4">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-sm font-medium text-blue-600 hover:underline"
                    >
                      {r.title}
                    </a>

                    {/* Takeaways as “What it suggests” */}
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      <span className="font-medium text-foreground">What it suggests: </span>
                      {r.takeaways}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full border bg-background px-2 py-0.5">
                        Source ID: {r.id}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Interventions */}
          <section className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Micro-interventions</h2>
              <span className="rounded-full border bg-muted/20 px-3 py-1 text-xs text-muted-foreground">
                {interventionCount ? "Try one tonight" : "Coming soon"}
              </span>
            </div>

            {interventionCount === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Coming soon — add intervention cards for this topic.
              </p>
            ) : (
              <div className="mt-4 grid gap-3">
                {topic.interventions.map((i) => (
                  <div key={i.id} className="rounded-2xl border bg-muted/20 p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-sm font-semibold">{i.name}</div>

                      {typeof i.time_cost_minutes === "number" && (
                        <span className="rounded-full border bg-background px-2 py-0.5 text-xs text-muted-foreground">
                          {i.time_cost_minutes} min
                        </span>
                      )}
                      {i.cost && (
                        <span className="rounded-full border bg-background px-2 py-0.5 text-xs text-muted-foreground">
                          {i.cost}
                        </span>
                      )}
                    </div>

                    {/* Optional: “Best for” if you add it later */}
                    {/* <p className="mt-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">Best for:</span> racing thoughts
                    </p> */}

                    <p className="mt-3 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">What it is: </span>
                      {i.what_it_is}
                    </p>

                    <p className="mt-2 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Why it helps: </span>
                      {i.why_it_helps_basic}
                    </p>

                    <div className="mt-4">
                      <div className="text-sm font-medium">Try this:</div>

                      {/* Checkbox-style steps */}
                      <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                        {i.steps.map((s, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border bg-background text-[10px] text-muted-foreground">
                              {idx + 1}
                            </span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {i.source_ids?.length ? (
                      <div className="mt-4 text-xs text-muted-foreground">
                        Supported by: {i.source_ids.join(", ")}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <footer className="mt-10 text-xs text-muted-foreground">
          Educational only. Not diagnosis or medical advice.
        </footer>
      </div>
    </main>
  );
}