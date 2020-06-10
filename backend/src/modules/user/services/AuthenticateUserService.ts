import { injectable, inject } from 'tsyringe';
import { sign } from 'jsonwebtoken';

import jwtConfig from '@config/jsonwebtoken';
import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';
import UserSchema from '../infra/typeorm/schemas/UserSchema';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  tgId: string;
  email: string;
  password: string;
}

interface IResponse {
  user: UserSchema;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRespository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    tgId,
    email,
    password,
  }: IRequest): Promise<IResponse | null> {
    const user = await this.usersRespository.findBytgId(tgId);

    if (!user) throw new AppError('Your credentials are invalid', 401);

    if (user.email !== email)
      throw new AppError('Your credentials are invalid', 401);

    const passwordMatches = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatches)
      throw new AppError('Your credentials are invalid', 401);

    delete user.password;

    const { secret, expiresIn } = jwtConfig;

    const token = sign({ tgId: user.tgId }, secret, {
      subject: String(user.id),
      expiresIn,
    });

    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;
