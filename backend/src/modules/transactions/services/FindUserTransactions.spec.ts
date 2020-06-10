import FakeUserRepository from '@modules/user/repositories/fakes/FakeUserRepository';
import IUserRepository from '@modules/user/repositories/IUserRepository';
import IMonetizzeProvider from '@modules/product/providers/MonetizzeProvider/models/IMonetizzeProvider';
import FakeMonetizzeProvider from '@modules/product/providers/MonetizzeProvider/fakes/FakeMonetizzeProvider';
import FindUserTransactions from './FindUserTransactions';

let fakeUsersRepository: IUserRepository;

let fakeMonetizzeProvider: IMonetizzeProvider;

let findUserTransactions: FindUserTransactions;

describe('FindUserTransactions', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();
    fakeMonetizzeProvider = new FakeMonetizzeProvider();

    findUserTransactions = new FindUserTransactions(
      fakeUsersRepository,
      fakeMonetizzeProvider,
    );
  });

  it('Should be able to read all transactions from user', async () => {
    const findTransactions = await findUserTransactions.execute(
      {
        consumerKey: 'valid-consumer-key',
        payload: {
          email: 'valid-email',
        },
        userTgId: 'valid-tg-id',
      },
      {
        cpf: 'valid-cpf',
        telefone: 'valid-phone',
      },
    );
    expect(findTransactions).toHaveProperty('assinatura');
  });

  it('Should be return null if no transactions found', async () => {
    const findTransactions = await findUserTransactions.execute(
      {
        consumerKey: 'valid-consumer-key',
        payload: {
          email: 'invalid-email', // To Fake repo returns null data
        },
        userTgId: 'valid-tg-id',
      },
      {
        cpf: 'valid-cpf',
        telefone: 'valid-phone',
      },
    );
    expect(findTransactions).toBeNull();
  });

  it('Should be return null if invalid data provided', async () => {
    const findTransactions = await findUserTransactions.execute(
      {
        consumerKey: 'valid-consumer-key',
        payload: {
          email: 'valid-email', // To Fake repo returns null data
        },
        userTgId: 'valid-tg-id',
      },
      {
        cpf: 'invalid-cpf',
        telefone: 'invalid-phone',
      },
    );
    expect(findTransactions).toBeNull();
  });
});
