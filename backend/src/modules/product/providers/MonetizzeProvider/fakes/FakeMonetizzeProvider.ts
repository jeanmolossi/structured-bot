import ITransactionPayloadDTO from '@modules/product/dtos/ITransactionPayloadDTO';
import AppError from '@shared/errors/AppError';
import { ObjectID } from 'mongodb';
import IMonetizzeProvider from '../models/IMonetizzeProvider';
import IMonetizzeResponse from '../models/IMonetizzeResponse';

class FakeMonetizzeProvider implements IMonetizzeProvider {
  public async getToken(consumerKey: string): Promise<string> {
    return `${consumerKey}-valid-token`;
  }

  public async getTransaction(
    consumerKey: string,
    payload: ITransactionPayloadDTO,
  ): Promise<IMonetizzeResponse> {
    if (consumerKey === 'invalid-consumer-key')
      throw new AppError('Invalid consumer key');

    const responseApi: IMonetizzeResponse = {
      status: 200,
      dados: [
        {
          id: new ObjectID(),
          produto: {
            codigo: 'valid-product-code',
            chave: 'valid-product-key',
            nome: 'valid-product-name',
          },
          venda: {
            codigo: payload.transaction,
            status: 'Finalizada',
          },
          plano: {
            codigo: '72157',
            referencia: 'SZ72157',
            nome: 'Plano Mensal CARTÃO',
            quantidade: '0',
            periodicidade: 'Mensal',
          },
          assinatura: {
            codigo: 'valid-sign-code',
            status: 'valid-sign-status',
          },
          comissoes: [],
          comprador: {
            nome: 'valid-name',
            email: payload.email,
            cnpj_cpf: 'valid-cpf',
            telefone: 'valid-phone',
          },
        },
      ],
      recordCount: '1',
      error: '',
      pages: '1',
    };

    if (
      payload.product === 'invalid-product-id' ||
      payload.email === 'invalid-email' ||
      payload.transaction === 0
    )
      return {
        status: 200,
        error: '',
        pages: 1,
        recordCount: 1,
        dados: [],
      };

    return responseApi;
  }
}

export default FakeMonetizzeProvider;
