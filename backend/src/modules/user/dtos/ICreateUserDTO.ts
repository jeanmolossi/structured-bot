export default interface ICreateUserDTO {
  name: string;
  email: string;
  telefone: string;
  cpf?: string;
  tgId: string;
  password: string;
  isAdmin?: boolean;
  isSupport?: boolean;
  apiConfig?: string;
}
