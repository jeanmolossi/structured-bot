import { ObjectID } from 'mongodb';

import IUserRepository from '@modules/user/repositories/IUserRepository';
import ICreateUserDTO from '@modules/user/dtos/ICreateUserDTO';
import IUpdateUserDTO from '@modules/user/dtos/IUpdateUserDTO';
import UserSchema from '@modules/user/infra/typeorm/schemas/UserSchema';

interface IUpdateUserRequest extends IUpdateUserDTO, UserSchema {}

class UserRepository implements IUserRepository {
  private Users: UserSchema[] = [];

  public async create({
    name,
    email,
    telefone,
    cpf,
    tgId,
    password,
  }: ICreateUserDTO): Promise<UserSchema> {
    const objectId = new ObjectID();
    const user = new UserSchema();

    Object.assign(user, {
      id: objectId,
      name,
      email,
      telefone,
      cpf,
      tgId,
      password,
    });

    this.Users.push(user);

    return user;
  }

  public async findById(userId: string): Promise<UserSchema | null> {
    const findUser = this.Users.find(user => String(user.id) === userId);

    return findUser || null;
  }

  public async findBytgId(userTgId: string): Promise<UserSchema | null> {
    const findUser = this.Users.find(user => user.tgId === userTgId);

    return findUser || null;
  }

  public async findByEmail(userEmail: string): Promise<UserSchema | null> {
    const findUser = this.Users.find(user => user.email === userEmail);

    return findUser || null;
  }

  public async updateUserByTgId(user: IUpdateUserRequest): Promise<UserSchema> {
    const findUserToUpdate = this.Users.findIndex(
      userMap => userMap.tgId === user.tgId,
    );

    if (findUserToUpdate >= 0) {
      this.Users[findUserToUpdate] = {
        ...user,
        name: user.name,
        email: user.email,
        telefone: user.telefone,
        cpf: user.cpf,
        password: user.password,
      };
    }

    return this.Users[findUserToUpdate];
  }

  public async findAll(): Promise<UserSchema[] | null> {
    return this.Users || null;
  }
}

export default UserRepository;
