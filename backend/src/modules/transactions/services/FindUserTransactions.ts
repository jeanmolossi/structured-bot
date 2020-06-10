import { injectable, inject } from 'tsyringe';
import { format, subMonths } from 'date-fns';

import IUserRepository from '@modules/user/repositories/IUserRepository';
import IMonetizzeProvider from '@modules/product/providers/MonetizzeProvider/models/IMonetizzeProvider';
import { IDados } from '@modules/product/providers/MonetizzeProvider/models/IMonetizzeResponse';
import ICreateTransactionDTO from '../dtos/ICreateTransactionDTO';

interface IExtraPayload {
  cpf?: string;
  telefone: string;
}

@injectable()
class FindUserTransactions {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject('MonetizzeProvider')
    private monetizzeProvider: IMonetizzeProvider,
  ) {}

  public async execute(
    payload: ICreateTransactionDTO,
    extraPayload: IExtraPayload,
  ): Promise<IDados | null> {
    const { consumerKey } = payload;
    const { email, date_min } = payload.payload;
    const { telefone } = extraPayload;

    const parsedDate = format(
      new Date(date_min).getTime() || subMonths(new Date(), 1),
      'yyyy-MM-dd HH:mm:ss',
    );

    const transactions = await this.monetizzeProvider.getTransaction(
      consumerKey,
      { email, date_min: parsedDate },
    );

    if (transactions.recordCount === '0' || transactions.dados.length <= 0)
      return null;

    const buyData = transactions.dados[0];

    if (!(buyData.comprador.telefone === telefone)) return null;

    return transactions.dados[0];
  }
}

export default FindUserTransactions;
