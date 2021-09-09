// eslint-disable-next-line no-unused-vars
const { Context } = require('telegraf');

const getInfoFromBscScan = require('../services/getInfoFromBscScan');
const getPriceFromPancake = require('../services/getPriceFromPancake');

let lastCall = null;
let lastReturn = null;

/**
 * Get price handler
 * @param {Context} ctx
 */
async function handleGetShortInfo(ctx) {
  const now = new Date();

  if (lastCall && lastReturn && now - lastCall < 10000) {
    return ctx.reply(lastReturn, { parse_mode: 'HTML' });
  }

  const message = await ctx.reply('Fetching data...');

  const [price, bsc] = await Promise.all([
    getPriceFromPancake(),
    getInfoFromBscScan(),
  ]);

  if (price.error || bsc.error) {
    console.log(price, bsc);
    return ctx.telegram.editMessageText(
      message.chat.id,
      message.message_id,
      null,
      'Sorry, something went wrong. Please try again!'
    );
  }

  const result = [
    `<strong>Current price (USD):</strong> ${price.usdPrice.toString()}`,
    `<strong>Market cap:</strong> ${bsc.marketCap}`,
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
}

module.exports = handleGetShortInfo;
