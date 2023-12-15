const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Add Product
router.post('/', productController.addProduct);

// Get All Products with Pagination
router.get('/', productController.getAllProducts);

// add "/products?page=2&limit=10" to get all product by page number

// Get a single Product by Id
router.get('/:id', productController.getProductById);

// Edit a product
router.put('/:id', productController.editProduct);

// Delete a Product
router.delete('/:id', productController.deleteProduct);

module.exports = router;
