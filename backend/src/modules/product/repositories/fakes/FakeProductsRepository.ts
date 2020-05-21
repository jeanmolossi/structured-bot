import IProductRepository from '@modules/product/repositories/IProductRepository';
import ICreateProductDTO from '@modules/product/dtos/ICreateProductDTO';
import IProductModel from '@modules/product/entities/IProductModel';
import ProductSchema from '@modules/product/infra/typeorm/schemas/ProductShema';
import { ObjectID } from 'mongodb';

class ProductsRepository implements IProductRepository {
  private products: IProductModel[] = [];

  public async create(data: ICreateProductDTO): Promise<ProductSchema> {
    const productCreated = new ProductSchema();

    Object.assign(productCreated, { id: new ObjectID(), ...data });

    this.products.push(productCreated);

    return productCreated;
  }
}

export default ProductsRepository;
