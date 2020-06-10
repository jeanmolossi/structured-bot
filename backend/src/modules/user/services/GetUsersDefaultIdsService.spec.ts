import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import IUserRepository from '../repositories/IUserRepository';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import GetUsersDefaultIdsService from './GetUsersDefaultIdsService';

let fakeUsersRepository: IUserRepository;
let fakeCacheProvider: ICacheProvider;

let findUsers: GetUsersDefaultIdsService;

describe('GetUsersDefaultIds', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();
    fakeCacheProvider = new FakeCacheProvider();
    findUsers = new GetUsersDefaultIdsService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('Should be able returns users that is not staff', async () => {
    const validUser = await fakeUsersRepository.create({
      name: 'valid-name',
      email: 'valid-email',
      cpf: 'valid-cpf',
      telefone: 'valid-phone',
      password: 'valid-password',
      tgId: 'valid-tg-id',
    });

    const anotherValidUser = await fakeUsersRepository.create({
      name: 'valid-name',
      email: 'valid-email',
      cpf: 'valid-cpf',
      telefone: 'valid-phone',
      password: 'valid-password',
      tgId: 'another-valid-tg-id',
    });

    const staffUser = await fakeUsersRepository.create({
      name: 'valid-name',
      email: 'valid-email',
      cpf: 'valid-cpf',
      telefone: 'valid-phone',
      password: 'valid-password',
      tgId: 'valid-staff-tg-id',
      isSupport: true,
    });

    const user = await findUsers.execute();

    expect(user).toEqual([
      validUser.tgId,
      anotherValidUser.tgId,
      staffUser.tgId,
    ]);
  });

  it('Must be return null if user does not exits or that users are support', async () => {
    const staffUser = await fakeUsersRepository.create({
      name: 'valid-name',
      email: 'valid-email',
      cpf: 'valid-cpf',
      telefone: 'valid-phone',
      password: 'valid-password',
      tgId: 'valid-tg-id',
      isSupport: true,
    });

    const user = await findUsers.execute();

    expect(user).toEqual([staffUser.tgId]);
  });

  it('Should be return null if is not user', async () => {
    const users = await findUsers.execute();
    expect(users).toBeNull();
  });
});
