import { injectable, inject } from 'tsyringe';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IGroupRepository from '../repositories/IGroupRepository';
import IGroupModel from '../entities/IGroupModel';

interface IRequest {
  groupTgId: number;
}

@injectable()
export default class FindGroupByTgIdService {
  constructor(
    @inject('GroupsRepository')
    private groupsRepository: IGroupRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    groupTgId,
  }: IRequest): Promise<IGroupModel | undefined> {
    const cacheKey = `FindGroupByTgId:${groupTgId}`;

    let group = await this.cacheProvider.recover<IGroupModel>(cacheKey);

    if (!group) {
      group = await this.groupsRepository.findByGroupTgId(groupTgId);

      await this.cacheProvider.save(cacheKey, group);
    }

    return group;
  }
}
