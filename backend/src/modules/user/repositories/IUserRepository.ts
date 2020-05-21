import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IUpdateUserDTO from '../dtos/IUpdateUserDTO';
import UserSchema from '../infra/typeorm/schemas/UserSchema';

export default interface IUserRepository {
  create(data: ICreateUserDTO): Promise<UserSchema>;
  findById(userId: string): Promise<UserSchema | null>;
  findBytgId(userTgId: string): Promise<UserSchema | null>;
  findByEmail(userEmail: string): Promise<UserSchema | null>;
  updateUserByTgId(data: IUpdateUserDTO): Promise<UserSchema>;
}
