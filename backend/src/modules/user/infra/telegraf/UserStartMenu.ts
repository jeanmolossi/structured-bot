import { container } from 'tsyringe';
import TelegrafInlineMenu from 'telegraf-inline-menu';

import State from '@shared/infra/api/telegrafSession';
import CreateUserService from '@modules/user/services/CreateUserService';
import FindUserByTgIdService from '@modules/user/services/FindUserByTgIdService';

const hides = {
  email: false,
  phone: false,
};

const menuState = {
  userEmail: null,
  userPhone: null,
};

let tgId: number = null;
let dbUser = null;

const StartMenu = new TelegrafInlineMenu(async context => {
  let userName = null;
  if (context.match && tgId === null) {
    tgId = context.update.callback_query.message.from.id;
    userName = context.update?.callback_query?.message?.from.first_name;
  }
  tgId = tgId === null ? context.message.from.id : tgId;
  userName = userName === null ? context.message.from.first_name : null;

  const findUserByTgId = container.resolve(FindUserByTgIdService);

  dbUser = findUserByTgId.execute(String(tgId)) !== null;

  const SecondLineMessage = !dbUser
    ? `Me envie os dados abaixo conforme cadastrado na Monetizze.`
    : `Posso tirar algumas de suas dúvidas!, toque no botão abaixo.`;

  return (
    `Opa, tudo bem, ${userName}! Fico feliz em falar com você! \n` +
    `${SecondLineMessage}`
  );
});

StartMenu.setCommand('start');

StartMenu.question(
  () => (hides.email ? `${menuState.userEmail} - Corrigir e-mail` : 'E-mail'),
  'e',
  {
    uniqueIdentifier: String(Math.floor(Math.random() * 999999)),
    questionText: 'Qual seu e-mail de compra na Monetizze ?',
    setFunc: async (_context, answer) => {
      hides.email = true;
      menuState.userEmail = answer;
      State.newState({ userEmail: answer }, tgId);
      await _context.reply(`Recebi seu e-mail: ${answer}`);
    },
    hide: () => dbUser,
  },
);

StartMenu.question(
  () =>
    hides.phone ? `${menuState.userPhone} - Corrigir telefone` : 'Telefone',
  't',
  {
    uniqueIdentifier: String(Math.floor(Math.random() * 999999)),
    questionText: 'Qual seu telefone igual na Monetizze ?',
    setFunc: async (_context, answer) => {
      hides.phone = true;

      const phoneSanitize = answer.normalize('NFD').replace(/[^0-9]*/gi, '');

      menuState.userPhone = phoneSanitize;
      State.newState({ userPhone: phoneSanitize }, tgId);
      await _context.reply(`Recebi seu telefone: ${phoneSanitize}`);
    },
    hide: () => dbUser,
  },
);

StartMenu.simpleButton('✅ Concluir envio de dados', 'cd', {
  doFunc: async _context => {
    await _context.editMessageText(`Certo, vou verificar e já te respondo...`);

    const { first_name, id } =
      _context.update.callback_query.from || _context.update.message.from;

    if (State.getState(tgId).dbUser === null) {
      const createUser = container.resolve(CreateUserService);

      const createdUser = await createUser.execute({
        name: first_name,
        email: menuState.userEmail,
        telefone: menuState.userPhone,
        password: '123456',
        tgId: String(id),
      });

      State.newState({ dbUser: createdUser }, tgId);

      await _context.editMessageText(
        `Registrei seus dados! Acesse o menu de compra ou use o comando /compra`,
      );
    } else {
      await _context.reply(
        `Desculpe, você já fez o cadastro. Se acredita que algum dado está incorreto ` +
          `entre em contato com o suporte`,
      );
    }
  },
  hide: () => !(hides.email && hides.phone),
});

StartMenu.simpleButton('Ajuda', 'help', {
  doFunc: async _context => {
    const currentTgId = _context.update.callback_query.from.id;
    const findUserByTgId = container.resolve(FindUserByTgIdService);
    const dbUserData = await findUserByTgId.execute(String(currentTgId));

    const isSupportLines =
      dbUserData.isSupport || dbUserData.isAdmin
        ? `\n\n/produto - (visível apenas para admins)\n` +
          `Ao usar este comando você inicia o processo de sincronização de produto`
        : ``;

    await _context.editMessageText(
      `Você pode usar os comandos: \n\n/start\n` +
        `Serve para iniciar e cadastrar seus dados.` +
        `\n\n/compra\n` +
        `Ao usar este comando irei buscar e registrar sua compra com base nos seus dados` +
        `\n\n/excluir\n` +
        `Ao usar este comando você apaga sua conta e todas as suas assinaturas regisitradas${isSupportLines}`,
    );
  },
});

export default StartMenu.init({
  actionCode: 'start',
  backButtonText: 'Voltar',
  mainMenuButtonText: 'Voltar ao início',
});
