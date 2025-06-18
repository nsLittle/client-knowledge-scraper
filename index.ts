// index.ts

import fs from "fs-extra";
import path from "path";
import { PlaywrightScraper } from "./scrapers/PlaywrightScraper";
import { KnowledgeBase, KnowledgeItem } from "./types.js";
import { clear } from "console";
clear;
const team_id = "aline123";

async function main() {
  const args = process.argv.slice(2);
  const items: KnowledgeItem[] = [];

  for (const input of args) {
    if (input.endsWith(".pdf")) {
      const parsed = await PlaywrightScraper.parse(input);
      items.push(...parsed);
    } else if (input.startsWith("http")) {
      const parsed = await PlaywrightScraper.parse(input);

      items.push(...parsed);
    } else {
      console.warn(`Skipping unsupported input: ${input}`);
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
