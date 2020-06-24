import { injectable, inject } from 'tsyringe';

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
    const { currentId } = groupData;
    const issetGroup = await this.groupsRepository.findByGroupTgId(currentId);

    if (
      issetGroup &&
      issetGroup.product &&
      (issetGroup.productId !== null || issetGroup.productId !== undefined)
    )
      throw new AppError('This Telegram id group already taken');

    const data = {
      ...groupData,
      id: issetGroup.id,
    };

    const group = await this.groupsRepository.save(data);

    await this.cacheProvider.invalidatePrefix('allGroup');

    return group;
  }
}
