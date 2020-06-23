import { Router } from 'express';

import ensureAuthenticated from '@shared/infra/http/express/middleware/ensureAuthenticated';
import GroupsController from '../controllers/GroupsController';

const groupsController = new GroupsController();

const groupRouter = Router();

groupRouter.use(ensureAuthenticated);
// groupRouter.post('/new', groupsController.create);
groupRouter.get('/show', groupsController.show);
// groupRouter.get('/index', groupsController.index);
// groupRouter.put('/update', groupsController.update);

export default groupRouter;
