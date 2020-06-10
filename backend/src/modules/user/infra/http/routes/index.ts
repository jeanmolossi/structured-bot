import { Router } from 'express';

import userRoutes from './user.routes';
import sessionRouter from './session.routes';

const userDomainRoutes = Router();

userDomainRoutes.use('/sessions', sessionRouter);
userDomainRoutes.use('/', userRoutes); // HERE IS AUTHENTICATION

export default userDomainRoutes;
