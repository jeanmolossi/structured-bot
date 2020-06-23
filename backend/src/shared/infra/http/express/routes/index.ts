import { Router } from 'express';
import userRoutes from '@modules/user/infra/http/routes';
import productRoutes from '@modules/product/infra/http/routes/product.routes';
import transactionDomainRoutes from '@modules/transactions/infra/http/routes';
import groupsRoutes from '@modules/groups/infra/http/routes';
import ensureAuthenticated from '../middleware/ensureAuthenticated';

const routes = Router();

routes.use('/users', userRoutes);
routes.use(ensureAuthenticated);
routes.use('/product', productRoutes);
routes.use('/transactions', transactionDomainRoutes);
routes.use('/', groupsRoutes);

export default routes;
