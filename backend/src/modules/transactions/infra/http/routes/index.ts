import { Router } from 'express';

import transactionsRouter from './transactions.routes';

const transactionDomainRoutes = Router();

transactionDomainRoutes.use('/', transactionsRouter);

export default transactionDomainRoutes;
