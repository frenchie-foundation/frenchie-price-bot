const dotenv = require('dotenv');
// eslint-disable-next-line no-unused-vars
const { Telegraf, Context } = require('telegraf');
const getPriceFromPooCoin = require('./services/getPriceFromPooCoin');
const constants = require('./utils/constants');

dotenv.config();

let lastCall = null;
let lastReturn = null;
// let isAboutToWelcomeMember = false;

/**
 * Context
 * @param {Context} ctx
 */
async function getPrice(ctx) {
  const now = new Date();

  if (lastCall && lastReturn && now - lastCall < 10000) {
    return ctx.reply(lastReturn, { parse_mode: 'HTML' });
  }

  const info = await getPriceFromPooCoin();

  if (info.error) {
    return ctx.reply('Sorry, something went wrong. Please try again!');
  }

  const result = [
    '<strong>Frenchie Token Info (FREN)</strong>',
    '',
    `<strong>Current price (BNB):</strong> ${info.price}`,
    `<strong>Current price (USD):</strong> ${info.usdPrice}`,
    `<strong>Market cap:</strong> $${info.marketCap.toLocaleString()}`,
    `<strong>Current supply:</strong> ${info.supply.toLocaleString()}`,
    '',
    `<strong>Links:</strong> <a href="${constants.WEB_APP_URL}">Frenchie website</a> | <a href="${constants.PANCAKE_SWAP_URL}">Buy it on PancakeSwap</a> | <a href="${constants.POO_COIN_CHART_URL}">Price chart</a>`,
  ].join('\n');

  lastCall = new Date();
  lastReturn = result;

  ctx.reply(result, {
    parse_mode: 'HTML',
  });
}

/**
 * Context
 * @param {Context} ctx
 */
async function handleNewMember(ctx) {
  const count = await ctx.getChatMembersCount();
  const countText =
    count < 2500
      ? `🔥 ${
          500 - (count % 500)
        } Telegram Users until our next 5% $FREN BURN EVENT 🔥`
      : '';

  const text = [
    'Welcome to Frenchie Network! You are here at the perfect moment in our growth! 🚀',
    '',
    countText,
    '',
    'This is a community based TOKEN that thrives for honesty and transparency. Share to your friends and to your groups in order for us to grow. 💎',
  ].join('\n');

  ctx.reply(text);
}

const commands = [
  {
    name: 'frenchie',
    callback: getPrice,
  },
  {
    name: 'price',
    callback: getPrice,
  },
];

const { BOT_TOKEN } = process.env;

const bot = new Telegraf(BOT_TOKEN);

bot.help((ctx) => {
  ctx.reply('Hi, the available commands are:');
  ctx.reply(commands.map((x) => `- /${x.name}`).join('\n'));
});

// bot.on('new_chat_members', (ctx) => {
//   if (!isAboutToWelcomeMember) {
//     isAboutToWelcomeMember = true;
//     setTimeout(() => {
//       console.log('[!] New member');
//       handleNewMember(ctx);
//       isAboutToWelcomeMember = false;
//     }, 1500);
//   }
// });

for (const command of commands) {
  bot.command(command.name, (ctx) => {
    console.info(`[!] Command: /${command.name}`);
    command.callback(ctx);
  });
}

bot.launch().then(() => {
  console.info('[!] Bot launched');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
