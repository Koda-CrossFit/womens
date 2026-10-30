// Builds the small brand assets for the page:
//   assets/favicon.svg          — Koda KX on Mend teal
//   assets/apple-touch-icon.png — same, 180x180 (home-screen icon)
//   assets/og-womens.jpg        — link-preview card (1200x630) for texts / Instagram / Facebook
// node tools/build_assets.js
const fs = require('fs');
const path = require('path');
const puppeteer = require('C:/Users/kevsc/Desktop/Claude/hyrox_pdf/node_modules/puppeteer');

const ROOT = path.resolve(__dirname, '..');
const KX = 'M0 0h316l539 539-539 539H0l539-539zM566 0h316l381 381 382-381h316l-540 539 540 539h-316l-382-381-381 381H566l540-539z';
const TEAL = '#117F97';

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${TEAL}"/>` +
  `<path fill="#fff" transform="translate(12 21) scale(0.0204)" d="${KX}"/></svg>\n`;
fs.mkdirSync(path.join(ROOT, 'assets'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'assets/favicon.svg'), favicon);

const og = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; position: relative; font-family: 'Inter', sans-serif; color: #fff;
         background: radial-gradient(900px 600px at 88% 20%, #1797B3 0%, ${TEAL} 45%, #0B5A6B 100%); }
  .kx { position: absolute; right: -60px; bottom: -40px; width: 620px; opacity: 0.10; }
  .wrap { position: absolute; left: 76px; top: 70px; right: 76px; }
  .top { display: flex; align-items: center; gap: 18px; font-size: 22px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #D6F1F8; }
  .top svg { width: 58px; }
  h1 { font-size: 96px; font-weight: 800; line-height: 1.02; letter-spacing: -0.035em; margin: 46px 0 26px; max-width: 900px; }
  .sub { font-size: 34px; font-weight: 600; color: #E6F7FE; }
  .pill { display: inline-flex; margin-top: 44px; background: #fff; color: #0B5A6B; font-size: 28px; font-weight: 800; padding: 18px 30px; border-radius: 8px; }
</style></head><body>
  <svg class="kx" viewBox="0 0 1961 1078"><path fill="#fff" d="${KX}"/></svg>
  <div class="wrap">
    <div class="top"><svg viewBox="0 0 1961 1078"><path fill="#fff" d="${KX}"/></svg>Koda CrossFit Iron View × Mend Physical Therapy</div>
    <h1>Your first class<br>is on us.</h1>
    <div class="sub">PT-led Women's Strength · Louisville, CO</div>
    <div class="pill">Reserve your free class →</div>
  </div>
</body></html>`;

// Pages load from temp files (setContent stalls in this puppeteer build).
async function render(page, html, file, shot) {
  const tmp = path.join(require('os').tmpdir(), 'koda-womens-' + file);
  fs.writeFileSync(tmp, html);
  await page.goto('file:///' + tmp.replace(/\\/g, '/'), { waitUntil: 'networkidle0', timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot(shot);
}

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.setViewport({ width: 180, height: 180 });
  await render(page, `<html><body style="margin:0">${favicon.replace('<svg ', '<svg width="180" height="180" ').replace('rx="14"', 'rx="0"')}</body></html>`,
    'icon.html', { path: path.join(ROOT, 'assets/apple-touch-icon.png'), clip: { x: 0, y: 0, width: 180, height: 180 } });

  await page.setViewport({ width: 1200, height: 630 });
  await render(page, og, 'og.html', { path: path.join(ROOT, 'assets/og-womens.jpg'), type: 'jpeg', quality: 88 });

  await browser.close();
  console.log('wrote assets/favicon.svg, assets/apple-touch-icon.png, assets/og-womens.jpg');
})();
