# Wellness Bridge

Wellness Bridge is a research-grounded micro-intervention assistant that connects curated PDF sources to practical, plain-language guidance.

It retrieves relevant excerpts from a local PDF knowledge base and generates structured, actionable responses, with transparent citations.


## Current Functionality

### Topic Pages

Each topic (e.g., Sleep) includes:

- **Curated research**
  - Pulled from embedded PDF excerpts
  - Displays filename + page
  - Grounded in local documents only

- **Micro-interventions**
  - Short, practical steps
  - Designed to be low-friction and immediately usable
  - Structured as:
    - What it is  
    - Why it helps  
    - Try this  

###  Ask Wellness Bridge (RAG-powered Q&A)

Users can ask questions such as:

- “When should I go to sleep?”
- “I wake up too early,  what should I try?”

The system:

1. Embeds the question using `text-embedding-3-small`
2. Retrieves top relevant PDF chunks via similarity search
3. Passes only those chunks to the language model
4. Generates a structured, grounded response

All responses follow this required structure:

1. **Summary**
2. **Try this first**
3. **Why this helps**
4. **If it keeps happening**
5. **Sources** (PDF filename + page only)

The model is explicitly instructed to:

- Use only provided sources
- Avoid diagnosis
- Stay concise (~220 words)
- Prefer actionable steps over general advice
- Avoid inline citation clutter


## Architecture

### Retrieval-Augmented Generation (RAG)

```
User Question
   ↓
Embed (OpenAI)
   ↓
Similarity search over local PDF index
   ↓
Top K chunks retrieved
   ↓
Structured system prompt + chunks
   ↓
Grounded, cited response
```

### Stack

- **Next.js (App Router)**
- **TypeScript**
- **OpenAI (Embeddings + Chat Completions)**
- **Local vector index**
- **Tailwind CSS** (custom wellness aesthetic)

---

## Transparency Model

Each response includes:

- A clean “Sources” section (filename + page)
- Optional debug citation scores (development mode only)
- Local-only document storage, hot to expand to external medical databases.


## Design Philosophy

The UI aims to feel:

- Calm, not clinical  
- Structured, not overwhelming  
- Evidence-grounded, not academic  
- Transparent, not technical  

The goal is to bridge research and behavior change without cognitive overload.

## Current Limitations

- Small PDF corpus
- No user memory or personalization
- No longitudinal tracking
- Single-turn responses only
- Chunk ranking based only on similarity score
- No strength-of-evidence tagging

## Future Vision

### Short-Term

- Collapsible citation transparency
- Expand topic library (Sleep, Anxiety, Mood, etc.)
- Add 2–4 curated sources per topic
- Improve micro-intervention clarity
- Smarter chunk deduplication

### Medium-Term

- User profiles
- Saved interventions
- Behavioral tracking
- “Try tonight” personalization
- Intervention effectiveness feedback loop

### Long-Term

- Research-to-intervention mapping engine
- Evidence strength tagging
- Structured knowledge graph
- Gentle AI behavior-change coaching
- Multi-turn conversational grounding
- Risk flagging + escalation pathways (non-diagnostic)


## Ethical Position

- Educational only  
- No diagnosis  
- No replacement for medical care  
- Grounded strictly in provided PDFs  
- Transparent sourcing  

Wellness Bridge is designed to reduce friction between research and real-life behavior but not replace clinicians.

## Why This Exists

There is often a gap between:

- Research papers, and what someone can realistically do tonight especially withing underrepresented and overlooked communities. 

Wellness Bridge attempts to narrow that gap.