import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import fs from "fs";
import path from "path";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const INDEX_FILE = path.join(process.cwd(), "data", "rag", "index.json");
const OUT_FILE = path.join(process.cwd(), "data", "rag", "index.embedded.json");

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function embedBatch(texts) {
  const resp = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: texts,
  });
  return resp.data.map((d) => d.embedding);
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("Missing OPENAI_API_KEY in .env.local");
    process.exit(1);
  }

  const raw = fs.readFileSync(INDEX_FILE, "utf8");
  const data = JSON.parse(raw);

  const chunks = data.chunks;
  console.log("Chunks:", chunks.length);

  const BATCH = 64;
  for (let i = 0; i < chunks.length; i += BATCH) {
    const slice = chunks.slice(i, i + BATCH);
    const inputs = slice.map((c) => c.text);

    const embeddings = await embedBatch(inputs);
    for (let j = 0; j < slice.length; j++) {
      slice[j].embedding = embeddings[j];
    }

    console.log(`Embedded ${i}–${Math.min(i + BATCH - 1, chunks.length - 1)}`);
    await sleep(150);
  }

  fs.writeFileSync(OUT_FILE, JSON.stringify(data, null, 2));
  console.log("Wrote:", OUT_FILE);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});