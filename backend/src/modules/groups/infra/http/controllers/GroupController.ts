import { Request, Response } from 'express';
import { container } from 'tsyringe';
import FindAllGroups from '@modules/groups/services/FindAllGroups';
import UnlinkGroupService from '@modules/groups/services/UnlinkGroupService';
import UpdateGroupService from '@modules/groups/services/UpdateGroupService';

class GroupsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const findAllGroups = container.resolve(FindAllGroups);

    const groups = await findAllGroups.execute();

    const singleGroup = groups.find(group => String(group.id) === id);

    return response.json(singleGroup);
  }

  public async unlink(request: Request, response: Response): Promise<Response> {
    const { currentId } = request.body;

    const unlinkGroup = container.resolve(UnlinkGroupService);
    const updatedGroup = await unlinkGroup.execute(currentId);

    return response.json(updatedGroup);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id, name, currentId, product, productId, pastId } = request.body;

    const updateGroup = container.resolve(UpdateGroupService);

    const updatedGroup = await updateGroup.execute({
      id,
      name,
      currentId: Number(currentId),
      product,
      productId: Number(productId),
      pastId: Number(pastId),
    });

    return response.json(updatedGroup);
  }
}

export default GroupsController;
