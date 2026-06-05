const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('PAGE ERROR LOG:', msg.text());
  });
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  await page.goto('http://localhost:5174/dashboard');
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  await page.screenshot({ path: 'debug.png' });
  const html = await page.evaluate(() => document.body.innerHTML);
  console.log('HTML CONTENT:', html.substring(0, 1000));
  await browser.close();
})();
