import { Telegraf } from 'telegraf';
import { container } from 'tsyringe';

import Bot from '@config/telegraf';
import UserStartMenu from '@modules/user/infra/telegraf/UserStartMenu';
import CompraMenu from '@modules/transactions/infra/telegraf/CompraMenu';
import UserExcludeMenu from '@modules/user/infra/telegraf/ExcludeMenu';
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

  const startMenu = container.resolve(UserStartMenu);
  const excludeMenu = container.resolve(UserExcludeMenu);
  const compraMenu = container.resolve(CompraMenu);
  const productMenu = container.resolve(ProductMenu);

  Bot.use(isPrivate(startMenu.execute()));
  Bot.use(isPrivate(compraMenu.execute()));
  Bot.use(isPrivate(excludeMenu.execute()));
  Bot.use(isPrivate(await productMenu.execute()));

  Bot.launch().then(_ =>
    // eslint-disable-next-line no-console
    console.log('Bot Started as', Bot.options.username),
  );

  // eslint-disable-next-line no-console
  Bot.catch(errStack => console.log('Bot Error Catcher >> ', errStack));
};

StartPoll();
