import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IUserModel from '@modules/user/entities/IUserModel';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUserRepository from '../repositories/IUserRepository';

@injectable()
class ShowUserByIdService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUserRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(userId: string): Promise<IUserModel | null> {
    const cacheKey = `ShowUserById:${userId}`;

    let userInfo = await this.cacheProvider.recover<IUserModel>(cacheKey);

    if (!userInfo) {
      userInfo = await this.userRepository.findById(userId);

      await this.cacheProvider.save(cacheKey, userInfo);
    }

    if (!userInfo) throw new AppError('User not found!', 404);

    return userInfo;
  }
}

export default ShowUserByIdService;
