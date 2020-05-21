import TelegrafInlineMenu from 'telegraf-inline-menu';
import State from '@shared/infra/api/telegrafSession';

let baseURL: string;

const StartMenu = new TelegrafInlineMenu(context => {
  return (
    `Opa, tudo bem, ${context.from.first_name}! Fico feliz em falar com você! \n` +
    `Como posso te ajudar?`
  );
});

StartMenu.setCommand('start');

StartMenu.urlButton(`Fiz uma assinatura, e agora ?`, context => {
  baseURL =
    (process.env.NODE_ENV === 'development'
      ? process.env.DEVELOPMENT_URL
      : process.env.PRODUCTION_URL) || 'https://google.com';

  const { fromUser } = State.getState();
  return `${baseURL}?userRef=${fromUser.id}`;
});

export default StartMenu.init({
  actionCode: 'Start',
  backButtonText: 'Voltar',
  mainMenuButtonText: 'Voltar ao início',
});
