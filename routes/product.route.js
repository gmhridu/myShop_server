const express = require("express");
const {
  createProduct,
  getProductById,
  getProducts,
} = require("../controllers/product.controller");
const upload = require("../middlewares/upload");

const productRouter = express.Router();

productRouter.post("/", upload.single("productImage"), createProduct);

productRouter.get("/", getProducts);

// productRouter.get('/pagination', getAllProduct);

// productRouter.get('/data-count', getDataCount);

productRouter.get("/:id", getProductById);

module.exports = productRouter;
