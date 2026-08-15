import { chromium } from 'playwright';

const shots = [
  ['http://localhost:3000/', 'gate2-landing.png', 0],
  ['http://localhost:3000/ai/recommend?problem=reduce-customer-support-costs&q=' + encodeURIComponent('I want to reduce customer support costs by automating repetitive tickets while keeping humans involved for complex cases.'), 'gate2-stack-support.png', 0],
  ['http://localhost:3000/ai/recommend?problem=reduce-customer-support-costs&q=' + encodeURIComponent('I want to reduce customer support costs by automating repetitive tickets while keeping humans involved for complex cases.'), 'gate2-stack-components.png', 900],
  ['http://localhost:3000/ai/recommend?problem=reduce-customer-support-costs&q=' + encodeURIComponent('I want to reduce customer support costs by automating repetitive tickets while keeping humans involved for complex cases.'), 'gate2-stack-builders.png', 3200],
  ['http://localhost:3000/ai/tools', 'gate2-atlas.png', 0],
  ['http://localhost:3000/ai/tools/claude', 'gate2-tool-provenance.png', 400],
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
for (const [url, name, scrollY] of shots) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  if (scrollY) await page.evaluate((y) => window.scrollTo(0, y), scrollY);
  await page.waitForTimeout(250);
  await page.screenshot({ path: `/opt/cursor/artifacts/screenshots/${name}` });
  console.log('saved', name);
}
await browser.close();
