import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import IProductRepository from '../repositories/IProductRepository';
import FakeProductsRepository from '../repositories/fakes/FakeProductsRepository';

import FindProductByIdService from './FindProductByIdService';

let fakeProductsRepository: IProductRepository;

let fakeCacheProvider: ICacheProvider;
let findProductById: FindProductByIdService;

describe('FindProductById', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    findProductById = new FindProductByIdService(
      fakeProductsRepository,

      fakeCacheProvider,
    );
  });

  it('Should be able to List an specific product', async () => {
    const product1 = await fakeProductsRepository.create({
      name: 'valid-product-1',
      productId: 123456,
      isActive: true,
      isSync: true,
    });

    jest
      .spyOn<ICacheProvider, any>(fakeCacheProvider, 'recover')
      .mockImplementationOnce(() => {
        return product1;
      });

    const product = await findProductById.execute('123456');

    expect(product).toBe(product1);
  });

  it('Should be able to List an specific product, even if not in cache', async () => {
    const product1 = await fakeProductsRepository.create({
      name: 'valid-product',
      productId: 123,
      isActive: true,
      isSync: true,
    });

    jest.spyOn(fakeCacheProvider, 'recover').mockImplementationOnce(_ => {
      return undefined;
    });

    const product = await findProductById.execute('123');
    expect(product).toBe(product1);
  });
});
