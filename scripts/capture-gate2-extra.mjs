import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const url = 'http://localhost:3000/ai/recommend?problem=reduce-customer-support-costs&q=' + encodeURIComponent('I want to reduce customer support costs by automating repetitive tickets while keeping humans involved for complex cases.');
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
// scroll to why / alternatives
await page.evaluate(() => {
  const el = [...document.querySelectorAll('p')].find(p => p.textContent?.includes('Why this stack'));
  el?.scrollIntoView({ block: 'start' });
});
await page.waitForTimeout(300);
await page.screenshot({ path: '/opt/cursor/artifacts/screenshots/gate2-stack-why.png' });
await page.evaluate(() => {
  const el = [...document.querySelectorAll('p')].find(p => p.textContent?.includes('Find builders'));
  el?.scrollIntoView({ block: 'start' });
});
await page.waitForTimeout(300);
await page.screenshot({ path: '/opt/cursor/artifacts/screenshots/gate2-find-builders.png' });
await browser.close();
console.log('ok');
