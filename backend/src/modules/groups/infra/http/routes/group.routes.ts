import { Router } from 'express';

import ensureAuthenticated from '@shared/infra/http/express/middleware/ensureAuthenticated';
import GroupController from '../controllers/GroupController';

const groupController = new GroupController();

const groupRouter = Router();

groupRouter.use(ensureAuthenticated);
// groupRouter.post('/new', groupController.create);
// groupRouter.get('/show', groupController.show);
groupRouter.get('/index/:id', groupController.index);
groupRouter.put('/update', groupController.update);

export default groupRouter;
