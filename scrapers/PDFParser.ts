import fs from "fs";
import pdf from "pdf-parse";
import { KnowledgeItem } from "../types";
import axios from "axios";

export class PDFParser {
  static async parse(filePath: string): Promise<KnowledgeItem[]> {
    const buffer = fs.readFileSync(filePath);
    const data = await pdf(buffer);

    const rawText = data.text.trim();
    const chunks = this.chunkText(rawText, 1000); // ~1000 word chunks

    return chunks.map((chunk, index) => ({
      title: `PDF Chunk ${index + 1}`,
      content: chunk,
      content_type: "pdf",
      source_url: filePath,
      author: "",
      user_id: "",
    }));
  }

  private static chunkText(text: string, maxWords: number): string[] {
    const words = text.split(/\s+/);
    const chunks: string[] = [];

    for (let i = 0; i < words.length; i += maxWords) {
      const slice = words.slice(i, i + maxWords);
      chunks.push(slice.join(" "));
    }

    return chunks;
  }

  static async parseFromUrl(url: string): Promise<KnowledgeItem[]> {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const data = await pdf(response.data);
    const rawText = data.text.trim();
    const chunks = this.chunkText(rawText, 1000);

    return chunks.map((chunk, index) => ({
      title: `PDF Chunk ${index + 1}`,
      content: chunk,
      content_type: "pdf",
      source_url: url,
      author: "",
      user_id: "",
    }));
  }
}
