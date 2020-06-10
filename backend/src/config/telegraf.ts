import Telegraf from 'telegraf';

const config = {};

if (!process.env.BOT_TOKEN) throw new Error('You must provide a token bot');

const bot = new Telegraf(process.env.BOT_TOKEN, config);

export default bot;
