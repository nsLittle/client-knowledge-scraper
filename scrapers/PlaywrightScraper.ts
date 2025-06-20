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
    if (filteredLinks.length > 0) {
      for (const link of filteredLinks) {
        const item = await this.scrapeArticle(browser, link);
        if (item) items.push(item);
      }
    } else {
      const fallbackItems = await this.clickAndScrapeCards(page, url);
      items.push(...fallbackItems);
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
      const bodyHtml = await page.$eval(
        "body",
        (el: HTMLElement) => el.innerHTML
      );
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

  static async clickAndScrapeCards(
    page: any,
    baseUrl: string
  ): Promise<KnowledgeItem[]> {
    const items: KnowledgeItem[] = [];

    const cards = await page.$$(
      'article, .card, .post-preview, .blog-card, div[data-clickable="true"]'
    );
    console.log(
      `🃏 No direct links found — trying ${cards.length} clickable content cards.`
    );

    for (let i = 0; i < cards.length; i++) {
      try {
        console.log(`➡️ Clicking card ${i + 1}/${cards.length}`);
        const [newPage] = await Promise.all([
          page.context().waitForEvent("page"),
          cards[i].click(),
        ]);

        await newPage.waitForLoadState("domcontentloaded");

        const title = await newPage.title();
        const html = await newPage.$eval(
          "body",
          (el: HTMLElement) => el.innerHTML
        );

        const markdown = new TurndownService().turndown(html);

        items.push({
          title: title || "Untitled",
          content: markdown,
          content_type: "blog",
          source_url: newPage.url(),
          author: "",
          user_id: "",
        });

        await newPage.close();
      } catch (err: any) {
        console.warn(
          `⚠️ Failed to click or scrape card ${i + 1}:`,
          err.message || err
        );
      }
    }

    return items;
  }
}
