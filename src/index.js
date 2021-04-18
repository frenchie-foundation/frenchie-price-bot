const dotenv = require('dotenv');
// eslint-disable-next-line no-unused-vars
const { Telegraf, Context } = require('telegraf');
const getPriceFromPooCoin = require('./services/getPriceFromPooCoin');

dotenv.config();

let lastCall = null;
let lastReturn = null;

/**
 * Context
 * @param {Context} ctx
 */
async function getPrice(ctx) {
  const now = new Date();

  if (lastCall && now - lastCall < 10000) {
    return ctx.reply(lastReturn, { parse_mode: 'HTML' });
  }

  const info = await getPriceFromPooCoin();

  if (info.error) {
    return ctx.reply('Sorry, something went wrong. Please try again!');
  }

  const result = `<strong>[Frenchie Token Info]</strong>\n\n<strong>Current price:</strong> ${
    info.price
  } BNB\n<strong>Market cap:</strong> $${info.marketCap.toLocaleString()}\n<strong>Current supply:</strong> ${info.supply.toLocaleString()}`;

  lastCall = new Date();
  lastReturn = result;

  ctx.reply(result, {
    parse_mode: 'HTML',
  });
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
