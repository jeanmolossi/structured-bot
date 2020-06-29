import IUserRepository from '@modules/user/repositories/IUserRepository';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUserModel from '@modules/user/entities/IUserModel';
import TransactionSchema from '../infra/typeorm/schemas/TransactionSchema';

@injectable()
export default class ShowUserTransactionsService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(userId: string): Promise<TransactionSchema[]> {
    const cacheKey = `ShowUserById:${userId}`;

    let user = await this.cacheProvider.recover<IUserModel>(cacheKey);

    if (!user) {
      user = await this.usersRepository.findById(userId);

      await this.cacheProvider.save(cacheKey, user);
    }

    if (!user) throw new AppError('User not exists');

    const { transactions } = user;

    if (!transactions) throw new AppError('User has not transactions');

    return transactions;
  }
}
