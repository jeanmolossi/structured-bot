import { ContextNextFunc } from 'telegraf-inline-menu/dist/source/generic-types';
import { injectable, inject, container } from 'tsyringe';

import IMenuTelegrafProvider from '@shared/container/providers/MenuTelegrafProvider/models/IMenuTelegrafProvider';
import FindUserByTgIdService from '@modules/user/services/FindUserByTgIdService';
import CreateUserService from '@modules/user/services/CreateUserService';

@injectable()
class UserStartMenu {
  constructor(
    @inject('MenuTelegrafProvider')
    private menuInlineProvider: IMenuTelegrafProvider,
  ) {}

  execute(): ContextNextFunc {
    let userFromDb: boolean;

    const hides = {
      email: false,
      phone: false,
    };

    const menuState = {
      userEmail: null,
      userPhone: null,
    };

    let tgId = null;

    this.menuInlineProvider.setOptions({
      command: 'start',
      initializer: async _context => {
        const user = this.menuInlineProvider.getFromUser(_context);

        const userName = user.first_name;
        tgId = user.id;

        const findUserByTgId = container.resolve(FindUserByTgIdService);
        userFromDb = (await findUserByTgId.execute(String(tgId))) !== null;

        const SecondLineMessage = !userFromDb
          ? `Me envie os dados abaixo conforme cadastrado na Monetizze.`
          : `Posso tirar algumas de suas dúvidas, toque no botão abaixo.`;

        return (
          `Opa, tudo bem, ${userName}! Fico feliz em falar com você! \n` +
          `${SecondLineMessage}`
        );
      },
    });

    this.menuInlineProvider.addQuestion({
      text: () =>
        hides.email ? `${menuState.userEmail} - Corrigir e-mail` : 'E-mail',
      action: 'e2',
      additionalArgs: {
        uniqueIdentifier: String(Math.floor(Math.random() * 999999)),
        questionText: 'Qual seu e-mail de compra na Monetizze ?',
        setFunc: async (_context, answer): Promise<void> => {
          hides.email = true;
          menuState.userEmail = answer;
          await _context.reply(`Recebi seu e-mail: ${answer}`);
        },
        hide: (): boolean => userFromDb,
      },
    });

    this.menuInlineProvider.addQuestion({
      text: () =>
        hides.phone ? `${menuState.userPhone} - Corrigir telefone` : 'Telefone',
      action: 't2',
      additionalArgs: {
        uniqueIdentifier: String(Math.floor(Math.random() * 999999)),
        questionText: 'Qual seu telefone igual na Monetizze ?',
        setFunc: async (_context, answer): Promise<void> => {
          hides.phone = true;

          const phoneSanitize = answer
            .normalize('NFD')
            .replace(/[^0-9]*/gi, '');

          menuState.userPhone = phoneSanitize;
          await _context.reply(`Recebi seu telefone: ${phoneSanitize}`);
        },
        hide: (): boolean => userFromDb,
      },
    });

    this.menuInlineProvider.addButton({
      buttonType: 'simpleButton',
      buttonProps: {
        text: '✅ Concluir cadastro',
        action: 'cc',
        additionalArgs: {
          doFunc: async (_context): Promise<void> => {
            await _context.editMessageText(
              `Certo, vou verificar e já te respondo...`,
            );

            const { first_name, id } =
              _context.update.callback_query.from ||
              _context.update.message.from;

            if (!userFromDb) {
              const createUser = container.resolve(CreateUserService);

              await createUser.execute({
                name: first_name,
                email: menuState.userEmail,
                telefone: menuState.userPhone,
                password: '123456',
                tgId: String(id),
              });

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
          hide: (): boolean => !(hides.email && hides.phone),
        },
      },
    });

    this.menuInlineProvider.addButton({
      buttonType: 'simpleButton',
      buttonProps: {
        text: 'Ajuda',
        action: 'help',
        additionalArgs: {
          doFunc: async (_context): Promise<void> => {
            const currentTgId = _context.update.callback_query.from.id;
            const findUserByTgId = container.resolve(FindUserByTgIdService);
            const dbUserData = await findUserByTgId.execute(
              String(currentTgId),
            );

            let isSupport = false;
            let isAdmin = false;

            if (dbUserData) {
              isSupport = dbUserData.isSupport;
              isAdmin = dbUserData.isAdmin;
            }

            const isSupportLines =
              isSupport || isAdmin
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
        },
      },
    });

    return this.menuInlineProvider.init({
      actionCode: 'start1',
      backButtonText: 'Voltar',
      mainMenuButtonText: 'Voltar ao início',
    });
  }
}

export default UserStartMenu;
