import { injectable, inject } from 'tsyringe';

import IMonetizzeProvider from '@modules/product/providers/MonetizzeProvider/models/IMonetizzeProvider';
import AppError from '@shared/errors/AppError';

import TransactionSchema from '../infra/typeorm/schemas/TransactionSchema';
import IUserRepository from '../../user/repositories/IUserRepository';
import ITransactionRepository from '../repositories/ITransactionRepository';
import IAddTransactionPayloadRepositoryDTO from '../dtos/IAddTransactionPayloadRepositoryDTO';

@injectable()
class AddTransactionService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject('MonetizzeProvider')
    private monetizzeProvider: IMonetizzeProvider,

    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionRepository,
  ) {}

  public async execute({
    user_tgId,
    payload,
  }: IAddTransactionPayloadRepositoryDTO): Promise<TransactionSchema> {
    const transactionExists = await this.transactionsRepository.transactionExists(
      String(payload.venda.codigo),
    );

    if (transactionExists) throw new AppError('The transaction already exists');

    const newTransaction = await this.transactionsRepository.addTransaction({
      user_tgId,
      payload,
    });

    return newTransaction;
  }
}

export default AddTransactionService;
