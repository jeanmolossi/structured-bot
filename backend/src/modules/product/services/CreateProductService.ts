import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import IProductRepository from '../repositories/IProductRepository';
import ICreateProductDTO from '../dtos/ICreateProductDTO';
import ProductSchema from '../infra/typeorm/schemas/ProductShema';

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductRepository,
  ) {}

  public async execute({
    name,
    productId,
    isActive,
    isSync,
  }: ICreateProductDTO): Promise<ProductSchema> {
    const newProduct = await this.productsRepository.create({
      name,
      productId,
      isActive,
      isSync,
    });

    return newProduct;
  }
}

export default CreateProductService;
