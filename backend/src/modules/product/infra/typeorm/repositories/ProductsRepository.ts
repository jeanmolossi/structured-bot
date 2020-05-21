import IProductRepository from '@modules/product/repositories/IProductRepository';
import { getMongoRepository, MongoRepository } from 'typeorm';
import ICreateProductDTO from '@modules/product/dtos/ICreateProductDTO';
import ProductSchema from '../schemas/ProductShema';

class ProductsRepository implements IProductRepository {
  private ormRepository: MongoRepository<ProductSchema>;

  constructor() {
    this.ormRepository = getMongoRepository(ProductSchema);
  }

  public async create({
    productId,
    name,
    isActive,
    isSync,
  }: ICreateProductDTO): Promise<ProductSchema> {
    const newProduct = this.ormRepository.create({
      productId,
      name,
      isActive,
      isSync,
    });

    await this.ormRepository.save(newProduct);

    return newProduct;
  }
}

export default ProductsRepository;
