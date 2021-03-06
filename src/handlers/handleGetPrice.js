// eslint-disable-next-line no-unused-vars
const { Context } = require('telegraf');

const getTokenInfo = require('../services/getTokenInfo');
const constants = require('../utils/constants');

let lastCall = null;
let lastReturn = null;

/**
 * Get price handler
 * @param {Context} ctx
 */
async function handleGetPrice(ctx) {
  const now = new Date();

  if (lastCall && lastReturn && now - lastCall < 10000) {
    return ctx.reply(lastReturn, { parse_mode: 'HTML' });
  }

  const message = await ctx.reply('Fetching data...');

  try {
    const { price, supply, marketcap } = await getTokenInfo();

    const result = [
      '<strong>Frenchie Token Info (FREN)</strong>',
      '',
      `<strong>Current price (USD):</strong> ${price.toString()}`,
      `<strong>Market cap:</strong> $${marketcap}`,
      `<strong>Current supply:</strong> ${supply.toLocaleString()}`,
      `<strong>Address:</strong> ${constants.FREN_ADDRESS}`,
      '',
      '<strong>Links:</strong>',
      `<a href="${constants.WEB_APP_URL}">Frenchie Website</a>`,
      `<a href="${constants.PANCAKE_SWAP_URL}">Buy it on PancakeSwap</a>`,
      `<a href="${constants.ONEINCH}">Buy it on 1inch</a>`,
      `<a href="${constants.DEXGURU_URL}">Buy it on DexGuru</a>`,
      `<a href="${constants.POO_COIN_CHART_URL}">PooCoin Price chart</a>`,
      `<a href="${constants.COINGECKO_URL}">CoinGecko</a>`,
    ].join('\n');

    lastCall = new Date();
    lastReturn = result;

    ctx.telegram.editMessageText(
      message.chat.id,
      message.message_id,
      null,
      result,
      {
        parse_mode: 'HTML',
      }
    );
  } catch (error) {
    console.error(error);
    return ctx.telegram.editMessageText(
      message.chat.id,
      message.message_id,
      null,
      'Sorry, something went wrong. Please try again!'
    );
  }
}

module.exports = handleGetPrice;
