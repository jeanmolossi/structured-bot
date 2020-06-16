import { ObjectID } from 'mongodb';
import IProductRepository from '@modules/product/repositories/IProductRepository';
import ICreateProductDTO from '@modules/product/dtos/ICreateProductDTO';
import IProductModel from '@modules/product/entities/IProductModel';
import ProductSchema from '@modules/product/infra/typeorm/schemas/ProductShema';
import IFindProductDTO from '@modules/product/dtos/IFindProductDTO';

class ProductsRepository implements IProductRepository {
  private products: IProductModel[] = [];

  public async create(data: ICreateProductDTO): Promise<ProductSchema> {
    const productCreated = new ProductSchema();

    Object.assign(productCreated, { id: new ObjectID(), ...data });

    this.products.push(productCreated);

    return productCreated;
  }

  public async findByProductId(
    productId: number | string,
  ): Promise<IProductModel | null> {
    const product = this.products.find(p => p.productId === productId);

    return product;
  }

  public async findAll({
    hasSync = false,
  }: IFindProductDTO): Promise<IProductModel[]> {
    if (hasSync) {
      return this.products;
    }

    const products = this.products.filter(product => product.isSync === true);
    return products;
  }
}

export default ProductsRepository;
