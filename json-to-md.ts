import fs from "fs-extra";
import path from "path";

async function main() {
  const inputPath = path.join(process.cwd(), "output.json");
  const outputDir = path.join(process.cwd(), "markdown-output");

  const { items } = await fs.readJson(inputPath);

  await fs.ensureDir(outputDir);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const filenameSafeTitle = item.title
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()
      .slice(0, 50);

    const mdContent = `# ${item.title}\n\n${item.content}`;
    const filePath = path.join(outputDir, `${i + 1}_${filenameSafeTitle}.md`);

    await fs.writeFile(filePath, mdContent, "utf8");
    console.log(`✅ Wrote ${filePath}`);
  }

  console.log(`🎉 Done! Markdown saved to: ${outputDir}`);
}

main().catch((err) => {
  console.error("❌ Failed to convert JSON to Markdown:", err);
  process.exit(1);
});
