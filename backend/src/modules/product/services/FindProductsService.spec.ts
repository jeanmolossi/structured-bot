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

    jest
      .spyOn<ICacheProvider, any>(fakeCacheProvider, 'recover')
      .mockImplementationOnce(_ => {
        return [product1, product2];
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

  it('Should be able to List all products, even if not in cache', async () => {
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

    jest.spyOn(fakeCacheProvider, 'recover').mockImplementationOnce(_ => {
      return undefined;
    });

    const products = await findProducts.execute({ hasSync: true });

    expect(products).toEqual([product1, product2]);
  });
});
