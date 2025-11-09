import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

const sizes = [
  { size: 192, filename: "icon-192x192.png" },
  { size: 512, filename: "icon-512x512.png" },
];

async function generateIcons() {
  const inputPath = join(rootDir, "public", "assets", "logo-text.png");
  const outputDir = join(rootDir, "public");

  console.log("Generating PWA icons from logo-text.png...");

  for (const { size, filename } of sizes) {
    const outputPath = join(outputDir, filename);
    await sharp(inputPath)
      .resize(size, size, {
        fit: "contain",
        background: { r: 245, g: 241, b: 230, alpha: 1 }, // #f5f1e6
      })
      .png()
      .toFile(outputPath);
    console.log(`✓ Generated ${filename} (${size}x${size})`);
  }

  console.log("\nAll PWA icons generated successfully!");
}

generateIcons().catch(console.error);
