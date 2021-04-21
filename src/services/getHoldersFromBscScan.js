const puppeteer = require('puppeteer');
const constants = require('../utils/constants');

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getHoldersFromBscScan() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.goto(constants.BSC_SCAN_URL);

    const isLoaded = () =>
      page.$(
        '#ContentPlaceHolder1_divSummary > div.row.mb-4 > div.col-md-6.mb-3.mb-md-0 > div > div.card-body > div.row.align-items-center > div.col-md-8.font-weight-medium > span.hash-tag.text-truncate'
      );

    let loaded = await isLoaded();

    do {
      await delay(500);
      loaded = await isLoaded();
    } while (!loaded);

    const holders = await page.$eval(
      '#ContentPlaceHolder1_tr_tokenHolders > div > div.col-md-8 > div > div',
      (e) => e.innerText
    );

    return {
      holdersNum: holders,
    };
  } catch (e) {
    return {
      error: e.message,
    };
  } finally {
    browser.close();
  }
}

module.exports = getHoldersFromBscScan;
