import AppError from '@shared/errors/AppError';
import ShowUserByIdService from './ShowUserByIdService';

import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import IUserRepository from '../repositories/IUserRepository';

let fakeUserRepository: IUserRepository;

describe('ShowUserById', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
  });

  it('should be able show user infos', async () => {
    const { id } = await fakeUserRepository.create({
      name: 'Jean',
      email: 'jean@email.com',
      telefone: '48984377151',
      cpf: '000000000-00',
      tgId: '123456',
      password: '123456',
    });

    const showUserByIdService = new ShowUserByIdService(fakeUserRepository);
    if (!id) return;
    const userInfo = await showUserByIdService.execute(String(id));
    expect(userInfo).toHaveProperty('id');
  });

  it('should not be able show info from inexistent user', async () => {
    const showUserByIdService = new ShowUserByIdService(fakeUserRepository);

    await expect(
      showUserByIdService.execute('non-valid-user'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
