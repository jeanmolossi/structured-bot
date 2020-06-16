import { inject, injectable } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IProductRepository from '../repositories/IProductRepository';
import IProductModel from '../entities/IProductModel';

@injectable()
export default class FindProductByIdService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(productId: string | number): Promise<IProductModel> {
    const cacheKey = `ProductId:${productId}`;

    let product = await this.cacheProvider.recover<IProductModel>(cacheKey);

    if (!product) {
      product = await this.productsRepository.findByProductId(
        Number(productId),
      );

      await this.cacheProvider.save(cacheKey, product);
    }

    return product;
  }
}
