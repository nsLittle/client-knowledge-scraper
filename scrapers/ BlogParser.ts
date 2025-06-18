// scrapers/BlogParser.ts

import axios from "axios";
import * as cheerio from "cheerio";
import { KnowledgeItem } from "../types";
import TurndownService from "turndown";

const turndown = new TurndownService();

export class BlogParser {
  static async parse(url: string): Promise<KnowledgeItem[]> {
    console.log(`🔍 Scraping blog index: ${url}`);
    const base = new URL(url).origin;

    const res = await axios.get(url);
    const $ = cheerio.load(res.data);

    // Grab all blog post links
    // inside BlogParser.parse()
    const links: string[] = [];
    $("a").each((_, el) => {
      const href = $(el).attr("href");
      if (!href) return;

      const full = new URL(href, base).toString();

      // Heuristic filter: looks like content page, not nav or login
      if (
        (href.startsWith("/blog/") || href.startsWith("/company-guides/")) &&
        !links.includes(full)
      ) {
        links.push(full);
      }
    });

    console.log(`📚 Found ${links.length} blog posts.`);

    // Visit each post and extract content
    const items: KnowledgeItem[] = [];
    for (const postUrl of links) {
      const post = await BlogParser.scrapePost(postUrl);
      if (post) items.push(post);
    }

    return items;
  }

  static async scrapePost(url: string): Promise<KnowledgeItem | null> {
    try {
      const res = await axios.get(url);
      const $ = cheerio.load(res.data);

      const title = $("h1").first().text().trim() || "Untitled";
      const article = $("article").html() || $("body").html() || "";
      const markdown = turndown.turndown(article);

      return {
        title,
        content: markdown,
        content_type: "blog",
        source_url: url,
        author: "", // Can fill later
        user_id: "",
      };
    } catch (err: any) {
      console.warn(`⚠️ Failed to scrape ${url}:`, err.message);
      return null;
    }
  }
}
