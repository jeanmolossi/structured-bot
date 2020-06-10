import 'dotenv/config';

import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUserRepository';
import AuthenticateUserService from './AuthenticateUserService';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import IUserRepository from '../repositories/IUserRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: IUserRepository;
let fakeHashProvider: IHashProvider;
let fakeCacheProvider: ICacheProvider;
let authenticateUser: AuthenticateUserService;
let createUser: CreateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('Should be able to authenticate in application', async () => {
    const user = await createUser.execute({
      tgId: 'user-tg-id',
      email: 'user-email',
      password: 'user-password',
      cpf: 'user-cpf',
      name: 'user-name',
      telefone: 'user-phone',
    });

    const authenticate = await authenticateUser.execute({
      tgId: 'user-tg-id',
      email: 'user-email',
      password: 'user-password',
    });

    expect(authenticate).toHaveProperty('token');
    expect(authenticate.user).toEqual(user);
  });

  it('Should not be able to auth with an Unexist user', async () => {
    await expect(
      authenticateUser.execute({
        tgId: 'non-valid-user',
        email: 'non-valid-user',
        password: 'non-valid-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to auth with an invalid E-mail', async () => {
    await createUser.execute({
      tgId: 'user-tg-id',
      email: 'user-email',
      password: 'user-password',
      cpf: 'user-cpf',
      name: 'user-name',
      telefone: 'user-phone',
    });

    await expect(
      authenticateUser.execute({
        tgId: 'user-tg-id',
        email: 'non-valid-email',
        password: 'user-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to auth with an invalid password', async () => {
    await createUser.execute({
      tgId: 'user-tg-id',
      email: 'user-email',
      password: 'user-password',
      cpf: 'user-cpf',
      name: 'user-name',
      telefone: 'user-phone',
    });

    await expect(
      authenticateUser.execute({
        tgId: 'user-tg-id',
        email: 'user-email',
        password: 'invalid-user-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
