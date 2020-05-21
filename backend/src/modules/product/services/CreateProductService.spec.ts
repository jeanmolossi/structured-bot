import IProductRepository from '../repositories/IProductRepository';
import FakeProductsRepository from '../repositories/fakes/FakeProductsRepository';
import CreateProductService from './CreateProductService';

let fakeProductsRepository: IProductRepository;

describe('CreateProduct', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
  });

  it('Should be able to Create new Product', async () => {
    const createProduct = new CreateProductService(fakeProductsRepository);

    const product = await createProduct.execute({
      name: 'Test product',
      productId: 'test-id',
      isActive: true,
      isSync: true,
    });

    expect(product).toHaveProperty('id');
  });
});
