// eslint-disable-next-line no-unused-vars
const { Context } = require('telegraf');
const getHoldersFromBscScan = require('../services/getHoldersFromBscScan');
const getPriceFromPooCoin = require('../services/getPriceFromPooCoin');
const constants = require('../utils/constants');

let lastCall = null;
let lastReturn = null;

/**
 * Context
 * @param {Context} ctx
 */
async function handleGetPrice(ctx) {
  const now = new Date();

  if (lastCall && lastReturn && now - lastCall < 10000) {
    return ctx.reply(lastReturn, { parse_mode: 'HTML' });
  }

  const [info, holders] = await Promise.all([
    getPriceFromPooCoin(),
    getHoldersFromBscScan(),
  ]);

  if (info.error || holders.error) {
    return ctx.reply('Sorry, something went wrong. Please try again!');
  }

  const result = [
    '<strong>Frenchie Token Info (FREN)</strong>',
    '',
    `<strong>Current price (BNB):</strong> ${info.price}`,
    `<strong>Current price (USD):</strong> ${info.usdPrice}`,
    `<strong>Market cap:</strong> $${info.marketCap.toLocaleString()}`,
    `<strong>Current supply:</strong> ${info.supply.toLocaleString()}`,
    `<strong>Holders:</strong> ${holders.holdersNum}`,
    '',
    '<strong>Links:</strong>',
    `<a href="${constants.WEB_APP_URL}">Frenchie Website</a>`,
    `<a href="${constants.PANCAKE_SWAP_URL}">Buy it on PancakeSwap</a>`,
    `<a href="${constants.DEXGURU_URL}">Buy it on DexGuru</a>`,
    `<a href="${constants.POO_COIN_CHART_URL}">PooCoin Price chart</a>`,
  ].join('\n');

  lastCall = new Date();
  lastReturn = result;

  ctx.reply(result, {
    parse_mode: 'HTML',
  });
}

module.exports = handleGetPrice;
