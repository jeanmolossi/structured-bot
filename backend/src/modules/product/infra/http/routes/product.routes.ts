import { Router } from 'express';
import ProductController from '../controllers/ProductController';

const productController = new ProductController();

const productRoutes = Router();

productRoutes.post('/create', productController.create);
productRoutes.get('/show', productController.show);
productRoutes.get('/index', productController.index);
productRoutes.put('/update', productController.update);

export default productRoutes;
