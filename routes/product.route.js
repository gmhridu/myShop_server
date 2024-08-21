const express = require("express");
const {
  createProduct,
  getProductById,
  getProducts,
} = require("../controllers/product.controller");

const productRouter = express.Router();

productRouter.post("/", createProduct);

productRouter.get("/", getProducts);

// productRouter.get('/pagination', getAllProduct);

// productRouter.get('/data-count', getDataCount);

productRouter.get("/:id", getProductById);

module.exports = productRouter;
