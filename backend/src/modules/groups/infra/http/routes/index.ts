import { Router } from 'express';

import groupsRoutes from './groups.routes';
import groupRoutes from './group.routes';

const groupRouter = Router();

groupRouter.use('/groups', groupsRoutes); // HERE IS AUTHENTICATION
groupRouter.use('/group', groupRoutes); // HERE IS AUTHENTICATION

export default groupRouter;
