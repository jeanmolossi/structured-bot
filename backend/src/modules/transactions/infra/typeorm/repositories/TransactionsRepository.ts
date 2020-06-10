import ITransactionRepository from '@modules/transactions/repositories/ITransactionRepository';
import { getMongoRepository, MongoRepository } from 'typeorm';
import IAddTransactionPayloadRepositoryDTO from '@modules/transactions/dtos/IAddTransactionPayloadRepositoryDTO';
import UserSchema from '@modules/user/infra/typeorm/schemas/UserSchema';
import TransactionSchema from '../schemas/TransactionSchema';

class TransactionsRepository implements ITransactionRepository {
  private ormRepository: MongoRepository<TransactionSchema>;

  private usersRepository: MongoRepository<UserSchema>;

  constructor() {
    this.ormRepository = getMongoRepository(TransactionSchema);

    this.usersRepository = getMongoRepository(UserSchema);
  }

  public async findAllByUserEmail(
    userEmail: string,
  ): Promise<TransactionSchema[]> {
    const userTransactions = await this.usersRepository.findOne({
      email: userEmail,
    });

    return userTransactions.transactions;
  }

  public async transactionExists(transaction: string): Promise<boolean> {
    const transactionFind = await this.usersRepository.find();
    const transactionBool = transactionFind.filter(
      user =>
        user.transactions &&
        user.transactions.filter(
          transactionObject => transactionObject.venda.codigo === transaction,
        ).length > 0,
    );

    const exists =
      transactionBool.length > 0 && transactionBool[0].transactions.length > 0;

    return exists;
  }

  public async addTransaction(
    addPayload: IAddTransactionPayloadRepositoryDTO,
  ): Promise<TransactionSchema> {
    const userToAddTransaction = await this.usersRepository.findOne({
      tgId: addPayload.user_tgId,
    });

    const newTransaction = this.ormRepository.create(addPayload.payload);

    if (!userToAddTransaction.transactions)
      userToAddTransaction.transactions = [];

    const transactions = [...userToAddTransaction.transactions, newTransaction];

    await this.usersRepository.findOneAndUpdate(
      { tgId: userToAddTransaction.tgId, email: userToAddTransaction.email },
      { $set: { transactions } },
    );

    return newTransaction;
  }
}

export default TransactionsRepository;
