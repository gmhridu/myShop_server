const express = require('express');
const { createBrand, getAllBrand, getBrandById } = require('../controllers/brand.controller');

const brandRouter = express.Router();

brandRouter.post('/', createBrand);

brandRouter.get('/', getAllBrand);

brandRouter.get('/:id', getBrandById);


module.exports = brandRouter;