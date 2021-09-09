const dotenv = require('dotenv');
const { Telegraf } = require('telegraf');

const handleGetPrice = require('./handlers/handleGetPrice');
const handleGetShortInfo = require('./handlers/handleGetShortInfo');
const getPriceFromPancake = require('./services/getPriceFromPancake');

getPriceFromPancake();

dotenv.config();

const commands = [
  {
    name: 'frenchie',
    callback: handleGetPrice,
  },
  {
    name: 'price',
    callback: handleGetPrice,
  },
  {
    name: 'usd',
    callback: handleGetShortInfo,
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
