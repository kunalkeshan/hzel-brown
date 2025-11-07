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
  const inputPath = join(rootDir, "app", "icon.png");
  const outputDir = join(rootDir, "public");

  console.log("Generating PWA icons...");

  for (const { size, filename } of sizes) {
    const outputPath = join(outputDir, filename);
    await sharp(inputPath)
      .resize(size, size, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png()
      .toFile(outputPath);
    console.log(`✓ Generated ${filename} (${size}x${size})`);
  }

  console.log("\nAll PWA icons generated successfully!");
}

generateIcons().catch(console.error);
