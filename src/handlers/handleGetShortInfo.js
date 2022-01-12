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
    const { price, marketcap } = await getTokenInfo();

    const result = [
      `<strong>Current price (USD):</strong> ${price.toString()}`,
      `<strong>Market cap:</strong> $${marketcap}`,
      `<strong>Address:</strong> ${constants.FREN_ADDRESS}`,
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
