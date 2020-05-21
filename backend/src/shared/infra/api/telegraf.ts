import Bot from '@config/telegraf';
import AppState from './telegrafSession';

import StartMenu from '@modules/user/infra/telegraf/UserStartMenu';

const StartPoll = async (): Promise<void> => {
  Bot.on('message', (context, next) => {

    if(!context.from) throw new Error('failed, User cannot found!');

    AppState.newState({ fromUser: context.from });

    return next();
  });

  Bot.use(StartMenu);

  // Bot.catch((error) => console.log('Bot Error =>', error()))

  await Bot.launch();
  console.log("Bot Started as", Bot.options.username);
}

StartPoll();

