import { Router } from 'express';

import UsersController from '../controllers/UsersController';

const usersController = new UsersController();

const userRoutes = Router();

userRoutes.post('/new', usersController.create);
userRoutes.get('/show', usersController.show);
userRoutes.get('/index', usersController.index);
userRoutes.put('/update', usersController.update);

export default userRoutes;
