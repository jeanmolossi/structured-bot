import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUserRepository from '../repositories/IUserRepository';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FindUserByTgIdService from './FindUserByTgIdService';

let fakeUsersRepository: IUserRepository;
let fakeCacheProvider: ICacheProvider;

let findUser: FindUserByTgIdService;

describe('FindUserByTgId', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();
    fakeCacheProvider = new FakeCacheProvider();
    findUser = new FindUserByTgIdService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('Should be able returns an user if they exists', async () => {
    const validUser = await fakeUsersRepository.create({
      name: 'valid-name',
      email: 'valid-email',
      cpf: 'valid-cpf',
      telefone: 'valid-phone',
      password: 'valid-password',
      tgId: 'valid-tg-id',
    });

    jest
      .spyOn<ICacheProvider, any>(fakeCacheProvider, 'recover')
      .mockImplementationOnce(() => {
        return validUser;
      });

    const user = await findUser.execute('valid-tg-id');

    expect(user).toEqual(validUser);
  });

  it('Should be able returns an user if they exists, even if not in cache', async () => {
    const validUser = await fakeUsersRepository.create({
      name: 'valid-name',
      email: 'valid-email',
      cpf: 'valid-cpf',
      telefone: 'valid-phone',
      password: 'valid-password',
      tgId: 'valid-tg-id',
    });

    jest
      .spyOn<ICacheProvider, any>(fakeCacheProvider, 'recover')
      .mockImplementationOnce(() => {
        return undefined;
      });

    const user = await findUser.execute('valid-tg-id');

    expect(user).toEqual(validUser);
  });

  it('Should be able return null if user does not exits', async () => {
    const user = await findUser.execute('invalid-tg-id');
    expect(user).toBeNull();
  });
});
