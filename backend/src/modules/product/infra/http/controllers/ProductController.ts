import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateProductService from '@modules/product/services/CreateProductService';
import FindProductService from '@modules/product/services/FindProductsService';
import FindProductByIdService from '@modules/product/services/FindProductByIdService';
import AppError from '@shared/errors/AppError';

class ProductController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { productId, consumerKey } = request.body;

    const createProduct = container.resolve(CreateProductService);
    const newProduct = await createProduct.execute({
      productId,
      isActive: true,
      isSync: true,
      consumerKey,
    });

    return response.json(newProduct);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const findProducts = container.resolve(FindProductService);

    const products = await findProducts.execute({ hasSync: false });
    return response.json(products);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { productId } = request.query;

    if (!productId)
      throw new AppError('You must provide identifier of product');

    const findProduct = container.resolve(FindProductByIdService);
    const product = await findProduct.execute(String(productId));

    console.log(product, productId);

    return response.json(product);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    return response.json({});
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    return response.json({});
  }
}

export default ProductController;
