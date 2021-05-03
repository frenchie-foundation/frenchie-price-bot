const puppeteer = require('puppeteer');
const constants = require('../utils/constants');

let page = null;
let browser = null;
let timeout = null;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getPriceFromBoggedFinance() {
  try {
    if (!browser) {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox'],
      });
      page = await browser.newPage();
      await page.goto(constants.BOGGED_FINANCE_CHART_URL);
    }

    const isLoaded = async () => {
      try {
        const exists = await page.$eval(
          'body > div > div.flex-1.flex.flex-col.overflow-hidden > main > div > div > div > div > div.row-span-1.col-span-12.text-white.justify-between.flex.flex-col.lg\\:flex-row.lg\\:items-center > div.flex.flex-row.mr-4.w-full.overflow-y-hidden.overflow-x-hidden.flex-wrap.sm\\:px-0.px-2 > div.my-1.flex.flex-row.justify-start.space-x-3.md\\:pt-0.pt-3.sm\\:space-x-6.w-full.md\\:w-auto.border-t.md\\:border-t-0.border-gray-200.dark\\:border-gray-700 > span:nth-child(2) > h4',
          (e) => e.innerText
        );
        if (exists) {
          return true;
        }
        return false;
      } catch {
        return false;
      }
    };

    let loaded = await isLoaded();

    do {
      await delay(500);
      loaded = await isLoaded();
    } while (!loaded);

    const marketCap = await page.$eval(
      'body > div > div.flex-1.flex.flex-col.overflow-hidden > main > div > div > div > div > div.row-span-1.col-span-12.text-white.justify-between.flex.flex-col.lg\\:flex-row.lg\\:items-center > div.flex.flex-row.mr-4.w-full.overflow-y-hidden.overflow-x-hidden.flex-wrap.sm\\:px-0.px-2 > div.my-1.flex.flex-row.justify-start.space-x-3.md\\:pt-0.pt-3.sm\\:space-x-6.w-full.md\\:w-auto.border-t.md\\:border-t-0.border-gray-200.dark\\:border-gray-700 > span:nth-child(3) > h4',
      (e) => String(e.innerText)
    );
    const price = await page.$eval(
      'body > div > div.flex-1.flex.flex-col.overflow-hidden > main > div > div > div > div > div.row-span-1.col-span-12.text-white.justify-between.flex.flex-col.lg\\:flex-row.lg\\:items-center > div.flex.flex-row.mr-4.w-full.overflow-y-hidden.overflow-x-hidden.flex-wrap.sm\\:px-0.px-2 > div.my-1.flex.flex-row.space-x-3.sm\\:space-x-6.mr-6.mb-3.md\\:mb-0 > span:nth-child(2) > h4',
      (e) => e.innerText
    );
    const liquidity = await page.$eval(
      'body > div > div.flex-1.flex.flex-col.overflow-hidden > main > div > div > div > div > div.row-span-1.col-span-12.text-white.justify-between.flex.flex-col.lg\\:flex-row.lg\\:items-center > div.flex.flex-row.mr-4.w-full.overflow-y-hidden.overflow-x-hidden.flex-wrap.sm\\:px-0.px-2 > div.my-1.flex.flex-row.justify-start.space-x-3.md\\:pt-0.pt-3.sm\\:space-x-6.w-full.md\\:w-auto.border-t.md\\:border-t-0.border-gray-200.dark\\:border-gray-700 > span:nth-child(2) > h4',
      (e) => e.innerText
    );
    const dailyVolume = await page.$eval(
      'body > div > div.flex-1.flex.flex-col.overflow-hidden > main > div > div > div > div > div.row-span-1.col-span-12.text-white.justify-between.flex.flex-col.lg\\:flex-row.lg\\:items-center > div.flex.flex-row.mr-4.w-full.overflow-y-hidden.overflow-x-hidden.flex-wrap.sm\\:px-0.px-2 > div.my-1.flex.flex-row.justify-start.space-x-3.md\\:pt-0.pt-3.sm\\:space-x-6.w-full.md\\:w-auto.border-t.md\\:border-t-0.border-gray-200.dark\\:border-gray-700 > span:nth-child(1) > h4',
      (e) => e.innerText
    );
    const dailyChange = await page.$eval(
      'body > div > div.flex-1.flex.flex-col.overflow-hidden > main > div > div > div > div > div.row-span-1.col-span-12.text-white.justify-between.flex.flex-col.lg\\:flex-row.lg\\:items-center > div.flex.flex-row.mr-4.w-full.overflow-y-hidden.overflow-x-hidden.flex-wrap.sm\\:px-0.px-2 > div.my-1.flex.flex-row.space-x-3.sm\\:space-x-6.mr-6.mb-3.md\\:mb-0 > span:nth-child(3) > h4',
      (e) => e.innerText
    );

    console.log('bogged ok');

    return {
      marketCap,
      price,
      dailyVolume,
      dailyChange,
      liquidity,
    };
  } catch (e) {
    return {
      error: e.message,
    };
  } finally {
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null;
        page.reload();
      }, 60000);
    }
  }
}

module.exports = getPriceFromBoggedFinance;
