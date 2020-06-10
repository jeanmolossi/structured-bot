import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import IUserRepository from '../repositories/IUserRepository';
import IUserModel from '../entities/IUserModel';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    name,
    email,
    telefone,
    cpf,
    tgId,
    password,
    apiConfig,
    isAdmin,
    isSupport,
  }: ICreateUserDTO): Promise<IUserModel> {
    const userEmailExists = await this.userRepository.findByEmail(email);

    if (userEmailExists) throw new AppError('E-mail already in use');

    const userTgIdExists = await this.userRepository.findBytgId(tgId);

    if (userTgIdExists) throw new AppError('Telegram account already in use');

    const hashedPassword = await this.hashProvider.generateHash(password);

    const newUser = await this.userRepository.create({
      name,
      email,
      telefone,
      cpf,
      tgId,
      password: hashedPassword,
      apiConfig,
      isAdmin,
      isSupport,
    });

    await this.cacheProvider.invalidate('getAllUsers');

    return newUser;
  }
}
export default CreateUserService;
