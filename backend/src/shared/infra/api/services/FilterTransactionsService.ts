import { TelegrafContext } from 'telegraf/typings/context';

import KickChatMember from './KickChatMember';

interface IRequest {
  context: TelegrafContext;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export default class FilterTransactionsService {
  public async execute({
    context,
    chatId,
    userId,
    userFromDb,
  }: IRequest): Promise<boolean> {
    const { transactions } = userFromDb;
    const kickChatMember = new KickChatMember(context);

    let kicked = false;

    const filterTransactions = transactions.filter(
      transaction => transaction.assinatura.status !== 'Ativa',
    );

    if (
      filterTransactions.length > 0 &&
      !userFromDb.isSupport &&
      !userFromDb.isAdmin
    ) {
      kicked = await kickChatMember.execute({ chatId, userId });
    }

    return kicked;
  }
}
