const express = require('express');
const { createProduct, getAllProduct, getProductById } = require('../controllers/product.controller');

const productRouter = express.Router();

productRouter.post('/', createProduct);

productRouter.get('/', getAllProduct);

productRouter.get('/:id', getProductById);

module.exports = productRouter;
