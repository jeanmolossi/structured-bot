import ITransactionPayloadDTO from '@modules/product/dtos/ITransactionPayloadDTO';
import IMonetizzeResponse from './IMonetizzeResponse';

export default interface IMonetizzeProvider {
  getToken(consumerKey: string): Promise<string>;
  getTransaction(
    consumerKey: string,
    payload: ITransactionPayloadDTO,
  ): Promise<IMonetizzeResponse>;
}
