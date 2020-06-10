import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IUserModel from '../entities/IUserModel';
import IUserRepository from '../repositories/IUserRepository';

@injectable()
class FindUserByTgIdService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(userTgId: string): Promise<IUserModel | null> {
    const cacheKey = `FindUserByTgId:${userTgId}`;
    let findUser = await this.cacheProvider.recover<IUserModel>(cacheKey);

    if (!findUser) {
      findUser = await this.usersRepository.findBytgId(userTgId);

      if (!findUser) return null;
      await this.cacheProvider.save(cacheKey, findUser);
    }
    return findUser;
  }
}

export default FindUserByTgIdService;
