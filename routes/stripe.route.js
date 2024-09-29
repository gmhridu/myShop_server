const express = require('express');
const {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
  getAllOrdersByAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} = require("../controllers/stripe.controller");
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post("/create-order", authMiddleware, createOrder);
router.post('/capture', capturePayment);
router.get('/list/:userId', getAllOrdersByUser);
router.get('/details/:id', getOrderDetails);
router.get('/admin/orders', getAllOrdersByAdmin);
router.get('/admin/details/:id', getOrderDetailsForAdmin);
router.put("/admin/update/:id", updateOrderStatus);

module.exports = router;