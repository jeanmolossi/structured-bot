import { Router } from 'express';
import ProductController from '../controllers/ProductController';

const productController = new ProductController();

const productRoutes = Router();

productRoutes.post('/create', productController.create);
productRoutes.post('/show', productController.show);
productRoutes.post('/index', productController.index);
productRoutes.post('/update', productController.update);

export default productRoutes;
