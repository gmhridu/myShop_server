const express = require('express');
const { createColor, getAllColor, getColorById } = require('../controllers/color.controller');

const colorRouter = express.Router();

colorRouter.post('/', createColor);

colorRouter.get('/', getAllColor);

colorRouter.get('/:id', getColorById);


module.exports = colorRouter;