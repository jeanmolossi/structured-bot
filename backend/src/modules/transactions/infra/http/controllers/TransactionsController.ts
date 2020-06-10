import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AddTransactionService from '@modules/transactions/services/AddTransactionService';
import ITransactionPayloadDTO from '@modules/product/dtos/ITransactionPayloadDTO';

class TransactionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, transaction, product, consumerKey } = request.body;
    const userTgId = request.user.tgId;

    const addTransaction = container.resolve(AddTransactionService);

    const payload: ITransactionPayloadDTO = {
      email,
      transaction,
      product,
    };

    const newTransaction = await addTransaction.execute({
      consumerKey,
      userTgId,
      payload,
    });

    return response.json(newTransaction);
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

export default TransactionsController;
