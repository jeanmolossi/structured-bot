import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IUserModel from '@modules/user/entities/IUserModel';

import IUserRepository from '../repositories/IUserRepository';
import IUpdateUserDTO from '../dtos/IUpdateUserDTO';

@injectable()
class UpdateUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute(data: IUpdateUserDTO): Promise<IUserModel> {
    const { email, tgId } = data;

    const userInfo = await this.userRepository.findBytgId(tgId);

    if (!userInfo) throw new AppError('User not found!', 404);

    const findUserBySameEmail = await this.userRepository.findByEmail(email);

    if (findUserBySameEmail && email !== userInfo.email)
      throw new AppError('The email already exists', 400);

    const updatedUser = await this.userRepository.updateUserByTgId(data);

    return updatedUser;
  }
}

export default UpdateUserService;
