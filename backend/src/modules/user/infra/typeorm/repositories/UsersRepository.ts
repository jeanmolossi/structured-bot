import { MongoRepository, getMongoRepository } from 'typeorm';

import IUserRepository from '@modules/user/repositories/IUserRepository';
import ICreateUserDTO from '@modules/user/dtos/ICreateUserDTO';
import IUpdateUserDTO from '@modules/user/dtos/IUpdateUserDTO';
import UserSchema from '../schemas/UserSchema';

class UsersRepository implements IUserRepository {
  private ormRepository: MongoRepository<UserSchema>;

  constructor() {
    this.ormRepository = getMongoRepository(UserSchema);
  }

  public async create(data: ICreateUserDTO): Promise<UserSchema> {
    const newUser = this.ormRepository.create(data);

    this.ormRepository.save(newUser);

    return newUser;
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
    const userToUpdate = await this.ormRepository.updateOne(
      { tgId: data.tgId },
      data,
    );

    const updatedUser = await this.ormRepository.findOne({
      id: userToUpdate.upsertedId._id,
    });

    return updatedUser;
  }
}

export default UsersRepository;
