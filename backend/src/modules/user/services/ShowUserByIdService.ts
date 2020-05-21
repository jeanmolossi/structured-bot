import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IUserModel from '@modules/user/entities/IUserModel';

import IUserRepository from '../repositories/IUserRepository';

@injectable()
class ShowUserByIdService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute(userId: string): Promise<IUserModel | null> {
    const userInfo = await this.userRepository.findById(userId);

    if (!userInfo) throw new AppError('User not found!', 404);

    return userInfo;
  }
}

export default ShowUserByIdService;
