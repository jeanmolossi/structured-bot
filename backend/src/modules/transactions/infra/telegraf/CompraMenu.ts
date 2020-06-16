import { container, injectable, inject } from 'tsyringe';
import { subMonths, startOfDay } from 'date-fns';

import FindUserTransactions from '@modules/transactions/services/FindUserTransactions';
import IUserModel from '@modules/user/entities/IUserModel';
import AddTransactionService from '@modules/transactions/services/AddTransactionService';

import ChatLink from '@shared/infra/api/services/ChatLink';
import FindUserByTgIdService from '@modules/user/services/FindUserByTgIdService';
import FindAdminService from '@modules/user/services/FindAdminService';
import IMenuTelegrafProvider from '@shared/container/providers/MenuTelegrafProvider/models/IMenuTelegrafProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { ContextNextFunc } from 'telegraf-inline-menu/dist/source/generic-types';
import TransactionSchema from '../typeorm/schemas/TransactionSchema';

@injectable()
class CompraMenu {
  constructor(
    @inject('MenuTelegrafProvider')
    private menuTelegrafInline: IMenuTelegrafProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public execute(): ContextNextFunc {
    let tgId: string | number;
    let dbUser: IUserModel;

    this.menuTelegrafInline.setOptions({
      command: 'compra',
      initializer: async _context => {
        tgId =
          this.menuTelegrafInline.getFromUser(_context).id || _context.from?.id;

        tgId = String(tgId);

        const findAdmin = container.resolve(FindAdminService);
        const { apiConfig } = await findAdmin.execute();

        const consumerKey = apiConfig;
        const { first_name } = this.menuTelegrafInline.getFromUser(_context);

        const findUser = container.resolve(FindUserByTgIdService);
        dbUser = await findUser.execute(tgId);

        if (dbUser === null || dbUser === undefined)
          return `${first_name}, envie seus dados em /start antes de acessar este menu`;

        const { email } = dbUser;

        const findUserTransactions = container.resolve(FindUserTransactions);

        const date_min = subMonths(startOfDay(new Date()), 1);

        const transactions = await findUserTransactions.execute(
          {
            consumerKey,
            payload: {
              email,
              date_min,
            },
            userTgId: tgId,
          },
          {
            cpf: dbUser.cpf,
            telefone: dbUser.telefone,
          },
        );

        if (transactions === null) {
          const sendData = `\n\nDados que você enviou:\n\nNome enviado: ${dbUser.name}\nE-mail enviado: ${dbUser.email}\nTelefone enviado: ${dbUser.telefone}`;
          return (
            `Você enviou dados incorretos ou sua transação ainda não está finalizada${sendData}` +
            `\n\nSe seus dados não são estes, solicite suporte para alteração.`
          );
        }

        const addTransaction = container.resolve(AddTransactionService);
        let transactionPayload: TransactionSchema = null;
        let linkMarkdown = '';
        try {
          transactionPayload = await addTransaction.execute({
            user_tgId: tgId,
            payload: transactions,
          });

          if (transactions.assinatura.status === 'Ativa') {
            const chatLink = new ChatLink(_context);
            const groupProduct = -1001361955719;
            const linkReceived = await chatLink.execute({
              chatId: groupProduct,
            });
            linkMarkdown = `[Seu Acesso](${linkReceived})`;
          } else {
            linkMarkdown = 'Sua assinatura não está ativa';
          }
        } catch (err) {
          if (err.message === 'The transaction already exists')
            return (
              `Ou você já sincronizou sua conta ou \n` +
              `Seus dados de compra já estão em uso...`
            );
          return `Ocorreu um erro genérico com seu cadastro. Solicite suporte.`;
        }

        const transactionData =
          `\n\nDados de comprador:\n` +
          `Nome: ${transactionPayload.comprador.nome}\n` +
          `E-mail: ${transactionPayload.comprador.email}\n` +
          `\n\nDados de compra:\n` +
          `Código de compra: ${transactionPayload.venda.codigo}\n` +
          `Plano selecionado: ${transactionPayload.venda.plano}\n` +
          `Produto: ${transactionPayload.produto.nome}\n` +
          `Status de assinatura: ${transactionPayload.assinatura.status}\n`;
        return `Dados encontrados:${transactionData}\n${linkMarkdown}`;
      },
    });

    return this.menuTelegrafInline.init({
      actionCode: 'compra',
      backButtonText: 'Voltar',
      mainMenuButtonText: 'Voltar ao início',
    });
  }
}

export default CompraMenu;
