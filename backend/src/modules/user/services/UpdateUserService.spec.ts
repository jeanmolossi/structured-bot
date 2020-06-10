import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import UpdateUserService from './UpdateUserService';

import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import IUserRepository from '../repositories/IUserRepository';

let fakeUserRepository: IUserRepository;
let fakeCacheProvider: ICacheProvider;

describe('UpdateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeCacheProvider = new FakeCacheProvider();
  });

  it('should be able update user info', async () => {
    await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      telefone: '12-34567891',
      cpf: '123456789-12',
      tgId: '1',
      password: '123456',
    });

    const updateService = new UpdateUserService(
      fakeUserRepository,
      fakeCacheProvider,
    );
    const updatedUser = await updateService.execute({
      name: 'John Trê',
      email: 'johntre@email.com',
      telefone: '12-34567891',
      cpf: '123456789-12',
      tgId: '1',
      password: '123456',
    });

    expect(updatedUser.name).toBe('John Trê');
    expect(updatedUser.email).toBe('johntre@email.com');
  });

  it('should not be able update unexists user', async () => {
    const updateService = new UpdateUserService(
      fakeUserRepository,
      fakeCacheProvider,
    );

    await expect(
      updateService.execute({
        name: 'non-valid-user',
        email: 'non-valid-user',
        telefone: 'non-valid-user',
        cpf: 'non-valid-user',
        tgId: 'non-valid-user',
        password: 'non-valid-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able update user email to an existing email', async () => {
    await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      telefone: '12-34567891',
      cpf: '123456789-12',
      tgId: '1',
      password: '123456',
    });

    await fakeUserRepository.create({
      name: 'John Tre',
      email: 'johntre@email.com',
      telefone: '12-34567891',
      cpf: '123456789-12',
      tgId: '2',
      password: '123456',
    });

    const updateUser = new UpdateUserService(
      fakeUserRepository,
      fakeCacheProvider,
    );

    await expect(
      updateUser.execute({
        name: 'John Doe',
        email: 'johntre@email.com',
        telefone: '12-34567891',
        cpf: '123456789-12',
        tgId: '1',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
