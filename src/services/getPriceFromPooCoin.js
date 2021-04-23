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
        '#root > div > div.d-md-block.flex-grow-1 > div.d-flex.flex-column.flex-grow-1.pe-2 > div > div.flex-grow-1.ps-2.pt-2.lh-1 > div.d-flex.align-items-start.flex-wrap > div.ps-2.d-flex.align-items-center.flex-grow-1 > div > div.d-flex > div > span'
      );

    let loaded = await isLoaded();

    do {
      await delay(500);
      loaded = await isLoaded();
    } while (!loaded);

    const marketCapHTML = await page.$eval(
      '#root > div > div.d-md-block.flex-grow-1 > div.d-flex.flex-column.flex-grow-1.pe-2 > div > div.TokenChart_stats__3732U.d-block.bg-dark-1.shadow.pt-3.text-small > div.px-3 > span:nth-child(4)',
      (e) => e.innerHTML
    );
    const supplyHTML = await page.$eval(
      '#root > div > div.d-md-block.flex-grow-1 > div.d-flex.flex-column.flex-grow-1.pe-2 > div > div.TokenChart_stats__3732U.d-block.bg-dark-1.shadow.pt-3.text-small > div.px-3',
      (e) => e.innerHTML
    );

    const marketCapText = marketCapHTML.match(/\$(.*)/)[1];
    const supplyText = supplyHTML
      .match(/Total Supply:<br>(.*)<hr/)[1]
      .split('<hr')[0];
    const totalBNB = supplyHTML.match(/\/BNB LP BNB Holdings:<br>(.*) BNB/)[1];
    const totalBNBDollar = supplyHTML.match(/\(\$(.*)\)/)[1];

    const bnbPrice =
      Number.parseFloat(totalBNB) /
      Number.parseFloat(totalBNBDollar.replace(/,/, ''));

    const marketCap = Number.parseInt(marketCapText.replace(/,/g, ''));
    const supply = Number.parseInt(supplyText.replace(/,/g, ''));
    const price = marketCap / supply;

    return {
      supply,
      marketCap,
      usdPrice: price.toFixed(18),
      price: (bnbPrice * price).toFixed(18),
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
