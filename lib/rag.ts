import fs from "fs";
import path from "path";

export type RagChunk = {
  id: string;
  docId: string;
  filename: string;
  page: number;
  chunkIndex: number;
  text: string;
  embedding: number[];
};

type RagIndex = {
  createdAt: string;
  chunks: RagChunk[];
};

function dot(a: number[], b: number[]) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}
function norm(a: number[]) {
  return Math.sqrt(dot(a, a));
}
function cosineSim(a: number[], b: number[]) {
  return dot(a, b) / (norm(a) * norm(b) + 1e-12);
}

export function loadEmbeddedIndex(): RagIndex {
  const file = path.join(process.cwd(), "data", "rag", "index.embedded.json");
  const raw = fs.readFileSync(file, "utf8");
  return JSON.parse(raw);
}

export function retrieveTopK(queryEmbedding: number[], chunks: RagChunk[], k = 6) {
  const scored = chunks.map((c) => ({ chunk: c, score: cosineSim(queryEmbedding, c.embedding) }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k);
}