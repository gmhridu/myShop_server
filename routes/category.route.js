
const express = require('express');
const { createCategory, getAllCategory, getCategoryById } = require('../controllers/category.controller');

const categoryRouter = express.Router();

categoryRouter.post('/', createCategory);

categoryRouter.get('/', getAllCategory);

categoryRouter.get('/:id', getCategoryById);


module.exports = categoryRouter;