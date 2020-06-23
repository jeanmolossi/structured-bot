import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import GroupSchema from '../infra/typeorm/schemas/GroupSchema';
import IGroupRepository from '../repositories/IGroupRepository';

@injectable()
export default class FindAllGroups {
  constructor(
    @inject('GroupsRepository')
    private groupsRepository: IGroupRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(exceptHasSync = false): Promise<GroupSchema[] | null> {
    const cacheKey = `allGroup:${exceptHasSync}`;
    let groups = await this.cacheProvider.recover<GroupSchema[]>(cacheKey);

    if (!groups) {
      groups = await this.groupsRepository.findAll({ exceptHasSync });

      await this.cacheProvider.save(cacheKey, groups);
    }

    return groups;
  }
}
