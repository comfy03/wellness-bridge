"use client";

import { useMemo, useState } from "react";

type Props = { topicSlug: string };

type Citation = {
  source: string;      // "SOURCE 1"
  filename: string;    // "importance_of_sleep.pdf"
  page: number;        // 3
  id: string;          // "doc::p3::c0"
  score?: number;
};

export default function AskBox({ topicSlug }: Props) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [citations, setCitations] = useState<Citation[]>([]);
  const canAsk = useMemo(() => question.trim().length >= 6 && !loading, [question, loading]);

  async function onAsk() {
    if (!canAsk) return;
    setLoading(true);
    setAnswer(null);
    setCitations([]);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        // For now the API only needs question. We still pass topicSlug so we can
        // add topic-filtering later without changing the frontend again.
        body: JSON.stringify({ question, topicSlug }),
      });

      const data = (await res.json()) as {
        answer?: string;
        citations?: Citation[];
        error?: string;
      };

      if (!res.ok) {
        setAnswer(data.error ?? "Something went wrong. Try again.");
        return;
      }

      setAnswer(data.answer ?? "No answer returned.");
      setCitations(data.citations ?? []);
    } catch {
      setAnswer("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder='e.g., “I wake up at 3am—what should I try first?”'
          className="w-full rounded-2xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={onAsk}
          disabled={!canAsk}
          className="rounded-2xl bg-foreground px-4 py-3 text-sm font-medium text-background disabled:opacity-50"
        >
          {loading ? "Thinking…" : "Ask"}
        </button>
      </div>

      {answer ? (
        <div className="mt-4 rounded-2xl border bg-muted/20 p-4">
          <div className="text-sm font-medium">Answer</div>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {answer}
          </p>

          {citations.length ? (
            <div className="mt-4">
              <div className="text-xs font-medium text-muted-foreground">Sources (PDF + page)</div>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {citations.map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-3">
                    <span>
                      <span className="font-medium text-foreground">{c.source}</span>{" "}
                      — {c.filename} (p. {c.page})
                    </span>
                    {typeof c.score === "number" ? (
                      <span className="text-xs opacity-70">{c.score.toFixed(3)}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-muted-foreground">
                PDFs are stored locally in this demo, so citations show filename + page.
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}