const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
  
  await page.goto('http://localhost:5173', { waitUntil: 'load' });
  console.log('Page loaded');
  
  await new Promise(r => setTimeout(r, 1000));
  
  try {
    // Click Settings
    await page.click('#btn-settings');
    await new Promise(r => setTimeout(r, 500));
    const settingsHidden = await page.evaluate(() => document.getElementById('settings-overlay').classList.contains('hidden'));
    console.log('Is settings overlay hidden after click?', settingsHidden);

    // Close Settings
    await page.click('#close-settings');
    await new Promise(r => setTimeout(r, 500));

    // Click Start
    await page.click('#btn-start');
    await new Promise(r => setTimeout(r, 500));
    const gameScreenHidden = await page.evaluate(() => document.getElementById('game-screen').classList.contains('hidden'));
    const gameCanvasVisible = await page.evaluate(() => document.getElementById('game-canvas') !== null);
    console.log('Is game screen hidden after click?', gameScreenHidden);
    console.log('Is game canvas present?', gameCanvasVisible);
  } catch(e) {
    console.log('PUPPETEER CLICK ERROR:', e);
  }

  await browser.close();
  process.exit(0);
})();
