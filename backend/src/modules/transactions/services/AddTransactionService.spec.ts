import 'reflect-metadata';
import 'dotenv/config';
import { ObjectID } from 'mongodb';

import IMonetizzeProvider from '@modules/product/providers/MonetizzeProvider/models/IMonetizzeProvider';
import FakeMonetizzeProvider from '@modules/product/providers/MonetizzeProvider/fakes/FakeMonetizzeProvider';
import AppError from '@shared/errors/AppError';

import IUserRepository from '../../user/repositories/IUserRepository';
import AddTransactionService from './AddTransactionService';
import FakeUsersRepository from '../../user/repositories/fakes/FakeUserRepository';
import FakeTransactionsRepository from '../repositories/fakes/FakeTransactionRepository';
import ITransactionRepository from '../repositories/ITransactionRepository';

let fakeUsersRepository: IUserRepository;
let fakeMonetizzeProvider: IMonetizzeProvider;
let fakeTransactionsRepository: ITransactionRepository;

let addTransaction: AddTransactionService;

describe('AddTransaction', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMonetizzeProvider = new FakeMonetizzeProvider();
    fakeTransactionsRepository = new FakeTransactionsRepository();
    addTransaction = new AddTransactionService(
      fakeUsersRepository,
      fakeMonetizzeProvider,
      fakeTransactionsRepository,
    );
  });

  it('Should be able to add a Transaction from Monetizze', async () => {
    await fakeUsersRepository.create({
      name: 'valid-name',
      email: 'valid-email',
      cpf: 'valid-cpf',
      password: 'valid-password',
      telefone: 'valid-phone',
      tgId: 'valid-tgId',
    });

    const transaction = await addTransaction.execute({
      user_tgId: 'valid-tgId',
      payload: {
        id: new ObjectID(),
        venda: { codigo: 1 },
        comprador: { email: 'valid-email' },
      },
    });

    expect(transaction).toHaveProperty('produto');
    expect(transaction.produto).toHaveProperty('codigo');
  });

  it('Should not be able to add a transaction if is Invalid transaction payload', async () => {
    await fakeUsersRepository.create({
      name: 'valid-name',
      email: 'valid-email',
      cpf: 'valid-cpf',
      password: 'valid-password',
      telefone: 'valid-phone',
      tgId: 'valid-tgId',
    });

    await expect(
      addTransaction.execute({
        user_tgId: 'valid-tgId',
        payload: {
          id: new ObjectID(),
          venda: { codigo: 0 },
          comprador: { email: 'invalid-email' },
        },
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to add a transaction already in use', async () => {
    await fakeUsersRepository.create({
      name: 'valid-name',
      email: 'valid-email',
      cpf: 'valid-cpf',
      password: 'valid-password',
      telefone: 'valid-phone',
      tgId: 'valid-tgId',
    });

    await addTransaction.execute({
      user_tgId: 'valid-tgId',
      payload: {
        id: new ObjectID(),
        venda: { codigo: 1 },
        comprador: { email: 'valid-email' },
      },
    });

    await expect(
      addTransaction.execute({
        user_tgId: 'valid-tgId',
        payload: {
          id: new ObjectID(),
          venda: { codigo: -1 },
          comprador: { email: 'valid-email' },
        },
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
