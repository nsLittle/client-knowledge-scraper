import fs from "fs-extra";
import path from "path";
import { PlaywrightScraper } from "./scrapers/PlaywrightScraper";
import { KnowledgeBase, KnowledgeItem } from "./types.js";
import { PDFParser } from "./scrapers/PDFParser";

const team_id = "aline123";

async function main() {
  const args = process.argv.slice(2);
  const items: KnowledgeItem[] = [];

  for (const input of args) {
    const fullPath = path.resolve(input);

    // If input is a directory, collect all PDFs inside it
    if (fs.statSync(fullPath).isDirectory()) {
      const files = fs.readdirSync(fullPath);
      const pdfFiles = files.filter((f) => f.toLowerCase().endsWith(".pdf"));

      for (const file of pdfFiles) {
        const filePath = path.join(fullPath, file);
        const parsed = await PDFParser.parse(filePath);
        items.push(...parsed);
      }
    }
    // If input is a URL
    else if (input.startsWith("http")) {
      const parsed = await PlaywrightScraper.parse(input);
      items.push(...parsed);
    }
    // If input is a single PDF file
    else if (input.toLowerCase().endsWith(".pdf")) {
      const parsed = await PDFParser.parse(fullPath);
      items.push(...parsed);
    }
    // Skip unsupported input
    else {
      console.warn(`⚠️ Skipping unsupported input: ${input}`);
    }
  }

  const result: KnowledgeBase = { team_id, items };

  const outPath = path.join(process.cwd(), "output.json");
  await fs.writeJson(outPath, result, { spaces: 2 });

  console.log(`✅ Scraping complete. Output saved to ${outPath}`);
}

main().catch((err) => {
  console.error("❌ Failed to scrape:", err);
  process.exit(1);
});
