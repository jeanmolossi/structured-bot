import { ObjectID } from 'mongodb';
import UserSchema from '@modules/user/infra/typeorm/schemas/UserSchema';
import AppError from '@shared/errors/AppError';
import IAddTransactionPayloadRepositoryDTO from '@modules/transactions/dtos/IAddTransactionPayloadRepositoryDTO';

import TransactionSchema from '../../infra/typeorm/schemas/TransactionSchema';
import ITransactionRepository from '../ITransactionRepository';

class FakeTransactionsRepository implements ITransactionRepository {
  private Users: UserSchema[] = [];

  private Transactions: TransactionSchema[] = [];

  public async findAllByUserEmail(
    userEmail: string,
  ): Promise<TransactionSchema[]> {
    const transactionsByEmail = this.Users.filter(
      user => user.email === userEmail,
    );

    return transactionsByEmail[0].transactions;
  }

  public async transactionExists(transaction: string): Promise<boolean> {
    const condition = transaction === String(-1);
    return condition;
  }

  public async addTransaction(
    payload: IAddTransactionPayloadRepositoryDTO,
  ): Promise<TransactionSchema> {
    let userToInsert = this.Users.findIndex(
      user => user.tgId === payload.user_tgId,
    );

    const objectId = new ObjectID();
    const userToPush = new UserSchema();

    Object.assign(userToPush, {
      id: objectId,
      name: 'valid-name',
      email: 'valid-email',
      telefone: 'valid-phone',
      cpf: 'valid-cpf',
      tgId: payload.user_tgId,
      transactions: [] as TransactionSchema[],
    });

    if (userToInsert < 0) {
      this.Users.push(userToPush);

      userToInsert = this.Users.findIndex(
        user => user.tgId === payload.user_tgId,
      );
    }

    if (
      payload.user_tgId === 'invalid-tg-id' ||
      payload.payload.comprador.email === 'invalid-email'
    )
      throw new AppError('Invalid user');

    const newTransaction = new TransactionSchema();

    Object.assign(newTransaction, payload.payload, {
      produto: { codigo: 'valid-code' },
    });

    this.Users[userToInsert].transactions.push(newTransaction);

    return newTransaction;
  }
}

export default FakeTransactionsRepository;
