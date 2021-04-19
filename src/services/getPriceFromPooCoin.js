const puppeteer = require('puppeteer');
const constants = require('../utils/constants');

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getPriceFromPooCoin() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.goto(constants.POO_COIN_CHART_URL);

    const isLoaded = () =>
      page.$(
        '#root > div > div.d-md-block.pt-2.flex-grow-1.h-100 > div.d-flex.flex-column.flex-grow-1.pb-2.px-2 > div > div.flex-grow-1 > div.d-flex.align-items-center.flex-wrap > span > span'
      );

    let loaded = await isLoaded();

    do {
      await delay(500);
      loaded = await isLoaded();
    } while (!loaded);

    const marketCapHTML = await page.$eval(
      '#root > div > div.d-md-block.pt-2.flex-grow-1.h-100 > div.d-flex.flex-column.flex-grow-1.pb-2.px-2 > div > div.TokenChart_stats__3732U.d-block > div.text-small > span:nth-child(4)',
      (e) => e.innerHTML
    );
    const supplyHTML = await page.$eval(
      '#root > div > div.d-md-block.pt-2.flex-grow-1.h-100 > div.d-flex.flex-column.flex-grow-1.pb-2.px-2 > div > div.TokenChart_stats__3732U.d-block > div.text-small',
      (e) => e.innerHTML
    );

    const marketCapText = marketCapHTML.match(/\$(.*)/)[1];
    const supplyText = supplyHTML
      .match(/Total Supply:<br>(.*)<hr>/)[1]
      .split('<hr>')[0];

    const marketCap = Number.parseInt(marketCapText.replace(/,/g, ''));
    const supply = Number.parseInt(supplyText.replace(/,/g, ''));
    const price = marketCap / supply;

    return {
      supply,
      marketCap,
      price: price.toFixed(18),
    };
  } catch (e) {
    return {
      error: e.message,
    };
  } finally {
    browser.close();
  }
}

module.exports = getPriceFromPooCoin;
