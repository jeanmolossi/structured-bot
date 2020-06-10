import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import IProductRepository from '../repositories/IProductRepository';
import FakeProductsRepository from '../repositories/fakes/FakeProductsRepository';

import FindProductsService from './FindProductsService';

let fakeProductsRepository: IProductRepository;

let fakeCacheProvider: ICacheProvider;
let findProducts: FindProductsService;

describe('FindProducts', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    findProducts = new FindProductsService(
      fakeProductsRepository,

      fakeCacheProvider,
    );
  });

  it('Should be able to List all products', async () => {
    const product1 = await fakeProductsRepository.create({
      name: 'valid-product-1',
      productId: 'valid-product-id-1',
      isActive: true,
      isSync: true,
    });

    const product2 = await fakeProductsRepository.create({
      name: 'valid-product-2',
      productId: 'valid-product-id-2',
      isActive: true,
      isSync: true,
    });

    const products = await findProducts.execute({ hasSync: true });

    expect(products).toEqual([product1, product2]);
  });

  it('Should be able to List all products than sync is true', async () => {
    await fakeProductsRepository.create({
      name: 'valid-product-1',
      productId: 'valid-product-id-1',
      isActive: true,
      isSync: false,
    });

    const product2 = await fakeProductsRepository.create({
      name: 'valid-product-2',
      productId: 'valid-product-id-2',
      isActive: true,
      isSync: true,
    });

    const products = await findProducts.execute({});

    expect(products).toEqual([product2]);
  });
});
