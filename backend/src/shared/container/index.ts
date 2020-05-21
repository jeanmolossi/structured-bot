import { container } from 'tsyringe';

import UserRepository from '@modules/user/infra/mongoose/repositories/UserRepository';
import IUserRepository from '@modules/user/repositories/IUserRepository';

import ProductRepository from '@modules/product/infra/mongoose/repositories/ProductsRepository';
import IProductRepository from '@modules/product/repositories/IProductRepository';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);

container.registerSingleton<IProductRepository>(
  'ProductsRepository',
  ProductRepository,
);
