import { chromium } from "playwright";
import { screens } from "../src/app/map/screens";
import * as path from "path";
import * as fs from "fs";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const OUT_DIR = path.join(__dirname, "../public/screenshots");

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
  });

  let total = 0;

  for (const screen of screens) {
    // Capture states
    for (const state of screen.states) {
      const query = state.query ? `?${state.query}` : "";
      const url = `${BASE_URL}${screen.path}${query}`;
      const filename = `${screen.id}--${state.id}.png`;

      console.log(`  [state] ${url} -> ${filename}`);
      await page.goto(url, { waitUntil: "networkidle" });
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(OUT_DIR, filename), fullPage: false });
      total++;
    }

    // Capture variants
    for (const variant of screen.variants ?? []) {
      const url = `${BASE_URL}${screen.path}?${variant.query}`;
      const filename = `${screen.id}--v-${variant.id}.png`;

      console.log(`  [variant] ${url} -> ${filename}`);
      await page.goto(url, { waitUntil: "networkidle" });
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(OUT_DIR, filename), fullPage: false });
      total++;
    }

    // Capture patterns
    for (const pattern of screen.patterns ?? []) {
      const url = pattern.query ? `${BASE_URL}${screen.path}?${pattern.query}` : `${BASE_URL}${screen.path}`;
      const filename = `${screen.id}--p-${pattern.id}.png`;

      console.log(`  [pattern] ${url} -> ${filename}`);
      await page.goto(url, { waitUntil: "networkidle" });
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(OUT_DIR, filename), fullPage: false });
      total++;
    }
  }

  await browser.close();
  console.log(`Done! ${total} screenshots saved.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
