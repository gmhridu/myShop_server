const express = require('express');
const { addToCart, fetchCartItems, updateCart, deleteCartItem } = require('../controllers/cart.controller');

const router = express.Router();

router.post('/add', addToCart);

router.get('/get/:userId', fetchCartItems);

router.put('/update-cart', updateCart);

router.delete('/:userId/:productId', deleteCartItem);

module.exports = router;