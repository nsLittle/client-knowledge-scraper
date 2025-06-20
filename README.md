Here’s a clean, complete `README.md` flow based on your outline — refined, formatted, and submission-ready:

---

````markdown
# Client Knowledge Scraper – Scalable Technical Knowledge Ingestor

This project is a universal web scraper designed to ingest technical content into a structured knowledgebase format. It works across a wide range of content sources including blogs, company guides, interview prep sites, and even Substack — all without hardcoded logic or source-specific tuning.

---

## ✅ Features

- 🌐 **Works on Any Blog or Guide Source**  
  Tested on:

  - Interviewing.io `/blog`, `/topics`, and `/company-guides/*`
  - Interviewing.io interview guides (`/learn#interview-guides`)
  - Nil Mamano’s DS&A blog posts
  - Substack (`shreycation.substack.com`)
  - Supports Quill, Dev.to, and others — no custom logic required

- 🧠 **Smart Content Detection**  
  Automatically filters meaningful article links while skipping navigation, category, and pagination noise.

- 📄 **PDF Chunking**  
  Automatically chunks long PDFs (e.g. books or guides) into ~1000-word segments for AI-ready ingestion.

- 📝 **Markdown Output**  
  Uses Turndown to convert full-page HTML into clean, portable Markdown.

- ⚙️ **Pluggable TypeScript Design**  
  No custom scrapers required per customer — future-ready architecture.

- 🔄 **End-to-End Pipeline**  
  From `URL` or `PDF path` → content discovery → browser rendering → Markdown extraction → JSON knowledgebase export.

---

## 📦 Usage

```bash
npx ts-node index.ts <url-or-local-pdf-path>
```
````

### Examples

```bash
npx ts-node index.ts https://interviewing.io/topics
npx ts-node index.ts https://quill.co/blog
npx ts-node index.ts ./pdfs/aline-book.pdf
```

---

## 🧾 Output Format

```json
{
  "team_id": "aline123",
  "items": [
    {
      "title": "Item Title",
      "content": "Markdown content",
      "content_type": "blog|pdf|other",
      "source_url": "optional-url-or-path",
      "author": "",
      "user_id": ""
    }
  ]
}
```

---

## 📤 Exporting Scraped Content to Markdown

Once you've scraped content into `output.json`, you can convert each item into a standalone `.md` file.

### ✅ Convert to Markdown

```bash
npx ts-node json-to-md.ts
```

This creates a `markdown-output/` folder with one file per item:

```
markdown-output/
├── 1_pdf_chunk_1.md
├── 2_pdf_chunk_2.md
...
```

Each file contains:

```markdown
# PDF Chunk 1

[converted markdown content]
```

Useful for:

- Manual review
- AI prompt engineering
- Knowledgebase ingestion

**Built to scale with your customers — not just Aline.**

```

```
