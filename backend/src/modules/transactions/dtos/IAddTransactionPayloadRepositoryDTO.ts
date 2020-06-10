import TransactionSchema from '../infra/typeorm/schemas/TransactionSchema';

export default interface IAddTransactionPayloadRepositoryDTO {
  user_tgId: string;
  payload: TransactionSchema;
}
