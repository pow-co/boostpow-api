/* implements rabbi actor protocol */

require('dotenv').config();

const { Telegraf } = require('telegraf')

import { log } from 'rabbi';

export async function start() {

  const bot = new Telegraf(process.env.TELEGRAM_BOT_API_TOKEN)
  bot.start((ctx) => ctx.reply('Welcome'))
  bot.help((ctx) => ctx.reply('Send me a sticker'))
  bot.on('sticker', (ctx) => ctx.reply('👍'))
  bot.hears('hi', (ctx) => ctx.reply('Hey there'))
  bot.launch()

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))

}

if (require.main === module) {

  start();

}

