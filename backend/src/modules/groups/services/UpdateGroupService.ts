import { injectable, inject } from 'tsyringe';
import { ObjectID } from 'mongodb';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';

import IGroupRepository from '../repositories/IGroupRepository';
import GroupSchema from '../infra/typeorm/schemas/GroupSchema';
import IUpdateGroupDTO from '../dtos/IUpdateGroupDTO';

@injectable()
export default class UpdateGroupService {
  constructor(
    @inject('GroupsRepository')
    private groupsRepository: IGroupRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(groupData: IUpdateGroupDTO): Promise<GroupSchema> {
    const { id, currentId } = groupData;
    const issetGroup = await this.groupsRepository.findById(id);
    const issetTgGroup = await this.groupsRepository.findByGroupTgId(currentId);

    if (!issetGroup) throw new AppError('The group not exists');

    if (
      issetTgGroup &&
      issetGroup.id !== issetTgGroup.id &&
      issetTgGroup.product &&
      issetTgGroup.productId !== null
    )
      throw new AppError('This Telegram id group already taken');

    const group = await this.groupsRepository.save({
      ...groupData,
      id: new ObjectID(id),
    });

    await this.cacheProvider.invalidatePrefix('allGroup');

    return group;
  }
}
