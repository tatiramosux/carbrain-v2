const playwright = require('playwright');
(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  
  // click get offer
  await page.click('text="Get an Instant Offer"');
  await page.waitForTimeout(1000);
  
  // find the trim dropdown list
  // It's in the DOM when open, so let's open it
  // First, advance to Trim step
  // Fill Year, Make, Model
  await page.fill('input[placeholder="Year"]', '2021');
  await page.fill('input[placeholder="Make"]', 'Chevrolet');
  await page.fill('input[placeholder="Model"]', 'Cruze');
  await page.click('button:has-text("Next")');
  await page.waitForTimeout(500);
  // Trim step
  await page.click('text="- Select -"');
  await page.waitForTimeout(500);
  
  // Find which element has overflow hidden
  const result = await page.evaluate(() => {
    const list = document.querySelector('ul.py-2').parentElement;
    const rect = list.getBoundingClientRect();
    
    let el = list.parentElement;
    let clipEl = null;
    let overflows = [];
    while (el && el !== document.body) {
      const style = window.getComputedStyle(el);
      if (style.overflow === 'hidden' || style.overflowY === 'hidden' || style.overflowY === 'auto' || style.overflowY === 'scroll') {
        overflows.push({
          tag: el.tagName,
          className: el.className,
          overflow: style.overflow,
          overflowY: style.overflowY
        });
      }
      el = el.parentElement;
    }
    return { rect, overflows };
  });
  
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
