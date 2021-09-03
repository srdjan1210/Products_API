const express = require('express');

const router = express.Router();
const productController = require('../controllers/productController')
const authController = require('../controllers/authController')



router.route('/')
    .post(authController.tokenValidation, authController.authorize('admin'), productController.createProduct)
    .get(productController.getAllProducts)

router.route('/:id')
    .get(productController.getProduct)
    .patch(authController.tokenValidation, authController.authorize('admin'), productController.updateProduct)
    .delete(authController.tokenValidation, authController.authorize('admin'), productController.deleteProduct)



module.exports = router;