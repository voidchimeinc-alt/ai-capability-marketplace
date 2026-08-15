import { chromium } from 'playwright';

const supportQ = encodeURIComponent('I want to reduce customer support costs by automating repetitive tickets while keeping humans involved for complex cases.');
const shots = [
  [`http://localhost:3000/ai/recommend?problem=reduce-customer-support-costs&q=${supportQ}`, 'gate3-stack.png', 0],
  [`http://localhost:3000/network/matches?problem=reduce-customer-support-costs&q=${supportQ}`, 'gate3-matches.png', 0],
  [`http://localhost:3000/network/matches?problem=reduce-customer-support-costs&q=${supportQ}`, 'gate3-match-why.png', 700],
  ['http://localhost:3000/builders/samuel-okafor', 'gate3-builder-profile.png', 200],
  ['http://localhost:3000/network?q=RAG+engineer', 'gate3-discovery.png', 0],
  [`http://localhost:3000/projects/new?problem=reduce-customer-support-costs&q=${supportQ}&stack=${encodeURIComponent('Reduce customer support costs stack')}&builder=samuel-okafor&from=stack`, 'gate3-build-this.png', 0],
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
