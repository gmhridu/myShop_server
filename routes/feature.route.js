const express = require('express');
const { addFeatureImage, getFeatureImage } = require('../controllers/feature.controller');

const router = express.Router();

router.post('/add-feature', addFeatureImage);

router.get('/get-feature', getFeatureImage);


module.exports = router;