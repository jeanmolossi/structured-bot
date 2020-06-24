import { injectable, inject } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import AppError from '@shared/errors/AppError';
import IGroupRepository from '../repositories/IGroupRepository';
import IGroupModel from '../entities/IGroupModel';

@injectable()
export default class UnlinkGroupService {
  constructor(
    @inject('GroupsRepository')
    private groupsRepository: IGroupRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(currentId: number): Promise<IGroupModel> {
    const issetGroup = await this.groupsRepository.findByGroupTgId(currentId);

    if (!issetGroup) throw new AppError('This Telegram id group not exists');

    if (issetGroup && !issetGroup.product)
      throw new AppError('This group already unlinked');

    const group = await this.groupsRepository.save({
      ...issetGroup,
      product: null,
      productId: null,
    });

    await this.cacheProvider.invalidatePrefix('FindGroupByTgId');
    await this.cacheProvider.invalidatePrefix('allGroup');

    return group;
  }
}
