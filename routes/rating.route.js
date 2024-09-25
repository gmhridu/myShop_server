const express = require('express');
const { addProductReview, getProductReviews } = require('../controllers/rating.controller');

const router = express.Router();

router.post('/add-review', addProductReview);
router.get('/get/:productId', getProductReviews);


module.exports = router;