const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport for desktop
  await page.setViewport({ width: 1440, height: 900 });
  
  // Wait for the app to load (assuming it runs on port 5173)
  await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle0' });
  
  // Wait an extra second for animations to settle
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const screenshotPath = path.join(process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share"), '..', '.gemini', 'antigravity-ide', 'brain', '65726ac1-5ea3-4ee2-9250-cb27fe4a0a34', 'media__final_redesign.png');
  
  await page.screenshot({ path: screenshotPath, fullPage: true });
  
  console.log(`Screenshot saved to ${screenshotPath}`);
  
  await browser.close();
})();
