# Client Knowledge Scraper – Scalable Technical Knowledge Ingestor

This project is a universal web scraper designed to ingest technical content into a structured knowledgebase format. It works across a wide range of content sources including blogs, company guides, interview prep sites, and even Substack — all without hardcoded logic or source-specific tuning.

---

## ✅ Features

- 🌐 **Works on Any Blog or Guide Source**  
  Tested on:

  - Interviewing.io `/blog` and `/topics` and `/company-guides/*`
  - Substack (`shreycation.substack.com`)

- 🧠 **Smart Content Detection**  
  Automatically filters meaningful article links while skipping navigation, categories, and pagination noise.

- 📝 **Markdown Output**  
  Uses Turndown to generate clean, portable markdown from full HTML content.

- ⚙️ **Pluggable Design**  
  Clean TypeScript architecture with minimal assumptions, future-ready.

- 🔄 **End-to-End Pipeline**  
  From URL → content discovery → browser rendering → markdown extraction → structured JSON export.

---

## 📦 Usage

```bash
npx ts-node index.ts <url>
```

## Example

```
npx ts-node index.ts https://interviewing.io/topics
```

## Output Format

```
{
  "team_id": "aline123",
  "items": [
    {
      "title": "Item Title",
      "content": "Markdown content",
      "content_type": "blog",
      "source_url": "https://...",
      "author": "",
      "user_id": ""
    }
  ]
}
```
