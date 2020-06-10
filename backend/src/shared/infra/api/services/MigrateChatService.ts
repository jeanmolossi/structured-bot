import { TelegrafContext } from 'telegraf/typings/context';
import { container } from 'tsyringe';
import UpdateGroupService from '@modules/groups/services/UpdateGroupService';
import IGroupModel from '@modules/groups/entities/IGroupModel';
import FindGroupApiService from './FindGroupApiService';

export default class MigrateChatService {
  constructor(private context: TelegrafContext) {
    this.context = context;
  }

  public async execute({
    oldGroup,
    newGroup,
    migrateIs,
  }): Promise<IGroupModel> {
    const findAGroup = container.resolve(FindGroupApiService);

    console.log(oldGroup, '>> OLD GROUP RECEIVED');
    console.log(newGroup, '>> NEW GROUP RECEIVED');

    let currentId = null;
    if (migrateIs === 'to') {
      currentId = oldGroup.currentId;
    } else {
      currentId = newGroup.currentId;
    }

    const groupExists = await findAGroup.execute({
      groupTgId: currentId,
    });

    if (
      groupExists &&
      groupExists.pastId !== 0 &&
      groupExists.currentId === oldGroup.currentId
    )
      return groupExists;

    const updateGroup = container.resolve(UpdateGroupService);
    const updatedGroup = await updateGroup.execute({
      ...oldGroup,
      ...newGroup,
    });
    return updatedGroup;
  }
}
