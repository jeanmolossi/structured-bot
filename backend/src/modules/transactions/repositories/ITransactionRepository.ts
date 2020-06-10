import TransactionSchema from '../infra/typeorm/schemas/TransactionSchema';
import IAddTransactionPayloadRepositoryDTO from '../dtos/IAddTransactionPayloadRepositoryDTO';

export default interface ITransactionRepository {
  findAllByUserEmail(userEmail: string): Promise<TransactionSchema[]>;
  transactionExists(transaction: string): Promise<boolean>;
  addTransaction(
    TransactionPayload: IAddTransactionPayloadRepositoryDTO,
  ): Promise<TransactionSchema>;
}
