import ICreateProductDTO from '../dtos/ICreateProductDTO';
import ProductSchema from '../infra/typeorm/schemas/ProductShema';

export default interface IProductRepository {
  create(data: ICreateProductDTO): Promise<ProductSchema>;
}
