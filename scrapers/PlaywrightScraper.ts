import { chromium, Browser } from "playwright";
import TurndownService from "turndown";
import { KnowledgeItem } from "../types";

const turndown = new TurndownService();

export class PlaywrightScraper {
  static async parse(url: string): Promise<KnowledgeItem[]> {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const origin = new URL(url).origin;

    console.log(`🔍 Visiting index page: ${url}`);
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Grab all anchor hrefs after render
    const rawLinks = await page.$$eval("a", (anchors) =>
      anchors.map((a) => a.href).filter((href) => !!href)
    );

    // Heuristics for real article links
    const seen = new Set<string>();
    const filteredLinks = rawLinks.filter((href) => {
      try {
        const u = new URL(href);
        const path = u.pathname;

        return (
          href.startsWith(origin) &&
          !href.includes("#") &&
          !href.includes("mailto:") &&
          !path.match(/\/(about|login|signup|terms|privacy|contact)$/i) &&
          path.split("/").filter(Boolean).length > 1 &&
          !seen.has(href) &&
          seen.add(href)
        );
      } catch {
        return false;
      }
    });

    console.log(`📚 Found ${filteredLinks.length} content links.`);

    const items: KnowledgeItem[] = [];
    for (const link of filteredLinks) {
      const item = await this.scrapeArticle(browser, link);
      if (item) items.push(item);
    }

    await browser.close();
    return items;
  }

  static async scrapeArticle(
    browser: Browser,
    url: string
  ): Promise<KnowledgeItem | null> {
    const page = await browser.newPage();
    try {
      console.log(`📝 Scraping: ${url}`);
      await page.goto(url, { waitUntil: "domcontentloaded" });

      const title = await page.title();
      const bodyHtml = await page.$eval("body", (el) => el.innerHTML);
      const markdown = turndown.turndown(bodyHtml);

      return {
        title: title || "Untitled",
        content: markdown,
        content_type: "blog",
        source_url: url,
        author: "",
        user_id: "",
      };
    } catch (err: any) {
      console.warn(`⚠️ Failed to scrape ${url}:`, err?.message || err);
      return null;
    } finally {
      await page.close();
    }
  }
}
