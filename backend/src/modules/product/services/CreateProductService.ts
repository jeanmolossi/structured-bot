import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IProductRepository from '../repositories/IProductRepository';
import ProductSchema from '../infra/typeorm/schemas/ProductShema';
import IMonetizzeProvider from '../providers/MonetizzeProvider/models/IMonetizzeProvider';

interface ICreateRequest {
  productId: number | string;
  isActive: boolean;
  isSync: boolean;
  consumerKey: string;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductRepository,

    @inject('MonetizzeProvider')
    private monetizeProvider: IMonetizzeProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    productId,
    isActive,
    isSync,
    consumerKey,
  }: ICreateRequest): Promise<ProductSchema> {
    const product = await this.monetizeProvider.getTransaction(consumerKey, {
      product: productId,
    });

    if (product.dados.length <= 0)
      throw new AppError('Not product infos found in Api');

    const newProduct = await this.productsRepository.create({
      name: product.dados[0].produto.nome,
      productId,
      isActive,
      isSync,
    });

    await this.cacheProvider.invalidatePrefix('FindProduct');

    return newProduct;
  }
}

export default CreateProductService;
