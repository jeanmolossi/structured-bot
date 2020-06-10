import { MongoRepository, getMongoRepository } from 'typeorm';

import IGroupRepository from '@modules/groups/repositories/IGroupRepository';

import ICreateGroupDTO from '@modules/groups/dtos/ICreateGroupDTO';
import IFindParamDTO from '@modules/groups/dtos/IFindParamDTO';
import IGroupModel from '@modules/groups/entities/IGroupModel';
import AppError from '@shared/errors/AppError';
import GroupSchema from '../schemas/GroupSchema';

export default class GroupsRepository implements IGroupRepository {
  private ormRepository: MongoRepository<GroupSchema>;

  constructor() {
    this.ormRepository = getMongoRepository(GroupSchema);
  }

  public async create({
    name,
    product,
    productId,
    currentId,
    pastId,
  }: ICreateGroupDTO): Promise<GroupSchema> {
    const newGroup = this.ormRepository.create({
      name,
      product,
      productId,
      currentId,
      pastId,
    });

    await this.ormRepository.save(newGroup);

    return newGroup;
  }

  public async save({
    id,
    name,
    currentId,
    pastId,
    product,
    productId,
  }: GroupSchema): Promise<GroupSchema> {
    const groupToUpdate = await this.ormRepository.findOneAndUpdate(
      { _id: id },
      { $set: { name, currentId, pastId, product, productId } },
    );

    if (!groupToUpdate) throw new AppError('Group not exists');

    const updated = Object.assign(groupToUpdate.value, {
      name,
      currentId,
      pastId,
      product,
      productId,
    });

    return updated;
  }

  public async findAll({
    exceptHasSync,
  }: IFindParamDTO): Promise<IGroupModel[] | null> {
    if (exceptHasSync) {
      const groups = await this.ormRepository.find({
        where: { productId: null },
      });
      return groups || null;
    }
    const groups = await this.ormRepository.find();
    return groups || null;
  }

  public async findGroupByProductId(
    productId: number,
  ): Promise<GroupSchema | null> {
    const group = await this.ormRepository.findOne({
      where: { productId },
    });

    return group;
  }

  public async findByGroupTgId(groupTgId: number): Promise<GroupSchema | null> {
    const group = await this.ormRepository.findOne({
      where: { currentId: groupTgId },
    });

    return group;
  }
}
