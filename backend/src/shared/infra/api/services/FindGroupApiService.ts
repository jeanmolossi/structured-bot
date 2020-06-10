import { container } from 'tsyringe';

import FindGroupByTgIdService from '@modules/groups/services/FindGroupByTgIdService';
import IGroupModel from '@modules/groups/entities/IGroupModel';

interface IRequest {
  [key: string]: any;
}

export default class FindGroupApiService {
  public async execute({ groupTgId }: IRequest): Promise<IGroupModel> {
    const findGroupByTgId = container.resolve(FindGroupByTgIdService);
    const group = await findGroupByTgId.execute({ groupTgId });
    return group;
  }
}
