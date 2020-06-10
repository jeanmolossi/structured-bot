import { Router } from 'express';

import TransactionsController from '../controllers/TransactionsController';

const transactionsController = new TransactionsController();

const transactionsRouter = Router();

transactionsRouter.post('/create', transactionsController.create);

export default transactionsRouter;
