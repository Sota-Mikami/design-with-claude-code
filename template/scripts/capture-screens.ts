import { chromium } from "playwright";
import { screens } from "../src/app/map/screens";
import * as path from "path";
import * as fs from "fs";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const OUT_DIR = path.join(__dirname, "../public/screenshots");

/**
 * スクリーンショット撮影前に、アプリ本体に関係ないUI要素を非表示にする。
 * - ProtoNav（Prototype / Map / Spec / QA のヘッダーナビ）
 * - Next.js 開発用フローティングボタン（__next-dev-overlay 等）
 */
async function hideNonAppElements(page: import("playwright").Page) {
  await page.evaluate(() => {
    const style = document.createElement("style");
    style.id = "capture-hide";
    style.textContent = `
      /* ProtoNav header */
      nav.sticky { display: none !important; }
      /* Next.js dev overlay / floating button */
      [data-nextjs-dialog-overlay],
      [data-nextjs-toast],
      nextjs-portal,
      #__next-build-indicator,
      [class*="__next"] { display: none !important; }
      /* Adjust body to remove nav gap */
      body > div:first-child { margin-top: 0 !important; padding-top: 0 !important; }
    `;
    document.head.appendChild(style);
  });
  // Wait for reflow
  await page.waitForTimeout(100);
}

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
      await hideNonAppElements(page);
      await page.screenshot({ path: path.join(OUT_DIR, filename), fullPage: false });
      total++;
    }

    // Capture variants
    for (const variant of screen.variants ?? []) {
      const url = `${BASE_URL}${screen.path}?${variant.query}`;
      const filename = `${screen.id}--v-${variant.id}.png`;

      console.log(`  [variant] ${url} -> ${filename}`);
      await page.goto(url, { waitUntil: "networkidle" });
      await hideNonAppElements(page);
      await page.screenshot({ path: path.join(OUT_DIR, filename), fullPage: false });
      total++;
    }

    // Capture patterns
    for (const pattern of screen.patterns ?? []) {
      const url = pattern.query ? `${BASE_URL}${screen.path}?${pattern.query}` : `${BASE_URL}${screen.path}`;
      const filename = `${screen.id}--p-${pattern.id}.png`;

      console.log(`  [pattern] ${url} -> ${filename}`);
      await page.goto(url, { waitUntil: "networkidle" });
      await hideNonAppElements(page);
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
