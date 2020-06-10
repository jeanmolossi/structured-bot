import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';
import IUserRepository from '../repositories/IUserRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

let fakeUserRepository: IUserRepository;
let fakeHashProvider: IHashProvider;
let fakeCacheProvider: ICacheProvider;

describe('CreateUserService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
  });

  it('should be able to create a new user', async () => {
    const createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );

    const user = await createUserService.execute({
      name: 'valid-name',
      email: 'valid-email',
      telefone: 'valid-phone',
      cpf: 'valid-cpf',
      tgId: 'valid-tg-id',
      password: 'valid-password',
      apiConfig: 'valid-api-config',
      isAdmin: false,
      isSupport: false,
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with an email in use', async () => {
    const createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );

    await createUserService.execute({
      name: 'valid-name',
      email: 'same-email',
      telefone: 'valid-phone',
      cpf: 'valid-cpf',
      tgId: 'valid-tg-id',
      password: 'valid-password',
      apiConfig: 'valid-api-config',
      isAdmin: false,
      isSupport: false,
    });

    await expect(
      createUserService.execute({
        name: 'valid-name',
        email: 'same-email',
        telefone: 'valid-phone',
        cpf: 'valid-cpf',
        tgId: 'valid-tg-id',
        password: 'valid-password',
        apiConfig: 'valid-api-config',
        isAdmin: false,
        isSupport: false,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new user with an telegram in use', async () => {
    const createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );

    await createUserService.execute({
      name: 'valid-name',
      email: 'valid-email',
      telefone: 'valid-phone',
      cpf: 'valid-cpf',
      tgId: 'same-tg-id',
      password: 'valid-password',
      apiConfig: 'valid-api-config',
      isAdmin: false,
      isSupport: false,
    });

    await expect(
      createUserService.execute({
        name: 'valid-name',
        email: 'not-same-valid-email',
        telefone: 'valid-phone',
        cpf: 'valid-cpf',
        tgId: 'same-tg-id',
        password: 'valid-password',
        apiConfig: 'valid-api-config',
        isAdmin: false,
        isSupport: false,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
