import { inject, injectable } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IProductRepository from '../repositories/IProductRepository';
import IProductModel from '../entities/IProductModel';

interface IFindProductDTO {
  hasSync?: boolean;
}

@injectable()
export default class FindProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    hasSync = false,
  }: IFindProductDTO): Promise<IProductModel[]> {
    const cacheKey = `FindProduct:${hasSync}`;

    let products = await this.cacheProvider.recover<IProductModel[]>(cacheKey);

    if (!products) {
      products = await this.productsRepository.findAll({ hasSync });

      await this.cacheProvider.save(cacheKey, products);
    }

    return products;
  }
}
