const puppeteer = require('puppeteer');
const constants = require('../utils/constants');

let page = null;
let browser = null;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getInfoFromBscScan() {
  try {
    if (!browser) {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox'],
      });
      page = await browser.newPage();
      await page.goto(constants.BSC_SCAN_URL);
    }

    const isLoaded = async () => {
      try {
        const exists = await page.$eval(
          '#ContentPlaceHolder1_divSummary > div.row.mb-4 > div.col-md-6.mb-3.mb-md-0 > div > div.card-body > div.row.align-items-center > div.col-md-8.font-weight-medium > span.hash-tag.text-truncate',
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

    const holders = await page.$eval(
      '#ContentPlaceHolder1_tr_tokenHolders > div > div.col-md-8 > div > div',
      (e) => e.innerText
    );
    const supply = await page.$eval(
      '#ContentPlaceHolder1_divSummary > div.row.mb-4 > div.col-md-6.mb-3.mb-md-0 > div > div.card-body > div.row.align-items-center > div.col-md-8.font-weight-medium > span.hash-tag.text-truncate',
      (e) => e.innerText
    );

    return {
      holdersNum: holders,
      supply,
    };
  } catch (e) {
    return {
      error: e.message,
    };
  }
}

module.exports = getInfoFromBscScan;
