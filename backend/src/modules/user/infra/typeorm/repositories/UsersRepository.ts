import { MongoRepository, getMongoRepository } from 'typeorm';

import IUserRepository from '@modules/user/repositories/IUserRepository';
import ICreateUserDTO from '@modules/user/dtos/ICreateUserDTO';
import IUpdateUserDTO from '@modules/user/dtos/IUpdateUserDTO';
import TransactionSchema from '@modules/transactions/infra/typeorm/schemas/TransactionSchema';
import UserSchema from '../schemas/UserSchema';

class UsersRepository implements IUserRepository {
  private ormRepository: MongoRepository<UserSchema>;

  private transactionRepository: MongoRepository<TransactionSchema>;

  constructor() {
    this.ormRepository = getMongoRepository(UserSchema);
    this.transactionRepository = getMongoRepository(TransactionSchema);
  }

  public async create(data: ICreateUserDTO): Promise<UserSchema> {
    const newUser = this.ormRepository.create(data);

    await this.ormRepository.save(newUser);

    return newUser;
  }

  public async findAll(): Promise<UserSchema[]> {
    const allUsers = await this.ormRepository.find();

    return allUsers;
  }

  public async findById(userId: string): Promise<UserSchema | null> {
    const findUser = await this.ormRepository.findOne(userId);
    return findUser;
  }

  public async findBytgId(userTgId: string): Promise<UserSchema | null> {
    const findUser = await this.ormRepository.findOne({ tgId: userTgId });
    return findUser;
  }

  public async findByEmail(userEmail: string): Promise<UserSchema | null> {
    const findUser = await this.ormRepository.findOne({ email: userEmail });
    return findUser;
  }

  public async updateUserByTgId(data: IUpdateUserDTO): Promise<UserSchema> {
    const userToUpdate = await this.ormRepository.findOneAndUpdate(
      { tgId: data.tgId },
      { $set: data },
    );

    const userUpdated = Object.assign(userToUpdate.value, data);

    return userUpdated;
  }
}

export default UsersRepository;
