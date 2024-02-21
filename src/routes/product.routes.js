const express = require('express');
const productController = require('../controllers/product.controller');
const { isAuthenticated } = require('../middleware/authenticate.middleware');
const router = express.Router();
const loggerMiddleware = require('../middleware/logger.middleware')

// router.get('/', isAuthenticated, productController.getProducts);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/:id', productController.getProductById);

router.get('/', productController.getProducts);
router.post('/create', productController.createProduct);
router.put('/edit/:id', productController.updateProduct);
router.get('/show/:id', productController.getProductById);

module.exports = router;
