import { injectable, inject } from 'tsyringe';
import { ObjectID } from 'mongodb';

import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IGroupRepository from '../repositories/IGroupRepository';
import IGroupModel from '../entities/IGroupModel';

interface IRequest {
  name: string;
  product: ObjectID;
  productId: number;
  currentId: number;
  pastId: number;
}

@injectable()
export default class CreateGroupService {
  constructor(
    @inject('GroupsRepository')
    private groupsRepository: IGroupRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    name,
    product,
    productId,
    currentId,
    pastId,
  }: IRequest): Promise<IGroupModel> {
    const groupExists = await this.groupsRepository.findByGroupTgId(currentId);

    if (groupExists)
      throw new AppError('Group with that Telegram Id already exists');

    const group = await this.groupsRepository.create({
      name,
      product,
      productId,
      currentId,
      pastId,
    });

    await this.cacheProvider.invalidatePrefix('FindGroupByTgId');
    await this.cacheProvider.invalidatePrefix('allGroup');

    return group;
  }
}
