import { injectable, inject } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';
import IGroupRepository from '../repositories/IGroupRepository';
import IGroupModel from '../entities/IGroupModel';

@injectable()
export default class UpdateGroupService {
  constructor(
    @inject('GroupsRepository')
    private groupsRepository: IGroupRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(groupData: IGroupModel): Promise<IGroupModel> {
    const issetGroup = await this.groupsRepository.findByGroupTgId(
      groupData.currentId,
    );

    if (issetGroup) throw new AppError('This Telegram id group already taken');

    const group = await this.groupsRepository.save(groupData);

    await this.cacheProvider.invalidatePrefix('FindGroupByTgId');

    return group;
  }
}
