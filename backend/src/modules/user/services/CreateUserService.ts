import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';
import IUserModel from '../entities/IUserModel';
import ICreateUserDTO from '../dtos/ICreateUserDTO';

@injectable()
class CreateUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({
    name,
    email,
    telefone,
    cpf,
    tgId,
    password,
  }: ICreateUserDTO): Promise<IUserModel> {
    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) throw new AppError('E-mail already in use');

    const newUser = await this.userRepository.create({
      name,
      email,
      telefone,
      cpf,
      tgId,
      password,
    });

    return newUser;
  }
}
export default CreateUserService;
