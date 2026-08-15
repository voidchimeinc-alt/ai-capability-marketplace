import { chromium } from 'playwright';

const shots = [
  ['http://localhost:3000/', 'gate1-landing.png', 0],
  ['http://localhost:3000/ai/tools', 'gate1-atlas.png', 0],
  ['http://localhost:3000/ai/recommend?problem=reduce-customer-support-costs', 'gate1-recommend.png', 1100],
  ['http://localhost:3000/network', 'gate1-network.png', 0],
  ['http://localhost:3000/ai/tools/claude', 'gate1-tool-profile.png', 200],
];

const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch());
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
for (const [url, name, scrollY] of shots) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  if (scrollY) await page.evaluate((y) => window.scrollTo(0, y), scrollY);
  await page.waitForTimeout(300);
  await page.screenshot({ path: `/opt/cursor/artifacts/screenshots/${name}` });
  console.log('saved', name);
}
await browser.close();
