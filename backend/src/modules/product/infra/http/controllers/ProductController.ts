import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateProductService from '@modules/product/services/CreateProductService';

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
    return response.json({});
  }

  public async index(request: Request, response: Response): Promise<Response> {
    return response.json({});
  }

  public async update(request: Request, response: Response): Promise<Response> {
    return response.json({});
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    return response.json({});
  }
}

export default ProductController;
