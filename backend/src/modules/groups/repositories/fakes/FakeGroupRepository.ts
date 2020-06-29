import { ObjectId, ObjectID } from 'mongodb';

import GroupSchema from '@modules/groups/infra/typeorm/schemas/GroupSchema';
import ICreateGroupDTO from '@modules/groups/dtos/ICreateGroupDTO';
import IGroupModel from '@modules/groups/entities/IGroupModel';
import IFindParamDTO from '@modules/groups/dtos/IFindParamDTO';
import AppError from '@shared/errors/AppError';

import IGroupRepository from '../IGroupRepository';

export default class FakeGroupRepository implements IGroupRepository {
  private groups: GroupSchema[] = [];

  public async create({
    name,
    product,
    productId,
    currentId,
    pastId,
  }: ICreateGroupDTO): Promise<IGroupModel> {
    const newGroup = new GroupSchema();
    Object.assign(newGroup, {
      id: new ObjectId(),
      name,
      product,
      productId,
      currentId,
      pastId,
    });

    this.groups.push(newGroup);

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
    const gIndex = this.groups.findIndex(group => group.id === id);

    if (gIndex < 0) throw new AppError('Has not group to update');

    this.groups[gIndex] = {
      ...this.groups[gIndex],
      name,
      currentId,
      pastId,
      product,
      productId,
    };

    return this.groups[gIndex];
  }

  public async findAll({
    exceptHasSync,
  }: IFindParamDTO): Promise<GroupSchema[] | null> {
    if (exceptHasSync) {
      return this.groups.filter(group => group.productId === null) || null;
    }

    return this.groups || null;
  }

  public async findGroupByProductId(
    productId: number,
  ): Promise<GroupSchema | null> {
    const group = this.groups.find(g => g.productId === productId);

    return group || null;
  }

  public async findByGroupTgId(groupTgId: number): Promise<IGroupModel | null> {
    const group = this.groups.find(g => g.currentId === groupTgId);

    return group || null;
  }

  public async findById(groupId: ObjectID): Promise<GroupSchema | null> {
    const group = this.groups.find(g => g.id === groupId);

    return group || null;
  }
}
