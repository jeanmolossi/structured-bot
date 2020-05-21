import { Request, Response } from 'express';

class ProductController {
  public async create(request: Request, response: Response): Promise<Response> {
    return response.json({});
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
