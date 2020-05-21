import { Router } from 'express';
import userRoutes from '@modules/user/infra/http/routes/user.routes';
import productRoutes from '@modules/product/infra/http/routes/product.routes';

const routes = Router();

routes.use('/users', userRoutes);
routes.use('/product', productRoutes);

export default routes;
