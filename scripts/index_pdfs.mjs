import fs from "fs";
import path from "path";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const PDF_DIR = path.join(process.cwd(), "data", "pdfs");
const OUT_DIR = path.join(process.cwd(), "data", "rag");
const OUT_FILE = path.join(OUT_DIR, "index.json");

function chunkText(text, chunkSize = 1200, overlap = 200) {
  const clean = text
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const chunks = [];
  let i = 0;
  while (i < clean.length) {
    const end = Math.min(i + chunkSize, clean.length);
    chunks.push(clean.slice(i, end));
    i += chunkSize - overlap;
  }
  return chunks;
}

async function extractTextByPage(filePath) {
  const data = new Uint8Array(fs.readFileSync(filePath));
  const pdf = await pdfjsLib.getDocument({ data }).promise;

  const pages = [];
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const strings = content.items.map((it) => it.str);
    const pageText = strings.join(" ").replace(/\s+/g, " ").trim();
    pages.push({ pageNum, text: pageText });
  }
  return pages;
}

async function main() {
  console.log("PDF_DIR:", PDF_DIR);
  console.log("OUT_FILE:", OUT_FILE);

  if (!fs.existsSync(PDF_DIR)) {
    console.error("Missing folder:", PDF_DIR);
    process.exit(1);
  }
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const files = fs.readdirSync(PDF_DIR).filter((f) => f.toLowerCase().endsWith(".pdf"));
  if (files.length === 0) {
    console.error("No PDFs found in:", PDF_DIR);
    process.exit(1);
  }

  const chunksOut = [];

  for (const file of files) {
    const filePath = path.join(PDF_DIR, file);
    const docId = file.replace(/\.pdf$/i, "");

    const pages = await extractTextByPage(filePath);

    // Chunk per page (better citations!)
    let totalChunks = 0;
    for (const p of pages) {
      if (!p.text) continue;
      const chunks = chunkText(p.text);

      chunks.forEach((chunk, idx) => {
        chunksOut.push({
          id: `${docId}::p${p.pageNum}::c${idx}`,
          docId,
          filename: file,
          page: p.pageNum,
          chunkIndex: idx,
          text: chunk,
        });
      });

      totalChunks += chunks.length;
    }

    console.log(`Indexed ${file}: ${totalChunks} chunks across ${pages.length} pages`);
  }

  fs.writeFileSync(
    OUT_FILE,
    JSON.stringify({ createdAt: new Date().toISOString(), chunks: chunksOut }, null, 2)
  );
  console.log("Wrote index:", OUT_FILE);
}

main().catch((e) => {
  console.error("Indexing failed:", e);
  process.exit(1);
});