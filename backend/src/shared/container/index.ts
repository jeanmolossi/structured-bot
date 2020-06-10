import { container } from 'tsyringe';

import '@modules/user/providers';
import '@modules/product/providers';
import './providers';

import UsersRepository from '@modules/user/infra/typeorm/repositories/UsersRepository';
import IUsersRepository from '@modules/user/repositories/IUserRepository';

import ProductRepository from '@modules/product/infra/typeorm/repositories/ProductsRepository';
import IProductRepository from '@modules/product/repositories/IProductRepository';
import ITransactionRepository from '@modules/transactions/repositories/ITransactionRepository';
import TransactionsRepository from '@modules/transactions/infra/typeorm/repositories/TransactionsRepository';

import GroupsRepository from '@modules/groups/infra/typeorm/repositories/GroupsRepository';
import IGroupRepository from '@modules/groups/repositories/IGroupRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IProductRepository>(
  'ProductsRepository',
  ProductRepository,
);

container.registerSingleton<ITransactionRepository>(
  'TransactionsRepository',
  TransactionsRepository,
);

container.registerSingleton<IGroupRepository>(
  'GroupsRepository',
  GroupsRepository,
);
