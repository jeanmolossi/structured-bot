import ITransactionPayloadDTO from '@modules/product/dtos/ITransactionPayloadDTO';

export default interface ICreateTransactionDTO {
  consumerKey: string;
  userTgId: string;
  payload: ITransactionPayloadDTO;
}
