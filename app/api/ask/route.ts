import { NextResponse } from "next/server";
import OpenAI from "openai";
import { loadEmbeddedIndex, retrieveTopK } from "@/lib/rag";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `
You are Wellness Bridge — a calm, practical, research-grounded wellness assistant (educational only).

Hard rules:
- Use ONLY the provided sources for factual claims.
- Do NOT diagnose. Do NOT mention disorders unless the sources explicitly mention them.
- If the sources don’t support an answer, say: "I don’t have enough information in the provided PDFs to answer that."

Write style:
- Plain language. Warm, concise. No lecture tone.
- Max ~220 words unless the user asks for detail.
- Prefer 3–5 highly actionable steps over long lists.

Required structure (use these headings):
1) Summary (1–2 sentences)
2) Try this first (3–5 bullets max)
3) Why this helps (1 short paragraph)
4) If it keeps happening (1–2 sentences)
5) Sources (list filenames + pages; no inline [SOURCE X] brackets)

Citations:
- Do NOT use [SOURCE 1] in the body.
- In "Sources", list the specific PDFs + page numbers you relied on (e.g., "importance_of_sleep.pdf (p.2–3)").
`.trim();

export async function POST(req: Request) {
  const body = (await req.json()) as { question?: string };
  const question = body.question?.trim();

  if (!question) {
    return NextResponse.json({ error: "Missing question" }, { status: 400 });
  }

  const index = loadEmbeddedIndex();

  // 1) Embed the question
  const q = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: question,
  });
  const queryEmbedding = q.data[0]?.embedding;

  if (!queryEmbedding) {
    return NextResponse.json({ error: "Embedding failed" }, { status: 500 });
  }

  // 2) Retrieve top chunks
  const top = retrieveTopK(queryEmbedding, index.chunks, 6);

  // 3) Build sources for the model (clean, parseable fields)
  const sourcesText = top
    .map(
      (t, i) =>
        `SOURCE ${i + 1}
FILENAME: ${t.chunk.filename}
PAGE: ${t.chunk.page}
TEXT:
${t.chunk.text}`.trim()
    )
    .join("\n\n---\n\n");

  // Helpful list for the model to cite cleanly
  const sourceList = top
    .map((t, i) => `SOURCE ${i + 1}: ${t.chunk.filename} (p.${t.chunk.page})`)
    .join("\n");

  // 4) Answer using only sources + improved format
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Question: ${question}

Available sources:
${sourceList}

Source excerpts:
${sourcesText}`.trim(),
      },
    ],
  });

  const answer = completion.choices[0]?.message?.content ?? "No answer.";

  // Dev-only: include detailed citation debug info (scores, ids, etc.)
  const includeDebugCitations = process.env.NODE_ENV !== "production";

  const debugCitations = top.map((t, i) => ({
    source: `SOURCE ${i + 1}`,
    filename: t.chunk.filename,
    page: t.chunk.page,
    id: t.chunk.id,
    score: t.score,
  }));

  // Build response payload
  const payload: Record<string, unknown> = {
    answer,
    indexCreatedAt: index.createdAt,
  };

  if (includeDebugCitations) {
    payload.citations = debugCitations;
  }

  return NextResponse.json(payload);
}