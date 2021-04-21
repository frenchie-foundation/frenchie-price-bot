// eslint-disable-next-line no-unused-vars
const { Context } = require('telegraf');

let isAboutToWelcomeMember = false;

/**
 * Context
 * @param {Context} ctx
 */
async function handleNewMember(ctx) {
  if (!isAboutToWelcomeMember) {
    isAboutToWelcomeMember = true;
    setTimeout(async () => {
      console.log('[!] New member');

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

      isAboutToWelcomeMember = false;
    }, 1500);
  }
}

module.exports = handleNewMember;
