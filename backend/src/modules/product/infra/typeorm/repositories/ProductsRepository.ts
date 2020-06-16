import IProductRepository from '@modules/product/repositories/IProductRepository';
import { getMongoRepository, MongoRepository } from 'typeorm';
import ICreateProductDTO from '@modules/product/dtos/ICreateProductDTO';
import IFindProductDTO from '@modules/product/dtos/IFindProductDTO';
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

  public async findByProductId(
    productId: number | string,
  ): Promise<ProductSchema | null> {
    const product = await this.ormRepository.findOne({
      where: { productId },
    });

    return product || null;
  }

  public async findAll({
    hasSync = false,
  }: IFindProductDTO): Promise<ProductSchema[]> {
    let products;
    if (hasSync) {
      products = await this.ormRepository.find();
      return products;
    }
    products = await this.ormRepository.find({
      where: { isSync: true },
    });

    return products;
  }
}

export default ProductsRepository;
