import ICreateProductDTO from '../dtos/ICreateProductDTO';
import ProductSchema from '../infra/typeorm/schemas/ProductShema';
import IFindProductDTO from '../dtos/IFindProductDTO';
import IProductModel from '../entities/IProductModel';

export default interface IProductRepository {
  create(data: ICreateProductDTO): Promise<ProductSchema>;
  findByProductId(productId: string | number): Promise<IProductModel | null>;
  findAll(IFindParam?: IFindProductDTO): Promise<IProductModel[] | null>;
}
