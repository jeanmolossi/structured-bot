import { container, injectable, inject } from 'tsyringe';
import { ContextNextFunc } from 'telegraf-inline-menu/dist/source/generic-types';

import IUserModel from '@modules/user/entities/IUserModel';
import FindUserByTgIdService from '@modules/user/services/FindUserByTgIdService';
import IMenuTelegrafProvider from '@shared/container/providers/MenuTelegrafProvider/models/IMenuTelegrafProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

@injectable()
class UserExcludeMenu {
  constructor(
    @inject('MenuTelegrafProvider')
    private menuTelegrafProvider: IMenuTelegrafProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public execute(): ContextNextFunc {
    let userFromDb: IUserModel;
    let tgId: string;
    let canceledExclusion: boolean;

    let tryies = 1;

    this.menuTelegrafProvider.setOptions({
      command: 'excluir',
      initializer: async _context => {
        const user = this.menuTelegrafProvider.getFromUser(_context);

        tgId = !tgId ? String(user.id) : tgId;

        canceledExclusion =
          (await this.cacheProvider.recover(`canceledExclusion:${tgId}`)) ||
          false;

        if (
          (_context.match && _context.match.input === 'exclude:cancel') ||
          canceledExclusion
        )
          return 'Cancelado! Você precisa esperar pelo menos 15 minutos para poder tentar esta ação novamente';

        const findUser = container.resolve(FindUserByTgIdService);
        userFromDb = await findUser.execute(tgId);

        const { transactions } = userFromDb;

        const userDataMessage =
          `Dados de usuário:\n\nNome: ${userFromDb.name}\n` +
          `E-mail: ${userFromDb.email}\n` +
          `Telefone: ${userFromDb.telefone}\n`;

        let list: string[] = [`\n\nVocê não tem dados registrados`];
        if (transactions.length >= 0) {
          list = transactions.map(
            transaction =>
              `\n\nDados registrados de compra:\n` +
              `Produto: ${transaction.produto.nome}\n` +
              `Compra: ${transaction.venda.codigo}\n` +
              `Plano: ${transaction.plano.nome}\n` +
              `Assinatura: ${transaction.assinatura.status}\n` +
              `Parcela da assinatura: ${transaction.assinatura.parcela}\n`,
          );
        }

        return (
          `Você tem certeza que deseja excluir sua conta?\n\n${userDataMessage}` +
          `${list.join('\n\n')}`
        );
      },
    });

    this.menuTelegrafProvider.addQuestion({
      text: 'Confirmar exclusão',
      action: 'confirm',
      additionalArgs: {
        uniqueIdentifier: String(Math.floor(Math.random() * 999)),
        questionText: 'Você tem certeza que deseja excluir sua conta?',
        setFunc: async (_, answer): Promise<void> => {
          if (new RegExp(/(confirmar|sim|ok)/gi).test(answer)) {
            await _.reply(`Sua resposta ${answer}`);
          } else {
            if (new RegExp(/(nao|não)/gi).test(answer)) {
              tryies += 2;
            }
            if (tryies > 2) {
              await this.cacheProvider.save(`canceledExclusion:${tgId}`, true);
            } else {
              await _.reply(
                `Sua resposta não foi conclusiva para apagar sua conta\n` +
                  `Tente responder com sim ou confirmar`,
              );
            }
            tryies += 1;
          }
        },
        hide: (): boolean => canceledExclusion === true,
      },
    });

    this.menuTelegrafProvider.addButton({
      buttonType: 'simpleButton',
      buttonProps: {
        text: 'Cancelar',
        action: 'cancel',
        additionalArgs: {
          doFunc: async (_context): Promise<boolean> => {
            try {
              await _context.answerCbQuery('Cancelando...');
              await this.cacheProvider.save(`canceledExclusion:${tgId}`, true);
              return true;
            } catch {
              return true;
            }
          },
          hide: (): boolean => canceledExclusion === true,
          setMenuAfter: true,
        },
      },
    });

    return this.menuTelegrafProvider.init({
      actionCode: 'exclude',
      backButtonText: 'Voltar',
      mainMenuButtonText: 'Voltar ao inicio',
    });
  }
}

export default UserExcludeMenu;
