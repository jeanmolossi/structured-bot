import TransactionSchema from '@modules/transactions/infra/typeorm/schemas/TransactionSchema';

export default interface IUserModel {
  name: string;
  email: string;
  telefone: string;
  cpf: string;
  tgId: string;
  isAdmin: boolean;
  isSupport: boolean;
  apiConfig?: string;
  password?: string;
  transactions?: Array<TransactionSchema>;
}
