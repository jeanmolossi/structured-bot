import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import IUserRepository from '../repositories/IUserRepository';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FindAdminService from './FindAdminService';

let fakeUsersRepository: IUserRepository;
let fakeCacheProvider: ICacheProvider;

let findAdmin: FindAdminService;

describe('FindAdminService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();
    fakeCacheProvider = new FakeCacheProvider();
    findAdmin = new FindAdminService(fakeUsersRepository, fakeCacheProvider);
  });

  it('Should be able do list a single admin', async () => {
    const adminUser = await fakeUsersRepository.create({
      name: 'valid-name',
      cpf: 'valid-cpf',
      email: 'valid-email',
      password: 'valid-password',
      tgId: 'valid-tg-id',
      telefone: 'valid-phone',
      isAdmin: true,
      apiConfig: 'valid-api-config',
    });

    jest
      .spyOn<ICacheProvider, any>(fakeCacheProvider, 'recover')
      .mockImplementationOnce(_ => {
        return [adminUser];
      });

    const admin = await findAdmin.execute();

    expect(admin).toBe(adminUser);
  });

  it('Should be able do list a single admin, even if not in cache', async () => {
    const adminUser = await fakeUsersRepository.create({
      name: 'valid-name',
      cpf: 'valid-cpf',
      email: 'valid-email',
      password: 'valid-password',
      tgId: 'valid-tg-id',
      telefone: 'valid-phone',
      isAdmin: true,
      apiConfig: 'valid-api-config',
    });

    jest.spyOn(fakeCacheProvider, 'recover').mockImplementationOnce(() => {
      return undefined;
    });

    const admin = await findAdmin.execute();

    expect(admin).toBe(adminUser);
  });

  it('Should not be able to list an admin if not has api-config', async () => {
    await fakeUsersRepository.create({
      name: 'valid-name',
      cpf: 'valid-cpf',
      email: 'valid-email',
      password: 'valid-password',
      tgId: 'valid-tg-id',
      telefone: 'valid-phone',
      isAdmin: true,
    });

    await expect(findAdmin.execute()).rejects.toBeInstanceOf(AppError);
  });
});
