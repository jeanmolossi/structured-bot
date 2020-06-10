import { Telegraf } from 'telegraf';

import Bot from '@config/telegraf';
import StartMenu from '@modules/user/infra/telegraf/UserStartMenu';
import CompraMenu from '@modules/transactions/infra/telegraf/CompraMenu';
import ExcludeMenu from '@modules/user/infra/telegraf/ExcludeMenu';

import ProductMenu from '@modules/product/infra/telegraf/ProductMenu';
import RedisCacheProvider from '@shared/container/providers/CacheProvider/implementations/RedisCacheProvider';
import TelegrafEmitter from './telegrafUpdateEmitter';
import TelegrafListener from './telegrafEventListener';

const StartPoll = async (): Promise<void> => {
  const cache = new RedisCacheProvider();
  cache.clearCache();

  Bot.use((_context, next) => {
    TelegrafListener(_context);
    return next();
  });
  Bot.on('message', async (context, next) => {
    if (!context.from) throw new Error('failed, User cannot found!');

    context.updateSubTypes.map(event => TelegrafEmitter.emit(event, context));

    context.updateSubTypes.map(event => TelegrafEmitter.off(event));
    return next();
  });

  const isPrivate = Telegraf.privateChat;

  Bot.use(isPrivate(StartMenu));
  Bot.use(isPrivate(CompraMenu));
  Bot.use(isPrivate(ExcludeMenu));
  Bot.use(isPrivate(ProductMenu));

  Bot.launch().then(_ =>
    // eslint-disable-next-line no-console
    console.log('Bot Started as', Bot.options.username),
  );

  // eslint-disable-next-line no-console
  Bot.catch(errStack => console.log('Error Catch >> ', errStack));
};

StartPoll();
