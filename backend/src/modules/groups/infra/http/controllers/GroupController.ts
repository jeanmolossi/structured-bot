import { Request, Response } from 'express';
import { container } from 'tsyringe';
import FindAllGroups from '@modules/groups/services/FindAllGroups';
import UpdateGroupService from '@modules/groups/services/UpdateGroupService';

class GroupsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const findAllGroups = container.resolve(FindAllGroups);

    const groups = await findAllGroups.execute();

    const singleGroup = groups.find(group => String(group.id) === id);

    return response.json(singleGroup);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id, product, productId, currentId } = request.body;

    const updateGroup = container.resolve(UpdateGroupService);
    // const updatedGroup = await updateGroup.execute({});

    return response.json({ updated: true, ...request.body });
  }
}

export default GroupsController;
