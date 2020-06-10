import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import IProductRepository from '../repositories/IProductRepository';
import FakeProductsRepository from '../repositories/fakes/FakeProductsRepository';

import CreateProductService from './CreateProductService';

import IMonetizzeProvider from '../providers/MonetizzeProvider/models/IMonetizzeProvider';
import FakeMonetizzeProvider from '../providers/MonetizzeProvider/fakes/FakeMonetizzeProvider';

let fakeProductsRepository: IProductRepository;
let fakeMonetizzeProvider: IMonetizzeProvider;
let fakeCacheProvider: ICacheProvider;
let createProduct: CreateProductService;

describe('CreateProduct', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    fakeMonetizzeProvider = new FakeMonetizzeProvider();

    createProduct = new CreateProductService(
      fakeProductsRepository,
      fakeMonetizzeProvider,
      fakeCacheProvider,
    );
  });

  it('Should be able to Create new Product', async () => {
    const product = await createProduct.execute({
      productId: 'product-id',
      isActive: true,
      isSync: true,
      consumerKey: 'valid-consumer-key',
    });

    expect(product).toHaveProperty('id');
  });

  it('Should not be able to create a new product with invalid credentials', async () => {
    await expect(
      createProduct.execute({
        consumerKey: 'invalid-consumer-key',
        productId: 'product-id',
        isActive: true,
        isSync: true,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create a new product with invalid product Id', async () => {
    await expect(
      createProduct.execute({
        consumerKey: 'valid-consumer-key',
        productId: 'invalid-product-id',
        isActive: true,
        isSync: true,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
