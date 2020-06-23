import { Request, Response } from 'express';
import { container } from 'tsyringe';
import FindAllGroups from '@modules/groups/services/FindAllGroups';

class GroupsController {
  public async show(request: Request, response: Response): Promise<Response> {
    const findAllGroups = container.resolve(FindAllGroups);

    const groups = await findAllGroups.execute();

    return response.json(groups);
  }
}

export default GroupsController;
