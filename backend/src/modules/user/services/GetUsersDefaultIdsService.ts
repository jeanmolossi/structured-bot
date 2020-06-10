import { injectable, inject } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUserRepository from '../repositories/IUserRepository';
import IUserModel from '../entities/IUserModel';

@injectable()
class GetUsersDefaultIdsService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(): Promise<string[] | null> {
    let filteredUsers = await this.cacheProvider.recover<IUserModel[]>(
      'getAllUsers',
    );

    if (!filteredUsers) {
      filteredUsers = await this.usersRepository.findAll();

      await this.cacheProvider.save('getAllUsers', filteredUsers);
    }

    if (!filteredUsers.length) return null;

    const ids = filteredUsers.map(user => user.tgId);

    return ids;
  }
}

export default GetUsersDefaultIdsService;
