import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUserRepository from '../repositories/IUserRepository';
import IUserModel from '../entities/IUserModel';

@injectable()
class FindAdminService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(): Promise<IUserModel> {
    let getUsers = await this.cacheProvider.recover<IUserModel[]>(
      'getAllUsers',
    );

    if (!getUsers) {
      getUsers = await this.usersRepository.findAll();

      await this.cacheProvider.save('getAllUsers', getUsers);
    }

    const findAdmin = getUsers.filter(user => user.isAdmin && user.apiConfig);

    if (findAdmin.length <= 0)
      throw new AppError('Admin not found or Api is not configured');

    const firstResult = findAdmin[0];

    return firstResult;
  }
}

export default FindAdminService;
