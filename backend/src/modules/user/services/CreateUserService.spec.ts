import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';

import CreateUserService from './CreateUserService';
import IUserRepository from '../repositories/IUserRepository';

let fakeUserRepository: IUserRepository;

describe('CreateUserService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
  });

  it('should be able to create a new user', async () => {
    const createUserService = new CreateUserService(fakeUserRepository);

    const user = await createUserService.execute({
      name: 'Jean',
      email: 'jean@email.com',
      telefone: '48984377151',
      cpf: '000000000-00',
      tgId: '123456',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with an email in use', async () => {
    const createUserService = new CreateUserService(fakeUserRepository);

    await createUserService.execute({
      name: 'Jean',
      email: 'jean@email.com',
      telefone: '48984377151',
      cpf: '000000000-00',
      tgId: '123456',
      password: '123456',
    });

    await expect(
      createUserService.execute({
        name: 'Jean 2',
        email: 'jean@email.com',
        telefone: '48984377151',
        cpf: '000000000-00',
        tgId: '123456',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
